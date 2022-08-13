import { getBaseData, getUrl } from "./lib/getBaseData";
import { addTask, handleBeforeUnload } from "./lib/sendBeacon";
import { Pv, StayTime } from "./lib/types";
import { uuid } from "./lib/uuid";

let _session: Session         // 当前页面的会话实例
let _history: UrlHistory      // 当前标签页的 url 监控实例

/**
 * 初始化 pv 模块
 */
export function initPv(): void {
  _session = new Session()  // 新建会话
  _history = new UrlHistory()  // 监听路由
}

/**
 * 创建新的 Session 实例
 * 同时销毁之前的实例 
 */
function createSession():void{
  _session.destroySession()
  _session = new Session()
}


/**
 * 构造并发送 pv 数据
 */
function sendPv() {
  const pageURL = getUrl()
  const uuid = localStorage.getItem("prometheus_uuid")

  const task: Pv = {
    ...getBaseData(),
    behaviorType: "pv",
    type: "behavior",
    pageURL,
    uuid
  }

  console.log("sendPv", task)
  addTask(task)
}

/**
 * 构造并发送 stayTime 数据
 */
function sendStayTime(stayTime: DOMHighResTimeStamp) {
  const pageURL = getUrl()
  const uuid = localStorage.getItem("prometheus_uuid")

  const task: StayTime = {
    ...getBaseData(),
    behaviorType: "staytime",
    type: "behavior",
    pageURL,
    stayTime,
    uuid
  }
  handleBeforeUnload(task)
}

/**
 * 会话，每个页面的会话不一样
 */
class Session {
  private readonly sid: string = uuid()                    // 会话的唯一标识符，每个页面的会话不同
  private timeLimit: number                                // 会话最长保留时间 (min)
  private sendPvTimer: NodeJS.Timeout | null = null        // 检查页面可见维持 3s 的定时器
  private visitStartTime: DOMHighResTimeStamp              // 本次会话开始访问页面的时间
  private visitEndTime: DOMHighResTimeStamp | null = null  // 本次会话结束访问页面的时间
  private viewFlag:boolean = false                         // 标识是否浏览过页面

  private readonly handleVisChange = ():void => {
    this.handlePageVisibility()
  }
  private readonly handleBeforeUnload = ():void => {
    if (this.sendPvTimer) clearTimeout(this.sendPvTimer)  // 无效 pv
    else sendStayTime(Date.now() - this.visitStartTime)   // 发送 staytime 数据
  }

  constructor(timeLimit: number = 30) {
    this.timeLimit = timeLimit
    this.handlePageVisibility()
    this.initListener()

    sessionStorage.setItem('prometheus_sid', this.sid)
  }

  /**
   * 初始化 页面可见性 的监听器
   */
  initListener(): void {
    document.addEventListener('visibilitychange', this.handleVisChange)
    window.addEventListener("beforeunload", this.handleBeforeUnload)
  }

  /**
   * 页面可见性事件处理函数。
   * 在页面首次打开时，即初始化实例时也执行一次。
   */
  handlePageVisibility(): void {
    if (document.hidden) {
      // 1. 首次打开页面（在后台）：不作处理
      if(!this.viewFlag) return

      // 2. 已浏览过页面后，页面隐藏：
      // 刷新会话结束时间，记录浏览结束时间 以及 清除发送数据的定时器
      clearTimeout(this.sendPvTimer)
      this.refreshSession()
      this.visitEndTime = Date.now()

    } else {
      // 3.已浏览过页面后，页面再次可见且会话未过期：不作处理
      if(this.viewFlag && !this.isExpired()) return

      // 4.首次打开页面（在前台），准备发送数据
      if(!this.viewFlag) this.viewFlag = true 

      // 5.已浏览过页面后，页面再次可见且会话过期：补上前次的 stayTime 数据。
      if(this.visitEndTime) sendStayTime(this.visitEndTime - this.visitStartTime)

      this.visitStartTime = Date.now()
      this.startSendPvTimer()
    }
  }

  /**
   * 设置一个定时器。
   * 如果定时器到期页面仍然可见，没有关闭页面，也没有隐藏。
   * 则算作一次有效 pv
   */
  startSendPvTimer(): void {
    clearTimeout(this.sendPvTimer)
    this.sendPvTimer = setTimeout(() => {
      sendPv()
    }, 3000)
  }

  /**
   * 检查会话是否已过期
   * @returns true:已过期 false:未过期
   */
  isExpired(): boolean {
    return +sessionStorage.getItem(this.sid) < Date.now()
  }

  /**
   * 页面不可见时刷新会话时间
   */
  refreshSession(): void {
    const newTime = `${Date.now() + this.timeLimit * 1000 * 60}`
    sessionStorage.setItem(this.sid, newTime)
  }

  /**
   * 会话结束时销毁实例
   */
  destroySession(): void {
    localStorage.removeItem(this.sid)
    document.removeEventListener('visibilitychange', this.handleVisChange)
    window.removeEventListener("beforeunload", this.handleBeforeUnload)
  }
}

/**
 * 监听 url 改变，在 url 变化时重新创建会话
 */
class UrlHistory {
  private oldUrl: string = getUrl()   // 当前页面的 URL
  static instance:UrlHistory

  constructor() {
    if(UrlHistory.instance) return UrlHistory.instance

    UrlHistory.instance = this
    this.initPopStateListener()
    this.rewritePushState()
    this.rewriteReplaceState()
  }

  /**
   * 初始化 url 改变的监听器
   */
  initPopStateListener(): void {
    // 监听点击浏览器上的 后退、前进 按钮 / 调用 history.back() / forward() / go()
    window.addEventListener('popstate', (e) => {
      console.log(this)
      const newUrl = location.href
      console.log('[popState] newUrl:', newUrl, "oldUrl:", this.oldUrl, newUrl === this.oldUrl)
      if (newUrl === this.oldUrl) return;

      this.oldUrl = newUrl
      createSession()
    })
  }

  /**
   * 覆写 history.pushState
   */
  rewritePushState(): void {
    if (!history.pushState) return

    const _pushState = history.pushState
    history.pushState = (data: any, title: string, url?: string | URL): void => {
      if (url === this.oldUrl) return

      this.oldUrl = (url instanceof URL) ? url.toString() : document.location.origin + '/' + url
      _pushState.call(history, data, title, url)
      createSession()
    }
  }

  /**
   * 覆写 history.replaceState
   */
  rewriteReplaceState(): void {
    if (!history.replaceState) return

    const _replaceState = history.replaceState
    history.replaceState = (data: any, title: string, url?: string | URL): void => {
      if (url === this.oldUrl) return

      this.oldUrl = (url instanceof URL) ? url.toString() : document.location.origin + '/' + url
      _replaceState.call(history, data, title, url)
      createSession()
    }
  }
}


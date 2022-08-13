import { getBaseData } from "./lib/getBaseData";
import { addTask, handleBeforeUnload } from "./lib/sendBeacon";
import { Pv, StayTime } from "./lib/types";

let _session: Session
let _history: History
export function initPv(): void {
  // 新建会话
  _session = new Session();
  // 监听路由
  _history = new History()
}

function getUrl(): string {
  const { origin, pathname } = document.location
  console.log("url is:", origin + pathname)
  return origin + pathname
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
    type: "behavior",
    pageURL,
    behaviorType: "staytime",
    stayTime,
    uuid
  }
  handleBeforeUnload(task)
}


class Session {
  private timeLimit: number                     // 会话最长保留时间 (min)
  private sendPvTimer: NodeJS.Timeout | null    // 检查页面可见维持 3s 的定时器
  private visitStartTime: DOMHighResTimeStamp

  static instance: Session | null = null        // 单例模式

  constructor(timeLimit: number = 30) {
    if (!Session.instance) {
      this.timeLimit = timeLimit
      this.visitStartTime = Date.now()
      this.sendPvTimer = null
      this.handlePageVisibility()
      this.initListener()

      Session.instance = this
    }
    else return Session.instance
  }

  /**
   * 页面可见性事件处理函数。
   * 在页面首次打开时，即初始化实例时也执行一次。
   */
  handlePageVisibility(): void {
    // 如果 sessionStorage 中包含有 "session_key"，说明有至少一次有效 Pv。
    // 1. 首次打开页面（在后台），则不作处理
    if (!sessionStorage.getItem('session_key') && document.hidden) return

    // 2. [if]   至少一次有效 Pv 后页面隐藏，刷新会话 以及 清除发送数据的定时器
    // 3. [else] 首次打开页面（在前台），准备发送数据
    //           至少一次有效 Pv 后再次打开页面 且会话过期，准备发送数据
    if (document.hidden) {
      this.refreshSession()
      clearTimeout(this.sendPvTimer)
    } else if (this.isExpired()) {
      this.visitStartTime = Date.now()
      this.startSendPvTimer()
    }
  }

  startSendPvTimer(): void {
    // 如果定时器到期页面仍然可见，没有关闭页面，也没有隐藏
    // 则算作一次有效 pv
    clearTimeout(this.sendPvTimer)
    this.sendPvTimer = setTimeout(() => {
      sendPv()
    }, 3000)
  }

  /**
   * 初始化 页面可见性 的监听器
   */
  initListener(): void {
    document.addEventListener('visibilitychange', (e: Event): void => {
      this.handlePageVisibility()
    })
    window.addEventListener("beforeunload", (e: BeforeUnloadEvent): void => {
      if (this.sendPvTimer) clearTimeout(this.sendPvTimer)
      else sendStayTime(Date.now() - this.visitStartTime)
    })
  }

  /**
   * 检查会话是否已过期
   * @returns true:已过期 false:未过期
   */
  isExpired(): boolean {
    if (!sessionStorage.getItem('session_key')) {
      const newTime = `${new Date(0).getTime()}`
      sessionStorage.setItem('session_key', newTime)
    }
    console.log(Date.now(), "<>", sessionStorage.getItem('session_key'))
    return +sessionStorage.getItem('session_key') < Date.now()
  }

  /**
   * 离开页面时刷新会话时间
   */
  refreshSession(): void {
    const newTime = `${Date.now() + this.timeLimit * 1000 * 60}`
    sessionStorage.setItem('session_key', newTime)
  }
}




class History {
  private url: string
  constructor() {
    console.log('?')
    this.url = getUrl()
    this.initURLChangeListener()
    this.rewritePushState()
  }

  initURLChangeListener(): void {
    // 监听 hash 更改事件
    window.addEventListener('hashchange', (e) => {
      console.log('[HashChange]', e)
    })
    // 监听 点击后退，前进按钮 / 调用 history.back() / forward() / go()
    window.addEventListener('popstate', (e) => {
      console.log('?', this.url)
      const newUrl = location.href
      console.log('[popState] newUrl:', newUrl, "oldUrl:", this.url, newUrl === this.url)
      if (newUrl === this.url) return;

      this.url = newUrl
      _session.startSendPvTimer()
    })
  }

  rewritePushState(): void {
    if (!history.pushState) return
    const pushState = history.pushState
    history.pushState = function (data: any, title: string, url?: string | URL): void {
      if (url === this.url) return

      this.url = (url instanceof URL) ? url.toString() : document.location.origin + '/' + url
      console.log('[pushState]:', this.url)
      _session.startSendPvTimer()
      pushState.apply(this, arguments)
      console.log(this.url)
    }

    // 覆写 replaceState
    const replaceState = history.replaceState
    history.replaceState = function (data: any, title: string, url?: string | URL): void {
      if (url === this.url) return

      this.url = (url instanceof URL) ? url.toString() : document.location.origin + '/' + url
      console.log('[replaceState]:', this.url)
      _session.startSendPvTimer()
      replaceState.apply(this, arguments)
      console.log(this.url)
    }
  }


}


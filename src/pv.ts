import { getBaseData } from "./lib/getBaseData";
import { addTask } from "./lib/sendBeacon";
import { Pv } from "./lib/types";

export function initPv(): void {
  // 新建会话
  let session: Session = new Session();
}

/**
 * 构造并发送 pv 数据
 */
function sendPv() {
  const { origin, pathname } = document.location
  const uuid = localStorage.getItem("prometheus_uuid")

  // TODO:基本信息每次都重新获取吗? 还没想好
  const task: Pv = {
    ...getBaseData(),
    behaviorType: "pv",
    type: "behavior",
    pageURL: origin + pathname,
    uuid
  }

  console.log("sendPv", task)
  addTask(task)
}

class Session {
  private timeLimit: number                     // 会话最长保留时间 (min)
  private sendPvTimer: NodeJS.Timeout | null    // 检查页面可见维持 3s 的定时器

  static instance: Session | null = null        // 单例模式

  constructor(timeLimit: number = 1) {
    if (!Session.instance) {
      this.timeLimit = timeLimit
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
  handlePageVisibility():void {
    // 如果 sessionStorage 中包含有 "session_key"，说明有至少一次有效 Pv。
    // 1. 首次打开页面（在后台），则不作处理
    if(!sessionStorage.getItem('session_key') && document.hidden) return 

    // 2. [if]   至少一次有效 Pv 后页面隐藏，刷新会话 以及 清除发送数据的定时器
    // 3. [else] 首次打开页面（在前台），准备发送数据
    //           至少一次有效 Pv 后再次打开页面 且会话过期，准备发送数据
    if (document.hidden) {
      this.refreshSession()
      clearTimeout(this.sendPvTimer)
    } else if (this.isExpired()) {
      // 如果定时器到期页面仍然可见，没有关闭页面，也没有隐藏
      // 则算作一次有效 pv
      console.log("setTimeout", new Date())
      this.sendPvTimer = setTimeout(() => {
        sendPv()
      }, 3000)
    }
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
    })
  }

  /**
   * 检查会话是否已过期
   * @returns true:已过期 false:未过期
   */
  isExpired(): boolean {
    if(!sessionStorage.getItem('session_key')){
      const newTime = `${new Date(0).getTime()}`
      sessionStorage.setItem('session_key', newTime)
    }
    console.log(Date.now() , "<>",  sessionStorage.getItem('session_key'))
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

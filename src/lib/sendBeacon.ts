import {TrackData, Deadline} from './types.js'

// const baseURL = "/v1/api/upload/"
const baseURL = "http://localhost:8081/sendBeacon"
const hasRequestIdleCallback = ('requestIdleCallback' in window)

/**
 * 发送监控数据至服务端
 * @param data 监控数据
 */
function send(data: TrackData):void {
  console.log("sendBeacon", data)
  // const url = baseURL + data.type;
  const url = baseURL

  if(navigator && navigator.sendBeacon) {
    // navigator.sendBeacon 可用
    const beacon: BodyInit = JSON.stringify(data)
    navigator.sendBeacon(url, beacon)
  } else {
    // polyfill
  }
}


// 任务队列
const taskQueue:Array<TrackData> = new Array();

/**
 * 每一帧执行一次的函数
 * @param deadline 自动传入回调函数的参数，表示帧的剩余空闲时间
 */
function tick(deadline:Deadline) {
  const remaining = deadline.timeRemaining()

  // 如果还有剩余执行时间，且任务队列不为空，则发送任务队列中的任务
  while (remaining > 0 && taskQueue.length) {
    const currentTask = taskQueue.shift()
    send(currentTask)
  }

  // 再次注册，在下一个帧间隙继续执行taskQueue中的任务
  (window as any).requestIdleCallback(tick, { timeout: 500 })
}

/**
 * 向任务队列中添加任务
 */
 export function addTask(task:TrackData){
  console.log("addTask", task)
  taskQueue.push(task)
}

// TODO:window.requestIdleCallback 会报错！但是 requestAnimationFrame 不会
// requestIdleCallback 的类型定义好像被 @deprecated 注解了
// (在 typescript/lib/lib.dom.d.ts 里面)
hasRequestIdleCallback && (window as any).requestIdleCallback(tick, { timeout: 500 })

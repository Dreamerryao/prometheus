import { TrackData, Deadline, StayTime } from './types.js'

const baseURL = "http://120.55.12.109:8080/v1/api/upload/"
const hasRequestIdleCallback = ('requestIdleCallback' in window)

/**
 * 发送监控数据至服务端
 * @param data 监控数据
 */
function send(data: TrackData[] | TrackData): void {
  // 将数据全部处理成数组
  const datas = (data instanceof Array)? data : new Array(data)  
  console.log("sendBeacon", datas)

  // navigator.sendBeacon 可用
  if (navigator && navigator.sendBeacon) {
    datas.forEach((data:TrackData) => {
      const url = baseURL + data.type;
      const beacon = JSON.stringify(data)
      navigator.sendBeacon(url, beacon)
    })
  } else {
    // img 打点
    // const img = document.createElement('img')
    // img.src = ''
  }
}


// 任务队列
const taskQueue: Array<TrackData> = new Array();

/**
 * 每一帧执行一次的函数
 * @param deadline 自动传入回调函数的参数，表示帧的剩余空闲时间
 */
function tick(deadline: Deadline) {
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
export function addTask(task: TrackData) {
  console.log("addTask", task)
  taskQueue.push(task)
}

/**
 * beforeUnload 事件触发时执行，
 * 发送队列中未发送的数据，以及用户停留时长的数据
 * @param stayTimeData 用户停留时长的数据
 */
export function handleBeforeUnload(stayTimeData: StayTime) {
  send([...taskQueue, stayTimeData])
}


// TODO:window.requestIdleCallback 会报错！但是 requestAnimationFrame 不会
// requestIdleCallback 的类型定义好像被 @deprecated 注解了
// (在 typescript/lib/lib.dom.d.ts 里面)
hasRequestIdleCallback && (window as any).requestIdleCallback(tick, { timeout: 500 })

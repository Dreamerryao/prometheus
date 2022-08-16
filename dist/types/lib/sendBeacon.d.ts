import { TrackData, StayTime } from './types.js';
/**
 * 向任务队列中添加任务
 */
export declare function addTask(task: TrackData): void;
/**
 * beforeUnload 事件触发时执行，
 * 发送队列中未发送的数据，以及用户停留时长的数据
 * @param stayTimeData 用户停留时长的数据
 */
export declare function handleBeforeUnload(stayTimeData: StayTime): void;

import {TrackData} from './types.js'

const baseURL = "/v1/api/upload/"

const taskArray:TrackData[] = new Array();

const taskArrayProxy = new Proxy(taskArray, {
  set:function(target, key, val, receiver):boolean{
    
    return true;
  }
})

export function send(data: TrackData): void {
  const url:string = baseURL + data.type;

  if(navigator && navigator.sendBeacon) {
    // navigator.sendBeacon 可用
    const beacon: BodyInit = JSON.stringify(data)
    navigator.sendBeacon(url, beacon)
  } else {
    // polyfill
  }
}


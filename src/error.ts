import { getBaseData } from "./lib/getBaseData";
import { addTask } from "./lib/sendBeacon";
import { JSError,ResourceError } from "./lib/types";

/**
   * 监控并发送 error 数据
   */  
export function error():void {
    
    window.addEventListener('error', (ev:ErrorEvent):void  => {
        const target:any = ev.target;
        // 判断是否为 resource error
        if (target && (target.src || target.href)) {
            const data: ResourceError = {
                ...getBaseData(),
                type: "error",
                errorType: "resouceError",
                filename: target.src || target.href,
                errorMessage: ev.message,
                tagName: target.tagName,
                time: ev.timeStamp,
                size: 0
            }
            console.log("sendResouceError", data)
            addTask(data);
        } else { //否则为jsError
            console.log(ev);
            const data: JSError = {
                ...getBaseData(),
                type: "error",
                errorType: "jsError",
                message: ev.message,
                stack: ev.error.stack,
            }
            console.log("sendJsError", data)
            addTask(data);
        }
    },true);
    // 还有promiseError
    window.addEventListener('unhandledrejection', (ev:PromiseRejectionEvent):void => {
        let reason = ev.reason;
        console.log(ev);
        const data: JSError = {
            ...getBaseData(),
            type: "error",
            errorType: "jsError",
            message: reason.message,
            stack: reason.stack,
        }
        console.log("sendJsError", data)
        addTask(data);
    })
}


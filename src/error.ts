export function error() {
    window.addEventListener('error', ev => {
        const target:any = ev.target;
        // resource error
        if(target && (target.src || target.href)) {
            let log = {
                type: 'error',
                errorType: 'resourceError',
                filename: target.src || target.href,
                errorMessage: ev.message,
                tagName: target.tagName,
                //size:,
                time: ev.timeStamp,
                stack: ev.error.stack,
            }
            console.log(log)
            return(log)
        }else{ //jsError
            console.log(ev);
            let log:object = {
                errorType: 'jsError',
                message: ev.message,
                stack: ev.error.stack,
            }
            console.log(log)
            return(log)

        }
    },true);
    // promiseError
    window.addEventListener('unhandledrejection', ev => {
        let reason = ev.reason;
        console.log(ev);
        let log = {
            errorType: 'jsError',
            message: reason.message,
            stack: reason.stack,
        }
        console.log(log)
        return(log)
    })
}

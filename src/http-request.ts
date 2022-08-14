import { getBaseData, getUrl } from "./lib/getBaseData";
import { addTask, } from "./lib/sendBeacon";
import { HttpRequest } from "./lib/types";

function sendHttpRequest(apiType:"xhr"|"fetch",res){
    const task: HttpRequest = {
        ...getBaseData(),
        type: "api",
        apiType: apiType,
        method: res.method,
        pathUrl: res.pathUrl,
        success: res.success,
        status: res.status,
        duration: res.duration,
        requestHeader: res.requestHeader,
        requestBody: res.requestBody,
        responseHeader: res.responseHeader,
        responseBody: res.responseBody
      }
    
      console.log("sendHttpRequest", task)
      addTask(task)
}

function rewriteXHR(cb:(para1,para2)=>void): any {
    //xhr hook
    let xhr: any = window.XMLHttpRequest
    if (xhr._myxhr_flag === true) {
        return void 0
    }
    xhr._myxhr_flag = true

    let _originOpen = xhr.prototype.open
    xhr.prototype.open = function (method: string, url: string | URL, async?: boolean, user?: string, password?: string) {
        this._myxhr_xhr_info = {
            type:"api",
            apiType: "xhr",
            pathUrl: url,
            method: method,
            status: null
        }

        return _originOpen.apply(this, arguments)
    }

    let _originSend = xhr.prototype.send
    xhr.prototype.send = function (value: any) {
        let _self = this
        this._myxhr_start_time = Date.now()

        let ajaxEnd = (event: any) => () => {
            if (_self.response) {
                let responseSize = null
                switch (_self.responseType) {
                    case 'json':
                        responseSize = JSON && JSON.stringify(_self.response).length
                        break
                    case 'blob':
                    case 'moz-blob':
                        responseSize = _self.response.size
                        break
                    case 'arraybuffer':
                        responseSize = _self.response.byteLength
                        break
                    case 'document':
                        responseSize =
                            _self.response.documentElement &&
                            _self.response.documentElement.innerHTML &&
                            _self.response.documentElement.innerHTML.length + 28
                        break
                    default:
                        responseSize = _self.response.length
                }
                _self._myxhr_xhr_info.event = event
                _self._myxhr_xhr_info.status = _self.status
                _self._myxhr_xhr_info.success =
                    (_self.status >= 200 && _self.status <= 206) || _self.status === 304
                _self._myxhr_xhr_info.duration = Date.now() - _self._myxhr_start_time
                _self._myxhr_xhr_info.responseSize = responseSize
                _self._myxhr_xhr_info.requestSize = value ? value.length : 0
                _self._myxhr_xhr_info.type = 'xhr'

                _self._myxhr_xhr_info.responseHeader = _self.getAllResponseHeaders()
                _self._myxhr_xhr_info.responseBody = self.Response
                //TODO: 请求头和请求体取不到
                _self._myxhr_xhr_info.requestHeader = ""
                _self._myxhr_xhr_info.requestBody = ""

                cb("xhr",this._myxhr_xhr_info)
                //console.log(this._myxhr_xhr_info)
            }
        }

        this.addEventListener('load', ajaxEnd('load'), false)
        this.addEventListener('error', ajaxEnd('error'), false)
        this.addEventListener('abort', ajaxEnd('abort'), false)

        return _originSend.apply(this, arguments)
    }
}

function rewriteFetch(cb:(para1,para2)=>void) {
    // fetch hook
    if (window.fetch) {
        let _origin_fetch = window.fetch
        window.fetch = function () {
            let startTime = Date.now()
            let args = [].slice.call(arguments)

            let fetchInput = args[0]
            let method = 'GET'
            let url

            if (typeof fetchInput === 'string') {
                url = fetchInput
            } else if ('Request' in window && fetchInput instanceof window.Request) {
                url = fetchInput.url
                if (fetchInput.method) {
                    method = fetchInput.method
                }
            } else {
                url = '' + fetchInput
            }

            if (args[1] && args[1].method) {
                method = args[1].method
            }

            let fetchData: any = {
                type:"api",
                apiType: "fetch",
                method: method,
                pathUrl: url,
                status: null
            }

            return _origin_fetch.apply(this, args).then(function (response: any) {
                fetchData.status = response.status
                fetchData.duration = Date.now() - startTime
                fetchData.success = response.ok
                fetchData.responseHeader = response.headers 
                //TODO: fetchData.responseBody = response.body  // response.body是一个流

                //TODO: 请求头和请求体取不到

                cb("fetch",fetchData)
                //console.log(fetchData)
                return response
            })
        }
    }
}

export function httpMonitor() {
    rewriteXHR(sendHttpRequest)
    rewriteFetch(sendHttpRequest)
}


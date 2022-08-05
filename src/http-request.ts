function rewriteXHR(): any {
    // xhr hook
    let xhr: any = window.XMLHttpRequest
    if (xhr._myxhr_flag === true) {
        return void 0
    }
    xhr._myxhr_flag = true

    let _originOpen = xhr.prototype.open
    xhr.prototype.open = function (method: string, url: string, async: boolean, user: string, password: string) {
        // TODO myxhr url check
        console.log("OPEN!!")
        this._myxhr_xhr_info = {
            url: url,
            method: method,
            status: null
        }

        /*** cb(this._myxhr_xhr_info) ***/
        console.log(this._myxhr_xhr_info)

        return _originOpen.apply(this, arguments)
    }

    let _originSend = xhr.prototype.send
    xhr.prototype.send = function (value: any) {
        console.log("SEND!!")
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
                
                /*** cb(this._myxhr_xhr_info) ***/
                console.log(this._myxhr_xhr_info)
            }
        }

        // TODO myxhr url check
        this.addEventListener('load', ajaxEnd('load'), false)
        this.addEventListener('error', ajaxEnd('error'), false)
        this.addEventListener('abort', ajaxEnd('abort'), false)

        return _originSend.apply(this, arguments)
    }
}

function rewriteFetch() {
    // fetch hook
    if (window.fetch) {
        let _origin_fetch = window.fetch
        window.fetch = function () {
            console.log("FETCH!!")
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

            // TODO eagle check
            let fetchData: any = {
                method: method,
                url: url,
                status: null
            }

            return _origin_fetch.apply(this, args).then(function (response: any) {
                fetchData.status = response.status
                fetchData.type = 'fetch'
                fetchData.duration = Date.now() - startTime
                //cb(fetchData)
                console.log(fetchData)
                return response
            })
        }
    }
}

export function httpMonitor() {
    rewriteXHR()
    rewriteFetch()
}


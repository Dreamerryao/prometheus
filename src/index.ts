/**
 * 在此处引入初始化方法
 * 运行 & 打开测试页面，在终端中输入：
 * npm i
 * npm run dev 
 */
import {initPv} from './pv'
import {uuid} from './lib/uuid'

interface PrometheusOption {

}
export default class Prometheus {
  constructor(options?:PrometheusOption){
    this.init(options)
  }

  init(options:PrometheusOption){
    this.initUuid()
    initPv()
  }

  initUuid ():void {
    if(localStorage.getItem("prometheus_uuid")) return;
    const uid = uuid()
    localStorage.setItem("prometheus_uuid", uid)
  }
} 

new Prometheus()
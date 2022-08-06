/**
 * 在此处引入初始化方法
 * 运行 & 打开测试页面，在终端中输入：
 * npm i
 * npm run dev 
 */
import {initPv} from './pv'
import {uuid} from './lib/uuid'


// IIFE
(function init(){
  initUuid()
  initPv()


  function initUuid ():void {
    if(localStorage.getItem("prometheus_uuid")) return;
    const uid = uuid()
    localStorage.setItem("prometheus_uuid", uid)
  }
})()
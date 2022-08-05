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
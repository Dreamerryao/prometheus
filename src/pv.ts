
function calcPv():void {

}

// function handleVisibilityChange
export function init():void{
  const referer:string = document.referrer 
  const isHidden:boolean = document.hidden
  let session = null
  let timer:null | NodeJS.Timeout = null

  // 新的会话中页面可见，设置一个 3s 的定时器
  // 如果定时器到期页面仍然可见，没有关闭页面，也没有隐藏
  // 则算作一次有效 pv
  if(!isHidden){  
    calcPv()
  }
  document.addEventListener("visibilitychange", (e:Event):void => {
    console.log('[visibilitychange]', e)
    console.log(document.hidden)
  } )
  window.addEventListener("beforeunload", (e:BeforeUnloadEvent):void => {
    if(timer) clearTimeout(timer)
  })
}


/**
 * 获取基本数据 title / url / timestamp / referer / userAgent
 * ...getBaseData() 解构加入新对象中即可
 * @returns 包含监控数据基本数据的对象 
 */
export function getBaseData(){
  const {
    referrer, 
    title,
  } = document

  const userAgent = navigator.userAgent
  const url = document.location.origin
  const timestamp:DOMHighResTimeStamp = Date.now()
  // const navigationType = performance.getEntriesByType("navigation")[0].type
  // 旧的 api 已经弃用
  // 新的用不了
  return {
    title,
    url,
    timestamp,
    referrer,
    userAgent
  }
}
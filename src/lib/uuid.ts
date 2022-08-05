/**
 * 获取一个随机字符串
 * @returns 
 */
export function uuid():string{
  const date = new Date()
  // 日期的 16 进制表示，7位数字
  const hexDate = parseInt(`${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(date.getDate(), 2)}`, 10).toString(16)
  // 时间的 16 进制表示，最大 7 位
  const hexTime = parseInt(`${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(date.getSeconds(), 2)}${pad(date.getMilliseconds(), 3)}`, 10).toString(16)
  // 第 8 位数字表示后面的 time 字符串的长度
  let guid = hexDate + hexTime.length + hexTime
  
  // 补充随机数，补足 32 位的 16 进制数
  while(guid.length < 32) {
    guid += Math.floor(Math.random() * 16).toString(16);
  }
  return `${guid.slice(0,8)}-${guid.slice(8, 16)}-${guid.slice(16)}`
}


function pad(num:number, len:number, fillString = '0'):string {
  return String(num).padStart(len, fillString)
}
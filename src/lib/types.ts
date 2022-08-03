/**
 * types.ts 定义类型
 */


 interface TrackDataBase {
  title: string;       // 页面标题
  url: string;         // 页面 url
  timestamp: DOMHighResTimeStamp;   // 时间戳
  referrer: string;
  navigationType: string;
  userAgent: string;
}


/*----------------------------------------------*/
/**
 * ErrorImpl 各种错误的基类接口
 */
export interface ErrorImpl extends TrackDataBase {
  type: "error";
}
/**
 * JSError JS内部错误（包括 Promise 错误）
 */
interface JSError extends ErrorImpl {
  errorType: "jsError";     // 错误类型
  message: string;           // 错误详情
  stack: string;             // 堆栈信息
}

/**
 * ResouceError 资源加载错误
 */
interface ResourceError extends ErrorImpl {
  errorType: "resouceError";
  filename: string;
  errorMessage: string;
  tagName: string;
  size: number;
  time: DOMHighResTimeStamp;
}

/**
 * BlankError 白屏错误
 */
interface BlankError extends ErrorImpl {
  errorType: "blankError";
  emptyPoints: string;      // 空白点
  screen: string;            // 屏幕分辨率
  viewPoint: string;         // 视口大小
}
/*--------------------------------------------------- */


/*--------------------------------------------------- */

/**
 * HttpRequest 有关网络请求的数据
 */
export interface HttpRequest extends TrackDataBase {
  type: "api";
  apiType: "xhr" | "fetch";       // 请求类型
  method: "get" | "post" | ""; // todo
  pathUrl: number;                // 路径
  success: boolean;               // 是否成功
  status: number;                 // 状态码
  duration: DOMHighResTimeStamp;  // 持续时间
  requestHeader:string;           // 请求头
  requestBody: string;            // 请求体
  responseHeader: string;         // 响应头
  responseBody: string;           // 响应体
  errMessage?: string;            // 错误信息（可选）
}
/*--------------------------------------------------- */

/*--------------------------------------------------- */

export interface PerformanceImpl extends TrackDataBase {
  type: "performance";
}

interface Timing extends PerformanceImpl {
  perfType: "timing";
  dnsTime: DOMHighResTimeStamp;
}

interface Paint extends PerformanceImpl {
  prefType: "paint";
  firstPaint: DOMHighResTimeStamp;                  // FP
  firstContentPaint: DOMHighResTimeStamp;           // FCP
  firstMeaningfulPaint: DOMHighResTimeStamp;        // FMP
  largestContentfulPaint: DOMHighResTimeStamp;      // LCP
  firstInputDelay:DOMHighResTimeStamp;              // TTI 
}

/*--------------------------------------------------- */

/*--------------------------------------------------- */

export interface BehaviorImpl extends TrackDataBase {
  type:"behavior";
  pageURL:string;
  uuid: string;           // todo
}

interface Pv extends BehaviorImpl {
  behaviorType:"pv";
}

interface StayTime extends BehaviorImpl {
  behaviorType: "staytime";
  stayTime: DOMHighResTimeStamp;
}
/*--------------------------------------------------- */



export type TrackData = (
  JSError | ResourceError | BlankError |
  HttpRequest | Timing | Paint |
  Pv | StayTime 
  );



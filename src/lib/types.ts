/**
 * types.ts 定义类型
 */


 interface TrackDataBase {
  title: string;                    // 页面标题
  url: string;                      // 页面 url
  timestamp: string;   // 时间戳
  referrer: string;                 // 来源 url
  // navigationType: string;           // 跳转类型
  userAgent: string;                // 用户代理
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
export interface JSError extends ErrorImpl {
  errorType: "jsError";      // 错误类型
  message: string;           // 错误详情
  stack: string;             // 堆栈信息
}

/**
 * ResouceError 资源加载错误
 */
export interface ResourceError extends ErrorImpl {
  errorType: "resourceError";
  filename: string;
  errorMessage: string;
  tagName: string;
  size: string;
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
  pathUrl: string;                // 路径
  success: boolean;               // 是否成功
  status: string;                 // 状态码
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

export interface Timing extends PerformanceImpl {
  perfType: "timing";
  dnsTime: DOMHighResTimeStamp;
  connectTime:DOMHighResTimeStamp;
  ttfbTime:DOMHighResTimeStamp;
  responseTime:DOMHighResTimeStamp;
  parseDOMTime:DOMHighResTimeStamp;
  domContentLoadedTime:DOMHighResTimeStamp;
  timeToInteractive:DOMHighResTimeStamp;
  loadTime:DOMHighResTimeStamp;
}

export interface Paint extends PerformanceImpl {
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
  uuid: string;          
}

export interface Pv extends BehaviorImpl {
  behaviorType:"pv";
}

export interface StayTime extends BehaviorImpl {
  behaviorType: "staytime";
  stayTime: DOMHighResTimeStamp;
}
/*--------------------------------------------------- */


/**
 * 监控数据类型
 */
export type TrackData = (
  JSError | ResourceError | BlankError |
  HttpRequest | Timing | Paint |
  Pv | StayTime 
  );


/**
 * RequestIdleCallback(callback[, options]) 
 * 中 callback 被传入的参数类型
 */
export type Deadline = {
  timeRemaining: () => number // 当前剩余的可用时间
  didTimeout: boolean // 是否超时
}

/**
 * detectUserAgent 使用到的类型
 */
export type Browser =
  | 'welike'
  | 'vidmate'
  | 'aol'
  | 'edge'
  | 'yandexbrowser'
  | 'vivaldi'
  | 'kakaotalk'
  | 'samsung'
  | 'chrome'
  | 'phantomjs'
  | 'crios'
  | 'firefox'
  | 'fxios'
  | 'opera'
  | 'ie'
  | 'bb10'
  | 'android'
  | 'ios'
  | 'safari'
  | 'facebook'
  | 'instagram'
  | 'ios-webview'
  | 'searchbot'

export type OperatingSystem =
  | 'iOS'
  | 'Android OS'
  | 'BlackBerry OS'
  | 'Windows Mobile'
  | 'Amazon OS'
  | 'Windows 3.11'
  | 'Windows 95'
  | 'Windows 98'
  | 'Windows 2000'
  | 'Windows XP'
  | 'Windows Server 2003'
  | 'Windows Vista'
  | 'Windows 7'
  | 'Windows 8'
  | 'Windows 8.1'
  | 'Windows 10'
  | 'Windows ME'
  | 'Open BSD'
  | 'Sun OS'
  | 'Linux'
  | 'Mac OS'
  | 'QNX'
  | 'BeOS'
  | 'OS/2'
  | 'Search Bot';

export type UserAgentRule = [Browser, RegExp]
export type UserAgentMatch = [Browser, RegExpExecArray] | false;
export type OperatingSystemRule = [OperatingSystem, RegExp];

export interface DetectedInfo<N extends string, O, V = null> {
  readonly name: N
  readonly version: V
  readonly os: O
}
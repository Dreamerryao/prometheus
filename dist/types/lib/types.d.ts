/**
 * types.ts 定义类型
 */
interface TrackDataBase {
    title: string;
    url: string;
    timestamp: string;
    referrer: string;
    userAgent: string;
}
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
    errorType: "jsError";
    message: string;
    stack: string;
}
/**
 * ResouceError 资源加载错误
 */
export interface ResourceError extends ErrorImpl {
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
    emptyPoints: string;
    screen: string;
    viewPoint: string;
}
/**
 * HttpRequest 有关网络请求的数据
 */
export interface HttpRequest extends TrackDataBase {
    type: "api";
    apiType: "xhr" | "fetch";
    method: "get" | "post" | "";
    pathUrl: string;
    success: boolean;
    status: string;
    duration: DOMHighResTimeStamp;
    requestHeader: string;
    requestBody: string;
    responseHeader: string;
    responseBody: string;
    errMessage?: string;
}
export interface PerformanceImpl extends TrackDataBase {
    type: "performance";
}
export interface Timing extends PerformanceImpl {
    perfType: "timing";
    dnsTime: DOMHighResTimeStamp;
    connectTime: DOMHighResTimeStamp;
    ttfbTime: DOMHighResTimeStamp;
    responseTime: DOMHighResTimeStamp;
    parseDOMTime: DOMHighResTimeStamp;
    domContentLoadedTime: DOMHighResTimeStamp;
    timeToInteractive: DOMHighResTimeStamp;
    loadTime: DOMHighResTimeStamp;
}
export interface Paint extends PerformanceImpl {
    prefType: "paint";
    firstPaint: DOMHighResTimeStamp;
    firstContentPaint: DOMHighResTimeStamp;
    firstMeaningfulPaint: DOMHighResTimeStamp;
    largestContentfulPaint: DOMHighResTimeStamp;
    firstInputDelay: DOMHighResTimeStamp;
}
export interface BehaviorImpl extends TrackDataBase {
    type: "behavior";
    pageURL: string;
    uuid: string;
}
export interface Pv extends BehaviorImpl {
    behaviorType: "pv";
}
export interface StayTime extends BehaviorImpl {
    behaviorType: "staytime";
    stayTime: DOMHighResTimeStamp;
}
/**
 * 监控数据类型
 */
export declare type TrackData = (JSError | ResourceError | BlankError | HttpRequest | Timing | Paint | Pv | StayTime);
/**
 * RequestIdleCallback(callback[, options])
 * 中 callback 被传入的参数类型
 */
export declare type Deadline = {
    timeRemaining: () => number;
    didTimeout: boolean;
};
/**
 * detectUserAgent 使用到的类型
 */
export declare type Browser = 'welike' | 'vidmate' | 'aol' | 'edge' | 'yandexbrowser' | 'vivaldi' | 'kakaotalk' | 'samsung' | 'chrome' | 'phantomjs' | 'crios' | 'firefox' | 'fxios' | 'opera' | 'ie' | 'bb10' | 'android' | 'ios' | 'safari' | 'facebook' | 'instagram' | 'ios-webview' | 'searchbot';
export declare type OperatingSystem = 'iOS' | 'Android OS' | 'BlackBerry OS' | 'Windows Mobile' | 'Amazon OS' | 'Windows 3.11' | 'Windows 95' | 'Windows 98' | 'Windows 2000' | 'Windows XP' | 'Windows Server 2003' | 'Windows Vista' | 'Windows 7' | 'Windows 8' | 'Windows 8.1' | 'Windows 10' | 'Windows ME' | 'Open BSD' | 'Sun OS' | 'Linux' | 'Mac OS' | 'QNX' | 'BeOS' | 'OS/2' | 'Search Bot';
export declare type UserAgentRule = [Browser, RegExp];
export declare type UserAgentMatch = [Browser, RegExpExecArray] | false;
export declare type OperatingSystemRule = [OperatingSystem, RegExp];
export interface DetectedInfo<N extends string, O, V = null> {
    readonly name: N;
    readonly version: V;
    readonly os: O;
}
export {};

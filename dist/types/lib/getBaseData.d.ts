/**
 * 获取基本数据 title / url / timestamp / referer / userAgent
 * ...getBaseData() 解构加入新对象中即可
 * @returns 包含监控数据基本数据的对象
 */
export declare function getBaseData(): {
    title: string;
    url: string;
    timestamp: number;
    referrer: string;
    userAgent: string;
};
export declare function getUrl(): string;

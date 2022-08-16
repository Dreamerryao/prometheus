/// <reference types="node" />
import { DetectedInfo, Browser, OperatingSystem } from './types';
/**
 * 浏览器信息
 */
declare class BrowserInfo implements DetectedInfo<Browser, OperatingSystem | null, string> {
    readonly name: Browser;
    readonly version: string;
    readonly os: OperatingSystem | null;
    constructor(name: Browser, version: string, os: OperatingSystem | null);
    toString(): string;
}
/**
 * Node.js 信息
 */
declare class NodeInfo implements DetectedInfo<'node', NodeJS.Platform, string> {
    readonly version: string;
    readonly name: 'node';
    readonly os: NodeJS.Platform;
    constructor(version: string);
    toString(): string;
}
/**
 * SEO 爬虫机器人
 */
declare class BotInfo implements DetectedInfo<'bot', null, null> {
    readonly bot: true;
    readonly name: 'bot';
    readonly version: null;
    readonly os: null;
    toString(): string;
}
export declare function detectUserAgent(): BrowserInfo | BotInfo | NodeInfo | null;
export {};

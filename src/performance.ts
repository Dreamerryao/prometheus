import { getBaseData } from "./lib/getBaseData";
import { addTask } from "./lib/sendBeacon";
import { Timing, Paint } from "./lib/types";


export function sendTimingPerformance() {
    const { origin, pathname } = document.location
    const uuid = sessionStorage.getItem("prometheus_uuid")

    let pf: PerformanceNavigationTiming = <PerformanceNavigationTiming>performance.getEntriesByType('navigation')[0]
    let task: Timing = {
        ...getBaseData(),
        type: "performance",
        perfType: "timing",
        dnsTime: pf.domainLookupEnd - pf.domainLookupStart,
        connectTime: pf.connectEnd - pf.connectStart,
        ttfbTime: pf.responseStart - pf.domainLookupStart,
        responseTime: pf.responseEnd - pf.responseStart,
        parseDOMTime: pf.domComplete - pf.domInteractive,
        domContentLoadedTime: pf.domContentLoadedEventEnd - pf.domContentLoadedEventStart,
        timeToInteractive: pf.domInteractive - pf.fetchStart,
        loadTime: pf.loadEventEnd - pf.loadEventStart
    }

    console.log("sendTimingPerformance", task)
    addTask(task)
}

export function sendPaintPerformance() {
    const { origin, pathname } = document.location
    const uuid = sessionStorage.getItem("prometheus_uuid")

    let pfNavi: PerformanceNavigationTiming = <PerformanceNavigationTiming>performance.getEntriesByType('navigation')[0]
    let pfPaintEntries: PerformanceEntryList = performance.getEntriesByType('paint')
    let fp: PerformanceEntry = pfPaintEntries.find(each => each.name === 'first-paint')
    let fcp: PerformanceEntry = pfPaintEntries.find(each => each.name === 'first-contentful-paint')

    let task: Paint = {
        ...getBaseData(),
        type: "performance",
        prefType: "paint",
        firstPaint: fp.startTime - pfNavi.startTime,
        firstContentPaint: fcp.startTime - pfNavi.startTime,
        
        //TODO: 三个指标的计算方法
        firstMeaningfulPaint:0,
        largestContentfulPaint:0,
        firstInputDelay:0
    }

    console.log("sendPaintPerformance", task)
    addTask(task)
}
export function calcFP(): void {  // First Paint
    let pfEntries: PerformanceEntryList = performance.getEntriesByType('paint')
    let fp: PerformanceEntry = pfEntries.find(each => each.name === 'first-paint')
    console.log('first paint time: ', fp && fp.startTime)
}

export function calcFCP(): void {  // First Contentful Paint
    let pfEntries: PerformanceEntryList = performance.getEntriesByType('paint')
    let fcp: PerformanceEntry = pfEntries.find(each => each.name === 'first-contentful-paint')
    console.log('first contentful paint time: ', fcp && fcp.startTime)
}

export function calcDOM():void{
    let pf:PerformanceNavigationTiming = <PerformanceNavigationTiming>performance.getEntriesByType('navigation')[0]
    console.log('DNS lookup time: ',pf.domContentLoadedEventEnd)
}

export function calcDNS():void{  // DNS lookup
    let pf:PerformanceNavigationTiming = <PerformanceNavigationTiming>performance.getEntriesByType('navigation')[0]
    console.log('DNS lookup time: ',pf.domainLookupEnd - pf.domainLookupStart)
}


//TODO:
export function connectTime():void{}
export function ttfbTime():void{}
export function responseTime():void{}
export function parseDOMTime():void{}
export function timeToInteractive():void{}
export function loadTime():void{}

export function firstMeaningfulPaint():void{}
export function largestContentfulPaint():void{}
export function firstInputDelay():void{}
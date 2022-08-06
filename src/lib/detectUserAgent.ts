type Browser =
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

type OperatingSystem =
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

type UserAgentRule = [Browser, RegExp]
type UserAgentMatch = [Browser, RegExpExecArray] | false;
type OperatingSystemRule = [OperatingSystem, RegExp];

interface DetectedInfo<N extends string, O, V = null> {
  readonly name: N
  readonly version: V
  readonly os: O
}

class BrowserInfo implements DetectedInfo<Browser, OperatingSystem | null, string>{
  constructor(
    public readonly name:Browser,
    public readonly version: string,
    public readonly os: OperatingSystem | null
  ){}
  toString():string{
    return `${this.name} ${this.version} ${this.os}` 
  }
} 

class NodeInfo implements DetectedInfo<'node', NodeJS.Platform, string> {
  public readonly name: 'node' = 'node'
  public readonly os: NodeJS.Platform = process.platform
  
  constructor(public readonly version: string){}
  toString():string{
    return `${this.name} ${this.os}` 
  }
}

class BotInfo implements DetectedInfo<'bot', null, null> {
  public readonly bot:true = true
  public readonly name: 'bot' = 'bot'
  public readonly version: null = null
  public readonly os:null = null

  toString():string{
    return `${this.name}` 
  }
}



const SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/
const SEARCHBOT_OS_REGEX = /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/

const userAgentRules: UserAgentRule[] = [
  ['aol', /AOLShield\/([0-9\._]+)/],
  ['edge', /Edge?\/([0-9\._]+)/],
  ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
  ['vivaldi', /Vivaldi\/([0-9\.]+)/],
  ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
  ['samsung', /SamsungBrowser\/([0-9\.]+)/],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
  ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
  ['fxios', /FxiOS\/([0-9\.]+)/],
  ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9\.]+)(:?\s|$)$/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
  ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ['ie', /MSIE\s(7\.0)/],
  ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
  ['android', /Android\s([0-9\.]+)/],
  ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  ['safari', /Version\/([0-9\._]+).*Safari/],
  ['facebook', /FBAV\/([0-9\.]+)/],
  ['instagram', /Instagram\s([0-9\.]+)/],
  ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
  ['searchbot', SEARCHBOX_UA_REGEX],
];

const operatingSystemRules: OperatingSystemRule[] = [
  ['iOS', /iP(hone|od|ad)/],
  ['Android OS', /Android/],
  ['BlackBerry OS', /BlackBerry|BB10/],
  ['Windows Mobile', /IEMobile/],
  ['Amazon OS', /Kindle/],
  ['Windows 3.11', /Win16/],
  ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
  ['Windows 98', /(Windows 98)|(Win98)/],
  ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
  ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
  ['Windows Server 2003', /(Windows NT 5.2)/],
  ['Windows Vista', /(Windows NT 6.0)/],
  ['Windows 7', /(Windows NT 6.1)/],
  ['Windows 8', /(Windows NT 6.2)/],
  ['Windows 8.1', /(Windows NT 6.3)/],
  ['Windows 10', /(Windows NT 10.0)/],
  ['Windows ME', /Windows ME/],
  ['Open BSD', /OpenBSD/],
  ['Sun OS', /SunOS/],
  ['Linux', /(Linux)|(X11)/],
  ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
  ['QNX', /QNX/],
  ['BeOS', /BeOS/],
  ['OS/2', /OS\/2/],
  ['Search Bot', SEARCHBOT_OS_REGEX],
];
const REQUIRED_VERSION_PARTS = 3;

export function detectUserAgent() :BrowserInfo | BotInfo | NodeInfo | null {
  if(typeof navigator === 'undefined') return getNodeVersion()
  return parseUserAgent(navigator.userAgent)
}

function parseUserAgent(ua: string):BrowserInfo | BotInfo | null {
  const matchedRule: UserAgentMatch = 
    ua !== '' &&
    userAgentRules.reduce<UserAgentMatch>((matched: UserAgentMatch, [browser, regex]) => {
      if(matched) return matched
      const uaMatch = regex.exec(ua)
      return !!uaMatch && [browser, uaMatch]
    }, false)

    if(!matchedRule) return null

    const [name, match] = matchedRule
    if(name === 'searchbot') return new BotInfo()

    let version = match[1] && match[1].split(/[._]/).slice(0, 3)
    if(version) {
      if(version.length < REQUIRED_VERSION_PARTS) {
        version = [
          ...version,
          ...new Array(REQUIRED_VERSION_PARTS - version.length).fill("0")
        ]
      }
    } else {
      version = []
    }

    return new BrowserInfo(name, version.join('.'), detectOS(ua))
}

function detectOS(ua:string):OperatingSystem | null {
  const match = operatingSystemRules.find(([_, regex]) => regex.test(ua))
  return match ? match[0] : null;
}

function getNodeVersion():NodeInfo | null {
  const isNode = typeof process !== 'undefined' && process.version
  return isNode? new NodeInfo(process.version.slice(1)) : null
}
/*
type desktopSys = 'windows' | 'macos' | 'linux'
type mobileSys = 'andriod' | 'ios'
type SystemType = typeof desktopSys |  typeof mobileSys
const systemMap:Map<RegExp, SystemType> = new Map([
  [/windows|win32|win64|wow32|wow64/g, "windows"],
  [/macintosh|macintel/g, "macos"],
  [/x11/g, "linux"],
  [/android|adr/g, "android"],
  [/ios|iphone|ipad|ipod|iwatch/g, "ios"]
])

// TODO:WIN11 探测
const winVerMap = new Map([
  [/windows nt 5.0|windows 2000/g, "2000"],
  [/windows nt 5.1|windows xp/g, "xp"],
  [/windows nt 5.2|windows 2003/g, "2003"],
  [/windows nt 6.0|windows vista/g, "vista"],
  [/windows nt 6.1|windows 7/g, "7"],
  [/windows nt 6.2|windows 8/g, "8"],
  [/windows nt 6.3|windows 8.1/g, "8.1"],
  [/windows nt 10.0|windows 10/g, "10"]
])

function getUserAgent(): string {
  const ua = navigator.userAgent.toLowerCase()
  const testUa: RegExpTester = regexp => {
    regexp.test(ua)
  }
  const getVer: RegExpMatcher = regexp => ua.match(regexp).toString().replace(/[^0-9|_.]/g, "").replace(/_/g, ".")

  // 系统
  let system: string = "unknow"


  // 系统版本
  let systemVer: string = "unknow"
  if (system === "windows") {
    
  } else if (system === "macos") {
    systemVer = getVer(/os x [\d._]+/g)
  } else if (system === "android") {
    systemVer = getVer(/android [\d._]+/g)
  } else if (system === "ios") {
    systemVer = getVer(/os [\d._]+/g)
  }

  // 平台
  let platform: string = "unknow"
  if (system === "windows" || system === "macos" || system === "linux") {
    platform = "desktop"     // 桌面端
  } else if (system === "android" || system === "ios" || testUa(/mobile/g)) {
    platform = "mobile"      // 移动端
  }

  // 内核 + 载体
  let engine: string = "unknow"
  let supporter = "unknow"
  if (testUa(/applewebkit/g)) {
    engine = "webkit"          // webkit内核
    if (testUa(/edge/g) || testUa(/edg/g)) {
      supporter = "edge"       // edge浏览器
    } else if (testUa(/opr/g)) {
      supporter = "opera"      // opera浏览器
    } else if (testUa(/chrome/g)) {
      supporter = "chrome"     // chrome浏览器
    } else if (testUa(/safari/g)) {
      supporter = "safari"     // safari浏览器
    }
  } else if (testUa(/gecko/g) && testUa(/firefox/g)) {
    engine = "gecko"           // gecko内核
    supporter = "firefox"      // firefox浏览器
  } else if (testUa(/presto/g)) {
    engine = "presto"          // presto内核
    supporter = "opera"        // opera浏览器
  } else if (testUa(/trident|compatible|msie/g)) {
    engine = "trident"         // trident内核
    supporter = "iexplore"     // iexplore浏览器
  }

  // 内核版本
  let engineVer: string = "unknow"
  if (engine === "webkit") {
    engineVer = getVer(/applewebkit\/[\d._]+/g)
  } else if (engine === "gecko") {
    engineVer = getVer(/gecko\/[\d._]+/g)
  } else if (engine === "presto") {
    engineVer = getVer(/presto\/[\d._]+/g)
  } else if (engine === "trident") {
    engineVer = getVer(/trident\/[\d._]+/g)
  }

  // 载体版本
  let supporterVer: string = "unknow"
  if (supporter === "chrome") {
    supporterVer = getVer(/chrome\/[\d._]+/g)
  } else if (supporter === "safari") {
    supporterVer = getVer(/version\/[\d._]+/g)
  } else if (supporter === "firefox") {
    supporterVer = getVer(/firefox\/[\d._]+/g)
  } else if (supporter === "opera") {
    supporterVer = getVer(/opr\/[\d._]+/g)
  } else if (supporter === "iexplore") {
    supporterVer = getVer(/(msie [\d._]+)|(rv:[\d._]+)/g)
  } else if (supporter === "edge") {
    supporterVer = getVer(/edge\/[\d._]+/g)
  }

  // 外壳 + 外壳版本
  let shell: string = "none"
  let shellVer: string = "unknow"
  if (testUa(/micromessenger/g)) {
    shell = "wechat"       // 微信浏览器
    shellVer = getVer(/micromessenger\/[\d._]+/g)
  } else if (testUa(/qqbrowser/g)) {
    shell = "qq"           // QQ浏览器
    shellVer = getVer(/qqbrowser\/[\d._]+/g)
  } else if (testUa(/ucbrowser/g)) {
    shell = "uc"           // UC浏览器
    shellVer = getVer(/ucbrowser\/[\d._]+/g)
  } else if (testUa(/qihu 360se/g)) {
    shell = "360"          // 360浏览器(无版本)
  } else if (testUa(/2345explorer/g)) {
    shell = "2345"         // 2345浏览器
    shellVer = getVer(/2345explorer\/[\d._]+/g)
  } else if (testUa(/metasr/g)) {
    shell = "sougou"       // 搜狗浏览器(无版本)
  } else if (testUa(/lbbrowser/g)) {
    shell = "liebao"       // 猎豹浏览器(无版本)
  } else if (testUa(/maxthon/g)) {
    shell = "maxthon"      // 遨游浏览器
    shellVer = getVer(/maxthon\/[\d._]+/g)
  }

  return (`${engine} ${engineVer} ${platform} ${supporter} ${supporterVer} ${system} ${systemVer} ${(shell === "none") ? '' : shell + shellVer}`)
}
*/

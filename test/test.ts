interface Routes {
  [propName: string]:any
}
interface routeCallback {
  ():any
}
export class HistoryRouter {
  private routes: Routes
  private currentUrl: string
  constructor() {
    this.routes = {}
    this.currentUrl = ''
    this.init()
  }

  route(path:string, callback:routeCallback):void {
    this.routes[path] = callback || function() {}
  }

  updateView(url:string):void {
    this.currentUrl = url;
    this.routes[this.currentUrl] && this.routes[this.currentUrl]()
  }
  bindLink(){
    const allLink = Array.from(document.querySelectorAll('a[data-href]'))
    allLink.forEach((l) => {
      l.addEventListener('click', e => {
        e.preventDefault()
        const url = l.getAttribute('data-href')
        const mode = l.getAttribute('data-mode')
        if(mode === 'push') history.pushState({}, null, url)
        else history.replaceState({}, null, url)

        this.updateView(url)
      }, false)
    })
    
  }

  init() {
    this.bindLink()
    window.addEventListener('popstate', e => {
      console.log(window.location.pathname)
      this.updateView(window.location.pathname.slice(1))
    })
    window.addEventListener('load',() => this.updateView(''), false)
  }
}

class HashRouter {
  private routes:Routes
  private currentUrl:string
  constructor() {
    this.routes = {}
    this.currentUrl = ''
  }

  route(path:string, callback:routeCallback) {
    this.routes[path] = callback || function() {}
  }

  updateView() {
    this.currentUrl = location.hash.slice(1) || '/'
    this.routes[this.currentUrl] && this.routes[this.currentUrl]()
  }

  init() {
    window.addEventListener('load', this.updateView.bind(this), false)
    window.addEventListener('hashchange', this.updateView.bind(this), false)
  }
}

const routeContainer = document.getElementById('route-container')

let historyRouter:HistoryRouter = new HistoryRouter()


const home:routeCallback = function() {
  routeContainer.innerHTML = `<div>home!!!</div>`
}
const anotherTestPage:routeCallback = function() {
  routeContainer.innerHTML = `<div>anotherTestPage!!!!!!</div>`  
}
const gogogo:routeCallback = function() {
  routeContainer.innerHTML = `<div>gogogo!!!!!!</div>`  
}

historyRouter.route('anotherTestPage', anotherTestPage)
historyRouter.route('gogogo', gogogo)
historyRouter.route('', home)

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
    console.log(this.routes[this.currentUrl])
    this.routes[this.currentUrl] && this.routes[this.currentUrl]()
  }
  bindLink(){
    const allLink = Array.from(document.querySelectorAll('a[data-href]'))
    allLink.forEach((l) => {
      console.log(l)
      l.addEventListener('click', e => {
        e.preventDefault()
        const url = l.getAttribute('data-href')
        history.pushState({}, null, url)
        this.updateView(url)
      }, false)
    })
    
  }

  init() {
    this.bindLink()
    window.addEventListener('popstate', e => {
      this.updateView(window.location.pathname)
    })
    window.addEventListener('load',() => this.updateView('/'), false)
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
  console.log('?')
  routeContainer.innerHTML = `<div>anotherTestPage!!!!!!</div>`  
}
const gogogo:routeCallback = function() {
  console.log('?')
  routeContainer.innerHTML = `<div>gogogo!!!!!!</div>`  
}

historyRouter.route('anthoerTestPage', anotherTestPage)
historyRouter.route('gogogo', gogogo)
historyRouter.route('/', home)

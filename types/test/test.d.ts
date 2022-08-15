interface routeCallback {
    (): any;
}
export declare class HistoryRouter {
    private routes;
    private currentUrl;
    constructor();
    route(path: string, callback: routeCallback): void;
    updateView(url: string): void;
    bindLink(): void;
    init(): void;
}
export {};

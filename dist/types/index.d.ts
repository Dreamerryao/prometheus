interface PrometheusOption {
}
export default class Prometheus {
    constructor(options?: PrometheusOption);
    init(options?: PrometheusOption): void;
    initUuid(): void;
    initPv(): void;
    initError(): void;
    initHttp(): void;
}
export {};

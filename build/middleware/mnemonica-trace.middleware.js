var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { MnemonicaOtelProvider } from '../providers/mnemonica-otel.provider.js';
let MnemonicaTraceMiddleware = class MnemonicaTraceMiddleware {
    tracer;
    otel;
    constructor(tracer, otel) {
        this.tracer = tracer;
        this.otel = otel;
    }
    use(req, res, next) {
        const route = req.route?.path ?? req.url;
        const span = this.tracer.startSpan(`HTTP ${req.method} ${route}`);
        span.setAttribute('http.method', req.method);
        span.setAttribute('http.url', req.url);
        res.on('finish', () => {
            span.setAttribute('http.status_code', res.statusCode);
            span.end();
        });
        this.otel.runWithSpan(span, () => next());
    }
};
MnemonicaTraceMiddleware = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object, MnemonicaOtelProvider])
], MnemonicaTraceMiddleware);
export { MnemonicaTraceMiddleware };
//# sourceMappingURL=mnemonica-trace.middleware.js.map
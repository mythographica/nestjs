"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaTraceMiddleware = void 0;
const common_1 = require("@nestjs/common");
const mnemonica_otel_provider_js_1 = require("../providers/mnemonica-otel.provider.js");
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
exports.MnemonicaTraceMiddleware = MnemonicaTraceMiddleware;
exports.MnemonicaTraceMiddleware = MnemonicaTraceMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, mnemonica_otel_provider_js_1.MnemonicaOtelProvider])
], MnemonicaTraceMiddleware);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXRyYWNlLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9tbmVtb25pY2EtdHJhY2UubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFLQSwyQ0FBNEM7QUFHNUMsd0ZBQWdGO0FBR3pFLElBQU0sd0JBQXdCLEdBQTlCLE1BQU0sd0JBQXdCO0lBRWxCO0lBQ0E7SUFGbEIsWUFDa0IsTUFBYyxFQUNkLElBQTJCO1FBRDNCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUF1QjtJQUMxQyxDQUFDO0lBRUosR0FBRyxDQUFFLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDbkQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FDRCxDQUFBO0FBbkJZLDREQUF3QjttQ0FBeEIsd0JBQXdCO0lBRHBDLElBQUEsbUJBQVUsR0FBRTs2Q0FJWSxrREFBcUI7R0FIakMsd0JBQXdCLENBbUJwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTmVzdEpTIG1pZGRsZXdhcmUgdGhhdCBjcmVhdGVzIGFuIE9wZW5UZWxlbWV0cnkgc3BhbiBwZXIgSFRUUCByZXF1ZXN0XG4gKiBhbmQgc3RvcmVzIGl0IGluIEFzeW5jTG9jYWxTdG9yYWdlIHNvIG1uZW1vbmljYSBob29rcyBjYW4gbmVzdCB1bmRlciBpdC5cbiAqL1xuaW1wb3J0IHR5cGUgeyBOZXN0TWlkZGxld2FyZSB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgdHlwZSB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB0eXBlIHsgVHJhY2VyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvYXBpJztcbmltcG9ydCB7IE1uZW1vbmljYU90ZWxQcm92aWRlciB9IGZyb20gJy4uL3Byb3ZpZGVycy9tbmVtb25pY2Etb3RlbC5wcm92aWRlci5qcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNbmVtb25pY2FUcmFjZU1pZGRsZXdhcmUgaW1wbGVtZW50cyBOZXN0TWlkZGxld2FyZSB7XG5cdGNvbnN0cnVjdG9yIChcblx0XHRwcml2YXRlIHJlYWRvbmx5IHRyYWNlcjogVHJhY2VyLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgb3RlbDogTW5lbW9uaWNhT3RlbFByb3ZpZGVyLFxuXHQpIHt9XG5cblx0dXNlIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQge1xuXHRcdGNvbnN0IHJvdXRlID0gcmVxLnJvdXRlPy5wYXRoID8/IHJlcS51cmw7XG5cdFx0Y29uc3Qgc3BhbiA9IHRoaXMudHJhY2VyLnN0YXJ0U3BhbihgSFRUUCAke3JlcS5tZXRob2R9ICR7cm91dGV9YCk7XG5cdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2h0dHAubWV0aG9kJywgcmVxLm1ldGhvZCk7XG5cdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2h0dHAudXJsJywgcmVxLnVybCk7XG5cblx0XHRyZXMub24oJ2ZpbmlzaCcsICgpID0+IHtcblx0XHRcdHNwYW4uc2V0QXR0cmlidXRlKCdodHRwLnN0YXR1c19jb2RlJywgcmVzLnN0YXR1c0NvZGUpO1xuXHRcdFx0c3Bhbi5lbmQoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMub3RlbC5ydW5XaXRoU3BhbihzcGFuLCAoKSA9PiBuZXh0KCkpO1xuXHR9XG59XG4iXX0=
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
const api_1 = require("@opentelemetry/api");
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
        // runWithSpan covers the mnemonica-hook side (the provider's own ALS);
        // the OTEL global context is what DiveOtelProvider reads when it looks
        // for a parent span at wrap boundaries — without this second entry
        // dive spans never adopt the request span and stay root traces.
        const activeCtx = api_1.trace.setSpan(api_1.context.active(), span);
        this.otel.runWithSpan(span, () => {
            api_1.context.with(activeCtx, () => next());
        });
    }
};
exports.MnemonicaTraceMiddleware = MnemonicaTraceMiddleware;
exports.MnemonicaTraceMiddleware = MnemonicaTraceMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, mnemonica_otel_provider_js_1.MnemonicaOtelProvider])
], MnemonicaTraceMiddleware);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXRyYWNlLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9tbmVtb25pY2EtdHJhY2UubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFLQSwyQ0FBNEM7QUFHNUMsNENBQW1FO0FBQ25FLHdGQUFnRjtBQUd6RSxJQUFNLHdCQUF3QixHQUE5QixNQUFNLHdCQUF3QjtJQUVsQjtJQUNBO0lBRmxCLFlBQ2tCLE1BQWMsRUFDZCxJQUEyQjtRQUQzQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBdUI7SUFDMUMsQ0FBQztJQUVKLEdBQUcsQ0FBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQ25ELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDekMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV2QyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7UUFFSCx1RUFBdUU7UUFDdkUsdUVBQXVFO1FBQ3ZFLG1FQUFtRTtRQUNuRSxnRUFBZ0U7UUFDaEUsTUFBTSxTQUFTLEdBQUcsV0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUNoQyxhQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNELENBQUE7QUExQlksNERBQXdCO21DQUF4Qix3QkFBd0I7SUFEcEMsSUFBQSxtQkFBVSxHQUFFOzZDQUlZLGtEQUFxQjtHQUhqQyx3QkFBd0IsQ0EwQnBDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBOZXN0SlMgbWlkZGxld2FyZSB0aGF0IGNyZWF0ZXMgYW4gT3BlblRlbGVtZXRyeSBzcGFuIHBlciBIVFRQIHJlcXVlc3RcbiAqIGFuZCBzdG9yZXMgaXQgaW4gQXN5bmNMb2NhbFN0b3JhZ2Ugc28gbW5lbW9uaWNhIGhvb2tzIGNhbiBuZXN0IHVuZGVyIGl0LlxuICovXG5pbXBvcnQgdHlwZSB7IE5lc3RNaWRkbGV3YXJlIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB0eXBlIHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHR5cGUgeyBUcmFjZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHsgY29udGV4dCBhcyBvdGVsQ29udGV4dCwgdHJhY2UgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHsgTW5lbW9uaWNhT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXJzL21uZW1vbmljYS1vdGVsLnByb3ZpZGVyLmpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1uZW1vbmljYVRyYWNlTWlkZGxld2FyZSBpbXBsZW1lbnRzIE5lc3RNaWRkbGV3YXJlIHtcblx0Y29uc3RydWN0b3IgKFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgdHJhY2VyOiBUcmFjZXIsXG5cdFx0cHJpdmF0ZSByZWFkb25seSBvdGVsOiBNbmVtb25pY2FPdGVsUHJvdmlkZXIsXG5cdCkge31cblxuXHR1c2UgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKTogdm9pZCB7XG5cdFx0Y29uc3Qgcm91dGUgPSByZXEucm91dGU/LnBhdGggPz8gcmVxLnVybDtcblx0XHRjb25zdCBzcGFuID0gdGhpcy50cmFjZXIuc3RhcnRTcGFuKGBIVFRQICR7cmVxLm1ldGhvZH0gJHtyb3V0ZX1gKTtcblx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnaHR0cC5tZXRob2QnLCByZXEubWV0aG9kKTtcblx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnaHR0cC51cmwnLCByZXEudXJsKTtcblxuXHRcdHJlcy5vbignZmluaXNoJywgKCkgPT4ge1xuXHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2h0dHAuc3RhdHVzX2NvZGUnLCByZXMuc3RhdHVzQ29kZSk7XG5cdFx0XHRzcGFuLmVuZCgpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gcnVuV2l0aFNwYW4gY292ZXJzIHRoZSBtbmVtb25pY2EtaG9vayBzaWRlICh0aGUgcHJvdmlkZXIncyBvd24gQUxTKTtcblx0XHQvLyB0aGUgT1RFTCBnbG9iYWwgY29udGV4dCBpcyB3aGF0IERpdmVPdGVsUHJvdmlkZXIgcmVhZHMgd2hlbiBpdCBsb29rc1xuXHRcdC8vIGZvciBhIHBhcmVudCBzcGFuIGF0IHdyYXAgYm91bmRhcmllcyDigJQgd2l0aG91dCB0aGlzIHNlY29uZCBlbnRyeVxuXHRcdC8vIGRpdmUgc3BhbnMgbmV2ZXIgYWRvcHQgdGhlIHJlcXVlc3Qgc3BhbiBhbmQgc3RheSByb290IHRyYWNlcy5cblx0XHRjb25zdCBhY3RpdmVDdHggPSB0cmFjZS5zZXRTcGFuKG90ZWxDb250ZXh0LmFjdGl2ZSgpLCBzcGFuKTtcblx0XHR0aGlzLm90ZWwucnVuV2l0aFNwYW4oc3BhbiwgKCkgPT4ge1xuXHRcdFx0b3RlbENvbnRleHQud2l0aChhY3RpdmVDdHgsICgpID0+IG5leHQoKSk7XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==
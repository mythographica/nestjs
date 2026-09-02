var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Optional } from '@nestjs/common';
import { context as otelContext, trace } from '@opentelemetry/api';
import { MnemonicaOtelProvider } from '../providers/mnemonica-otel.provider.js';
import { AsyncFlowProvider } from '../providers/async-flow.provider.js';
let MnemonicaTraceMiddleware = class MnemonicaTraceMiddleware {
    tracer;
    otel;
    asyncFlow;
    constructor(tracer, otel, asyncFlow) {
        this.tracer = tracer;
        this.otel = otel;
        this.asyncFlow = asyncFlow;
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
        // The async-flow root frame (when the module option is on) is the
        // outermost scope: every async hop of this request — wrapped or not —
        // inherits it via ALS propagation.
        const activeCtx = trace.setSpan(otelContext.active(), span);
        const run = () => {
            this.otel.runWithSpan(span, () => {
                otelContext.with(activeCtx, () => next());
            });
        };
        if (this.asyncFlow) {
            this.asyncFlow.runInScope(run);
            return;
        }
        run();
    }
};
MnemonicaTraceMiddleware = __decorate([
    Injectable(),
    __param(2, Optional()),
    __metadata("design:paramtypes", [Object, MnemonicaOtelProvider,
        AsyncFlowProvider])
], MnemonicaTraceMiddleware);
export { MnemonicaTraceMiddleware };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXRyYWNlLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9tbmVtb25pY2EtdHJhY2UubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFLQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3RELE9BQU8sRUFBRSxPQUFPLElBQUksV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBR2pFLElBQU0sd0JBQXdCLEdBQTlCLE1BQU0sd0JBQXdCO0lBRWxCO0lBQ0E7SUFDWTtJQUg5QixZQUNrQixNQUFjLEVBQ2QsSUFBMkIsRUFDZixTQUE2QjtRQUZ6QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBdUI7UUFDZixjQUFTLEdBQVQsU0FBUyxDQUFvQjtJQUN4RCxDQUFDO0lBRUosR0FBRyxDQUFFLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDbkQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztRQUVILHVFQUF1RTtRQUN2RSx1RUFBdUU7UUFDdkUsbUVBQW1FO1FBQ25FLGdFQUFnRTtRQUNoRSxrRUFBa0U7UUFDbEUsc0VBQXNFO1FBQ3RFLG1DQUFtQztRQUNuQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxNQUFNLEdBQUcsR0FBRyxHQUFTLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtnQkFDaEMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUNGLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLE9BQU87UUFDUixDQUFDO1FBQ0QsR0FBRyxFQUFFLENBQUM7SUFDUCxDQUFDO0NBQ0QsQ0FBQTtBQXJDWSx3QkFBd0I7SUFEcEMsVUFBVSxFQUFFO0lBS1YsV0FBQSxRQUFRLEVBQUUsQ0FBQTs2Q0FEWSxxQkFBcUI7UUFDSCxpQkFBaUI7R0FKL0Msd0JBQXdCLENBcUNwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTmVzdEpTIG1pZGRsZXdhcmUgdGhhdCBjcmVhdGVzIGFuIE9wZW5UZWxlbWV0cnkgc3BhbiBwZXIgSFRUUCByZXF1ZXN0XG4gKiBhbmQgc3RvcmVzIGl0IGluIEFzeW5jTG9jYWxTdG9yYWdlIHNvIG1uZW1vbmljYSBob29rcyBjYW4gbmVzdCB1bmRlciBpdC5cbiAqL1xuaW1wb3J0IHR5cGUgeyBOZXN0TWlkZGxld2FyZSB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHR5cGUgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgdHlwZSB7IFRyYWNlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSc7XG5pbXBvcnQgeyBjb250ZXh0IGFzIG90ZWxDb250ZXh0LCB0cmFjZSB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSc7XG5pbXBvcnQgeyBNbmVtb25pY2FPdGVsUHJvdmlkZXIgfSBmcm9tICcuLi9wcm92aWRlcnMvbW5lbW9uaWNhLW90ZWwucHJvdmlkZXIuanMnO1xuaW1wb3J0IHsgQXN5bmNGbG93UHJvdmlkZXIgfSBmcm9tICcuLi9wcm92aWRlcnMvYXN5bmMtZmxvdy5wcm92aWRlci5qcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNbmVtb25pY2FUcmFjZU1pZGRsZXdhcmUgaW1wbGVtZW50cyBOZXN0TWlkZGxld2FyZSB7XG5cdGNvbnN0cnVjdG9yIChcblx0XHRwcml2YXRlIHJlYWRvbmx5IHRyYWNlcjogVHJhY2VyLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgb3RlbDogTW5lbW9uaWNhT3RlbFByb3ZpZGVyLFxuXHRcdEBPcHRpb25hbCgpIHByaXZhdGUgcmVhZG9ubHkgYXN5bmNGbG93PzogQXN5bmNGbG93UHJvdmlkZXIsXG5cdCkge31cblxuXHR1c2UgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKTogdm9pZCB7XG5cdFx0Y29uc3Qgcm91dGUgPSByZXEucm91dGU/LnBhdGggPz8gcmVxLnVybDtcblx0XHRjb25zdCBzcGFuID0gdGhpcy50cmFjZXIuc3RhcnRTcGFuKGBIVFRQICR7cmVxLm1ldGhvZH0gJHtyb3V0ZX1gKTtcblx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnaHR0cC5tZXRob2QnLCByZXEubWV0aG9kKTtcblx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnaHR0cC51cmwnLCByZXEudXJsKTtcblxuXHRcdHJlcy5vbignZmluaXNoJywgKCkgPT4ge1xuXHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2h0dHAuc3RhdHVzX2NvZGUnLCByZXMuc3RhdHVzQ29kZSk7XG5cdFx0XHRzcGFuLmVuZCgpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gcnVuV2l0aFNwYW4gY292ZXJzIHRoZSBtbmVtb25pY2EtaG9vayBzaWRlICh0aGUgcHJvdmlkZXIncyBvd24gQUxTKTtcblx0XHQvLyB0aGUgT1RFTCBnbG9iYWwgY29udGV4dCBpcyB3aGF0IERpdmVPdGVsUHJvdmlkZXIgcmVhZHMgd2hlbiBpdCBsb29rc1xuXHRcdC8vIGZvciBhIHBhcmVudCBzcGFuIGF0IHdyYXAgYm91bmRhcmllcyDigJQgd2l0aG91dCB0aGlzIHNlY29uZCBlbnRyeVxuXHRcdC8vIGRpdmUgc3BhbnMgbmV2ZXIgYWRvcHQgdGhlIHJlcXVlc3Qgc3BhbiBhbmQgc3RheSByb290IHRyYWNlcy5cblx0XHQvLyBUaGUgYXN5bmMtZmxvdyByb290IGZyYW1lICh3aGVuIHRoZSBtb2R1bGUgb3B0aW9uIGlzIG9uKSBpcyB0aGVcblx0XHQvLyBvdXRlcm1vc3Qgc2NvcGU6IGV2ZXJ5IGFzeW5jIGhvcCBvZiB0aGlzIHJlcXVlc3Qg4oCUIHdyYXBwZWQgb3Igbm90IOKAlFxuXHRcdC8vIGluaGVyaXRzIGl0IHZpYSBBTFMgcHJvcGFnYXRpb24uXG5cdFx0Y29uc3QgYWN0aXZlQ3R4ID0gdHJhY2Uuc2V0U3BhbihvdGVsQ29udGV4dC5hY3RpdmUoKSwgc3Bhbik7XG5cdFx0Y29uc3QgcnVuID0gKCk6IHZvaWQgPT4ge1xuXHRcdFx0dGhpcy5vdGVsLnJ1bldpdGhTcGFuKHNwYW4sICgpID0+IHtcblx0XHRcdFx0b3RlbENvbnRleHQud2l0aChhY3RpdmVDdHgsICgpID0+IG5leHQoKSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdGlmICh0aGlzLmFzeW5jRmxvdykge1xuXHRcdFx0dGhpcy5hc3luY0Zsb3cucnVuSW5TY29wZShydW4pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRydW4oKTtcblx0fVxufVxuIl19
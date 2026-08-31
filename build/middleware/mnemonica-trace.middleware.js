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
import { context as otelContext, trace } from '@opentelemetry/api';
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
        // runWithSpan covers the mnemonica-hook side (the provider's own ALS);
        // the OTEL global context is what DiveOtelProvider reads when it looks
        // for a parent span at wrap boundaries — without this second entry
        // dive spans never adopt the request span and stay root traces.
        const activeCtx = trace.setSpan(otelContext.active(), span);
        this.otel.runWithSpan(span, () => {
            otelContext.with(activeCtx, () => next());
        });
    }
};
MnemonicaTraceMiddleware = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object, MnemonicaOtelProvider])
], MnemonicaTraceMiddleware);
export { MnemonicaTraceMiddleware };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXRyYWNlLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9tbmVtb25pY2EtdHJhY2UubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFLQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHNUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFHekUsSUFBTSx3QkFBd0IsR0FBOUIsTUFBTSx3QkFBd0I7SUFFbEI7SUFDQTtJQUZsQixZQUNrQixNQUFjLEVBQ2QsSUFBMkI7UUFEM0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQXVCO0lBQzFDLENBQUM7SUFFSixHQUFHLENBQUUsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUNuRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO1FBRUgsdUVBQXVFO1FBQ3ZFLHVFQUF1RTtRQUN2RSxtRUFBbUU7UUFDbkUsZ0VBQWdFO1FBQ2hFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDaEMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCxDQUFBO0FBMUJZLHdCQUF3QjtJQURwQyxVQUFVLEVBQUU7NkNBSVkscUJBQXFCO0dBSGpDLHdCQUF3QixDQTBCcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5lc3RKUyBtaWRkbGV3YXJlIHRoYXQgY3JlYXRlcyBhbiBPcGVuVGVsZW1ldHJ5IHNwYW4gcGVyIEhUVFAgcmVxdWVzdFxuICogYW5kIHN0b3JlcyBpdCBpbiBBc3luY0xvY2FsU3RvcmFnZSBzbyBtbmVtb25pY2EgaG9va3MgY2FuIG5lc3QgdW5kZXIgaXQuXG4gKi9cbmltcG9ydCB0eXBlIHsgTmVzdE1pZGRsZXdhcmUgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHR5cGUgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgdHlwZSB7IFRyYWNlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSc7XG5pbXBvcnQgeyBjb250ZXh0IGFzIG90ZWxDb250ZXh0LCB0cmFjZSB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSc7XG5pbXBvcnQgeyBNbmVtb25pY2FPdGVsUHJvdmlkZXIgfSBmcm9tICcuLi9wcm92aWRlcnMvbW5lbW9uaWNhLW90ZWwucHJvdmlkZXIuanMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW5lbW9uaWNhVHJhY2VNaWRkbGV3YXJlIGltcGxlbWVudHMgTmVzdE1pZGRsZXdhcmUge1xuXHRjb25zdHJ1Y3RvciAoXG5cdFx0cHJpdmF0ZSByZWFkb25seSB0cmFjZXI6IFRyYWNlcixcblx0XHRwcml2YXRlIHJlYWRvbmx5IG90ZWw6IE1uZW1vbmljYU90ZWxQcm92aWRlcixcblx0KSB7fVxuXG5cdHVzZSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pOiB2b2lkIHtcblx0XHRjb25zdCByb3V0ZSA9IHJlcS5yb3V0ZT8ucGF0aCA/PyByZXEudXJsO1xuXHRcdGNvbnN0IHNwYW4gPSB0aGlzLnRyYWNlci5zdGFydFNwYW4oYEhUVFAgJHtyZXEubWV0aG9kfSAke3JvdXRlfWApO1xuXHRcdHNwYW4uc2V0QXR0cmlidXRlKCdodHRwLm1ldGhvZCcsIHJlcS5tZXRob2QpO1xuXHRcdHNwYW4uc2V0QXR0cmlidXRlKCdodHRwLnVybCcsIHJlcS51cmwpO1xuXG5cdFx0cmVzLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG5cdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnaHR0cC5zdGF0dXNfY29kZScsIHJlcy5zdGF0dXNDb2RlKTtcblx0XHRcdHNwYW4uZW5kKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBydW5XaXRoU3BhbiBjb3ZlcnMgdGhlIG1uZW1vbmljYS1ob29rIHNpZGUgKHRoZSBwcm92aWRlcidzIG93biBBTFMpO1xuXHRcdC8vIHRoZSBPVEVMIGdsb2JhbCBjb250ZXh0IGlzIHdoYXQgRGl2ZU90ZWxQcm92aWRlciByZWFkcyB3aGVuIGl0IGxvb2tzXG5cdFx0Ly8gZm9yIGEgcGFyZW50IHNwYW4gYXQgd3JhcCBib3VuZGFyaWVzIOKAlCB3aXRob3V0IHRoaXMgc2Vjb25kIGVudHJ5XG5cdFx0Ly8gZGl2ZSBzcGFucyBuZXZlciBhZG9wdCB0aGUgcmVxdWVzdCBzcGFuIGFuZCBzdGF5IHJvb3QgdHJhY2VzLlxuXHRcdGNvbnN0IGFjdGl2ZUN0eCA9IHRyYWNlLnNldFNwYW4ob3RlbENvbnRleHQuYWN0aXZlKCksIHNwYW4pO1xuXHRcdHRoaXMub3RlbC5ydW5XaXRoU3BhbihzcGFuLCAoKSA9PiB7XG5cdFx0XHRvdGVsQ29udGV4dC53aXRoKGFjdGl2ZUN0eCwgKCkgPT4gbmV4dCgpKTtcblx0XHR9KTtcblx0fVxufVxuIl19
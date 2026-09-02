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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaTraceMiddleware = void 0;
const common_1 = require("@nestjs/common");
const api_1 = require("@opentelemetry/api");
const mnemonica_otel_provider_js_1 = require("../providers/mnemonica-otel.provider.js");
const async_flow_provider_js_1 = require("../providers/async-flow.provider.js");
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
        const activeCtx = api_1.trace.setSpan(api_1.context.active(), span);
        const run = () => {
            this.otel.runWithSpan(span, () => {
                api_1.context.with(activeCtx, () => next());
            });
        };
        if (this.asyncFlow) {
            this.asyncFlow.runInScope(run);
            return;
        }
        run();
    }
};
exports.MnemonicaTraceMiddleware = MnemonicaTraceMiddleware;
exports.MnemonicaTraceMiddleware = MnemonicaTraceMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, mnemonica_otel_provider_js_1.MnemonicaOtelProvider,
        async_flow_provider_js_1.AsyncFlowProvider])
], MnemonicaTraceMiddleware);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXRyYWNlLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9tbmVtb25pY2EtdHJhY2UubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFLQSwyQ0FBc0Q7QUFHdEQsNENBQW1FO0FBQ25FLHdGQUFnRjtBQUNoRixnRkFBd0U7QUFHakUsSUFBTSx3QkFBd0IsR0FBOUIsTUFBTSx3QkFBd0I7SUFFbEI7SUFDQTtJQUNZO0lBSDlCLFlBQ2tCLE1BQWMsRUFDZCxJQUEyQixFQUNmLFNBQTZCO1FBRnpDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUF1QjtRQUNmLGNBQVMsR0FBVCxTQUFTLENBQW9CO0lBQ3hELENBQUM7SUFFSixHQUFHLENBQUUsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUNuRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO1FBRUgsdUVBQXVFO1FBQ3ZFLHVFQUF1RTtRQUN2RSxtRUFBbUU7UUFDbkUsZ0VBQWdFO1FBQ2hFLGtFQUFrRTtRQUNsRSxzRUFBc0U7UUFDdEUsbUNBQW1DO1FBQ25DLE1BQU0sU0FBUyxHQUFHLFdBQUssQ0FBQyxPQUFPLENBQUMsYUFBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELE1BQU0sR0FBRyxHQUFHLEdBQVMsRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUNoQyxhQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsT0FBTztRQUNSLENBQUM7UUFDRCxHQUFHLEVBQUUsQ0FBQztJQUNQLENBQUM7Q0FDRCxDQUFBO0FBckNZLDREQUF3QjttQ0FBeEIsd0JBQXdCO0lBRHBDLElBQUEsbUJBQVUsR0FBRTtJQUtWLFdBQUEsSUFBQSxpQkFBUSxHQUFFLENBQUE7NkNBRFksa0RBQXFCO1FBQ0gsMENBQWlCO0dBSi9DLHdCQUF3QixDQXFDcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5lc3RKUyBtaWRkbGV3YXJlIHRoYXQgY3JlYXRlcyBhbiBPcGVuVGVsZW1ldHJ5IHNwYW4gcGVyIEhUVFAgcmVxdWVzdFxuICogYW5kIHN0b3JlcyBpdCBpbiBBc3luY0xvY2FsU3RvcmFnZSBzbyBtbmVtb25pY2EgaG9va3MgY2FuIG5lc3QgdW5kZXIgaXQuXG4gKi9cbmltcG9ydCB0eXBlIHsgTmVzdE1pZGRsZXdhcmUgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB0eXBlIHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHR5cGUgeyBUcmFjZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHsgY29udGV4dCBhcyBvdGVsQ29udGV4dCwgdHJhY2UgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHsgTW5lbW9uaWNhT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXJzL21uZW1vbmljYS1vdGVsLnByb3ZpZGVyLmpzJztcbmltcG9ydCB7IEFzeW5jRmxvd1Byb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXJzL2FzeW5jLWZsb3cucHJvdmlkZXIuanMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW5lbW9uaWNhVHJhY2VNaWRkbGV3YXJlIGltcGxlbWVudHMgTmVzdE1pZGRsZXdhcmUge1xuXHRjb25zdHJ1Y3RvciAoXG5cdFx0cHJpdmF0ZSByZWFkb25seSB0cmFjZXI6IFRyYWNlcixcblx0XHRwcml2YXRlIHJlYWRvbmx5IG90ZWw6IE1uZW1vbmljYU90ZWxQcm92aWRlcixcblx0XHRAT3B0aW9uYWwoKSBwcml2YXRlIHJlYWRvbmx5IGFzeW5jRmxvdz86IEFzeW5jRmxvd1Byb3ZpZGVyLFxuXHQpIHt9XG5cblx0dXNlIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQge1xuXHRcdGNvbnN0IHJvdXRlID0gcmVxLnJvdXRlPy5wYXRoID8/IHJlcS51cmw7XG5cdFx0Y29uc3Qgc3BhbiA9IHRoaXMudHJhY2VyLnN0YXJ0U3BhbihgSFRUUCAke3JlcS5tZXRob2R9ICR7cm91dGV9YCk7XG5cdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2h0dHAubWV0aG9kJywgcmVxLm1ldGhvZCk7XG5cdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2h0dHAudXJsJywgcmVxLnVybCk7XG5cblx0XHRyZXMub24oJ2ZpbmlzaCcsICgpID0+IHtcblx0XHRcdHNwYW4uc2V0QXR0cmlidXRlKCdodHRwLnN0YXR1c19jb2RlJywgcmVzLnN0YXR1c0NvZGUpO1xuXHRcdFx0c3Bhbi5lbmQoKTtcblx0XHR9KTtcblxuXHRcdC8vIHJ1bldpdGhTcGFuIGNvdmVycyB0aGUgbW5lbW9uaWNhLWhvb2sgc2lkZSAodGhlIHByb3ZpZGVyJ3Mgb3duIEFMUyk7XG5cdFx0Ly8gdGhlIE9URUwgZ2xvYmFsIGNvbnRleHQgaXMgd2hhdCBEaXZlT3RlbFByb3ZpZGVyIHJlYWRzIHdoZW4gaXQgbG9va3Ncblx0XHQvLyBmb3IgYSBwYXJlbnQgc3BhbiBhdCB3cmFwIGJvdW5kYXJpZXMg4oCUIHdpdGhvdXQgdGhpcyBzZWNvbmQgZW50cnlcblx0XHQvLyBkaXZlIHNwYW5zIG5ldmVyIGFkb3B0IHRoZSByZXF1ZXN0IHNwYW4gYW5kIHN0YXkgcm9vdCB0cmFjZXMuXG5cdFx0Ly8gVGhlIGFzeW5jLWZsb3cgcm9vdCBmcmFtZSAod2hlbiB0aGUgbW9kdWxlIG9wdGlvbiBpcyBvbikgaXMgdGhlXG5cdFx0Ly8gb3V0ZXJtb3N0IHNjb3BlOiBldmVyeSBhc3luYyBob3Agb2YgdGhpcyByZXF1ZXN0IOKAlCB3cmFwcGVkIG9yIG5vdCDigJRcblx0XHQvLyBpbmhlcml0cyBpdCB2aWEgQUxTIHByb3BhZ2F0aW9uLlxuXHRcdGNvbnN0IGFjdGl2ZUN0eCA9IHRyYWNlLnNldFNwYW4ob3RlbENvbnRleHQuYWN0aXZlKCksIHNwYW4pO1xuXHRcdGNvbnN0IHJ1biA9ICgpOiB2b2lkID0+IHtcblx0XHRcdHRoaXMub3RlbC5ydW5XaXRoU3BhbihzcGFuLCAoKSA9PiB7XG5cdFx0XHRcdG90ZWxDb250ZXh0LndpdGgoYWN0aXZlQ3R4LCAoKSA9PiBuZXh0KCkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRpZiAodGhpcy5hc3luY0Zsb3cpIHtcblx0XHRcdHRoaXMuYXN5bmNGbG93LnJ1bkluU2NvcGUocnVuKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0cnVuKCk7XG5cdH1cbn1cbiJdfQ==
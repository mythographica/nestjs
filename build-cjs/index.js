"use strict";
/**
 * @mnemonica/nestjs — NestJS adapter for mnemonica
 *
 * Provides:
 *   - MnemonicaModule.forRoot() / forFeature()
 *   - attachHooks() — dive lifecycle wiring for a TypesCollection
 *   - MnemonicaSerializerInterceptor
 *   - MnemonicaThunderstruckInterceptor + getPreRoot() (dive pre-root data)
 *   - MnemonicaValidationPipe
 *   - MnemonicaBody decorator
 *   - InjectMnemonicaCollection decorator
 *   - isMnemonicaInstance() type guard
 *   - MnemonicaExceptionFilter — the Unblinder: Nest's error boundary speaks trace
 *   - formatFlow() / errorContext() — read-side helpers over dive's trace
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreRoot = exports.MnemonicaExceptionFilter = exports.MnemonicaTraceMiddleware = exports.AsyncFlowProvider = exports.DiveOtelProvider = exports.MnemonicaOtelProvider = exports.attachHooks = exports.errorContext = exports.formatFlow = exports.isMnemonicaInstance = exports.MNEMONICA_COLLECTION = exports.InjectMnemonicaCollection = exports.MnemonicaBody = exports.mtm = exports.mvp = exports.mti = exports.MnemonicaValidationPipe = exports.MnemonicaThunderstruckInterceptor = exports.MnemonicaSerializerInterceptor = exports.DEFAULT_TRACE_LIMIT = exports.MnemonicaModule = void 0;
var mnemonica_module_js_1 = require("./mnemonica.module.js");
Object.defineProperty(exports, "MnemonicaModule", { enumerable: true, get: function () { return mnemonica_module_js_1.MnemonicaModule; } });
Object.defineProperty(exports, "DEFAULT_TRACE_LIMIT", { enumerable: true, get: function () { return mnemonica_module_js_1.DEFAULT_TRACE_LIMIT; } });
var mnemonica_serializer_interceptor_js_1 = require("./interceptors/mnemonica-serializer.interceptor.js");
Object.defineProperty(exports, "MnemonicaSerializerInterceptor", { enumerable: true, get: function () { return mnemonica_serializer_interceptor_js_1.MnemonicaSerializerInterceptor; } });
var mnemonica_thunderstruck_interceptor_js_1 = require("./interceptors/mnemonica-thunderstruck.interceptor.js");
Object.defineProperty(exports, "MnemonicaThunderstruckInterceptor", { enumerable: true, get: function () { return mnemonica_thunderstruck_interceptor_js_1.MnemonicaThunderstruckInterceptor; } });
var mnemonica_validation_pipe_js_1 = require("./pipes/mnemonica-validation.pipe.js");
Object.defineProperty(exports, "MnemonicaValidationPipe", { enumerable: true, get: function () { return mnemonica_validation_pipe_js_1.MnemonicaValidationPipe; } });
// Shortcuts — the long names are for reading; these are for typing.
var mnemonica_thunderstruck_interceptor_js_2 = require("./interceptors/mnemonica-thunderstruck.interceptor.js");
Object.defineProperty(exports, "mti", { enumerable: true, get: function () { return mnemonica_thunderstruck_interceptor_js_2.MnemonicaThunderstruckInterceptor; } });
var mnemonica_validation_pipe_js_2 = require("./pipes/mnemonica-validation.pipe.js");
Object.defineProperty(exports, "mvp", { enumerable: true, get: function () { return mnemonica_validation_pipe_js_2.MnemonicaValidationPipe; } });
var mnemonica_trace_middleware_js_1 = require("./middleware/mnemonica-trace.middleware.js");
Object.defineProperty(exports, "mtm", { enumerable: true, get: function () { return mnemonica_trace_middleware_js_1.MnemonicaTraceMiddleware; } });
var mnemonica_body_decorator_js_1 = require("./decorators/mnemonica-body.decorator.js");
Object.defineProperty(exports, "MnemonicaBody", { enumerable: true, get: function () { return mnemonica_body_decorator_js_1.MnemonicaBody; } });
var tokens_js_1 = require("./tokens.js");
Object.defineProperty(exports, "InjectMnemonicaCollection", { enumerable: true, get: function () { return tokens_js_1.InjectMnemonicaCollection; } });
Object.defineProperty(exports, "MNEMONICA_COLLECTION", { enumerable: true, get: function () { return tokens_js_1.MNEMONICA_COLLECTION; } });
var is_mnemonica_instance_js_1 = require("./utils/is-mnemonica-instance.js");
Object.defineProperty(exports, "isMnemonicaInstance", { enumerable: true, get: function () { return is_mnemonica_instance_js_1.isMnemonicaInstance; } });
var dive_flow_js_1 = require("./utils/dive-flow.js");
Object.defineProperty(exports, "formatFlow", { enumerable: true, get: function () { return dive_flow_js_1.formatFlow; } });
Object.defineProperty(exports, "errorContext", { enumerable: true, get: function () { return dive_flow_js_1.errorContext; } });
var attach_hooks_js_1 = require("./hooks/attach-hooks.js");
Object.defineProperty(exports, "attachHooks", { enumerable: true, get: function () { return attach_hooks_js_1.attachHooks; } });
var mnemonica_otel_provider_js_1 = require("./providers/mnemonica-otel.provider.js");
Object.defineProperty(exports, "MnemonicaOtelProvider", { enumerable: true, get: function () { return mnemonica_otel_provider_js_1.MnemonicaOtelProvider; } });
var dive_otel_provider_js_1 = require("./providers/dive-otel.provider.js");
Object.defineProperty(exports, "DiveOtelProvider", { enumerable: true, get: function () { return dive_otel_provider_js_1.DiveOtelProvider; } });
var async_flow_provider_js_1 = require("./providers/async-flow.provider.js");
Object.defineProperty(exports, "AsyncFlowProvider", { enumerable: true, get: function () { return async_flow_provider_js_1.AsyncFlowProvider; } });
var mnemonica_trace_middleware_js_2 = require("./middleware/mnemonica-trace.middleware.js");
Object.defineProperty(exports, "MnemonicaTraceMiddleware", { enumerable: true, get: function () { return mnemonica_trace_middleware_js_2.MnemonicaTraceMiddleware; } });
var mnemonica_exception_filter_js_1 = require("./filters/mnemonica-exception.filter.js");
Object.defineProperty(exports, "MnemonicaExceptionFilter", { enumerable: true, get: function () { return mnemonica_exception_filter_js_1.MnemonicaExceptionFilter; } });
var pre_root_js_1 = require("./thunderstruck/pre-root.js");
Object.defineProperty(exports, "getPreRoot", { enumerable: true, get: function () { return pre_root_js_1.getPreRoot; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHOzs7QUFFSCw2REFBMEc7QUFBakcsc0hBQUEsZUFBZSxPQUFBO0FBQStCLDBIQUFBLG1CQUFtQixPQUFBO0FBQzFFLDBHQUFvRztBQUEzRixxSkFBQSw4QkFBOEIsT0FBQTtBQUN2QyxnSEFBcUk7QUFBNUgsMkpBQUEsaUNBQWlDLE9BQUE7QUFDMUMscUZBQStFO0FBQXRFLHVJQUFBLHVCQUF1QixPQUFBO0FBQ2hDLG9FQUFvRTtBQUNwRSxnSEFBaUg7QUFBeEcsNkhBQUEsaUNBQWlDLE9BQU87QUFDakQscUZBQXNGO0FBQTdFLG1IQUFBLHVCQUF1QixPQUFPO0FBQ3ZDLDRGQUE2RjtBQUFwRixvSEFBQSx3QkFBd0IsT0FBTztBQUN4Qyx3RkFBeUU7QUFBaEUsNEhBQUEsYUFBYSxPQUFBO0FBQ3RCLHlDQUE4RTtBQUFyRSxzSEFBQSx5QkFBeUIsT0FBQTtBQUFFLGlIQUFBLG9CQUFvQixPQUFBO0FBQ3hELDZFQUF1RTtBQUE5RCwrSEFBQSxtQkFBbUIsT0FBQTtBQUM1QixxREFBd0Y7QUFBL0UsMEdBQUEsVUFBVSxPQUFBO0FBQUUsNEdBQUEsWUFBWSxPQUFBO0FBQ2pDLDJEQUFzRDtBQUE3Qyw4R0FBQSxXQUFXLE9BQUE7QUFDcEIscUZBQStFO0FBQXRFLG1JQUFBLHFCQUFxQixPQUFBO0FBQzlCLDJFQUFxRTtBQUE1RCx5SEFBQSxnQkFBZ0IsT0FBQTtBQUN6Qiw2RUFBMEc7QUFBakcsMkhBQUEsaUJBQWlCLE9BQUE7QUFDMUIsNEZBQXNGO0FBQTdFLHlJQUFBLHdCQUF3QixPQUFBO0FBQ2pDLHlGQUFtRjtBQUExRSx5SUFBQSx3QkFBd0IsT0FBQTtBQUNqQywyREFBbUc7QUFBMUYseUdBQUEsVUFBVSxPQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbW5lbW9uaWNhL25lc3RqcyDigJQgTmVzdEpTIGFkYXB0ZXIgZm9yIG1uZW1vbmljYVxuICpcbiAqIFByb3ZpZGVzOlxuICogICAtIE1uZW1vbmljYU1vZHVsZS5mb3JSb290KCkgLyBmb3JGZWF0dXJlKClcbiAqICAgLSBhdHRhY2hIb29rcygpIOKAlCBkaXZlIGxpZmVjeWNsZSB3aXJpbmcgZm9yIGEgVHlwZXNDb2xsZWN0aW9uXG4gKiAgIC0gTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yXG4gKiAgIC0gTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yICsgZ2V0UHJlUm9vdCgpIChkaXZlIHByZS1yb290IGRhdGEpXG4gKiAgIC0gTW5lbW9uaWNhVmFsaWRhdGlvblBpcGVcbiAqICAgLSBNbmVtb25pY2FCb2R5IGRlY29yYXRvclxuICogICAtIEluamVjdE1uZW1vbmljYUNvbGxlY3Rpb24gZGVjb3JhdG9yXG4gKiAgIC0gaXNNbmVtb25pY2FJbnN0YW5jZSgpIHR5cGUgZ3VhcmRcbiAqICAgLSBNbmVtb25pY2FFeGNlcHRpb25GaWx0ZXIg4oCUIHRoZSBVbmJsaW5kZXI6IE5lc3QncyBlcnJvciBib3VuZGFyeSBzcGVha3MgdHJhY2VcbiAqICAgLSBmb3JtYXRGbG93KCkgLyBlcnJvckNvbnRleHQoKSDigJQgcmVhZC1zaWRlIGhlbHBlcnMgb3ZlciBkaXZlJ3MgdHJhY2VcbiAqL1xuXG5leHBvcnQgeyBNbmVtb25pY2FNb2R1bGUsIHR5cGUgTW5lbW9uaWNhTW9kdWxlT3B0aW9ucywgREVGQVVMVF9UUkFDRV9MSU1JVCB9IGZyb20gJy4vbW5lbW9uaWNhLm1vZHVsZS5qcyc7XG5leHBvcnQgeyBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9ycy9tbmVtb25pY2Etc2VyaWFsaXplci5pbnRlcmNlcHRvci5qcyc7XG5leHBvcnQgeyBNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IsIHR5cGUgVGh1bmRlcnN0cnVja09wdGlvbnMgfSBmcm9tICcuL2ludGVyY2VwdG9ycy9tbmVtb25pY2EtdGh1bmRlcnN0cnVjay5pbnRlcmNlcHRvci5qcyc7XG5leHBvcnQgeyBNbmVtb25pY2FWYWxpZGF0aW9uUGlwZSB9IGZyb20gJy4vcGlwZXMvbW5lbW9uaWNhLXZhbGlkYXRpb24ucGlwZS5qcyc7XG4vLyBTaG9ydGN1dHMg4oCUIHRoZSBsb25nIG5hbWVzIGFyZSBmb3IgcmVhZGluZzsgdGhlc2UgYXJlIGZvciB0eXBpbmcuXG5leHBvcnQgeyBNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IgYXMgbXRpIH0gZnJvbSAnLi9pbnRlcmNlcHRvcnMvbW5lbW9uaWNhLXRodW5kZXJzdHJ1Y2suaW50ZXJjZXB0b3IuanMnO1xuZXhwb3J0IHsgTW5lbW9uaWNhVmFsaWRhdGlvblBpcGUgYXMgbXZwIH0gZnJvbSAnLi9waXBlcy9tbmVtb25pY2EtdmFsaWRhdGlvbi5waXBlLmpzJztcbmV4cG9ydCB7IE1uZW1vbmljYVRyYWNlTWlkZGxld2FyZSBhcyBtdG0gfSBmcm9tICcuL21pZGRsZXdhcmUvbW5lbW9uaWNhLXRyYWNlLm1pZGRsZXdhcmUuanMnO1xuZXhwb3J0IHsgTW5lbW9uaWNhQm9keSB9IGZyb20gJy4vZGVjb3JhdG9ycy9tbmVtb25pY2EtYm9keS5kZWNvcmF0b3IuanMnO1xuZXhwb3J0IHsgSW5qZWN0TW5lbW9uaWNhQ29sbGVjdGlvbiwgTU5FTU9OSUNBX0NPTExFQ1RJT04gfSBmcm9tICcuL3Rva2Vucy5qcyc7XG5leHBvcnQgeyBpc01uZW1vbmljYUluc3RhbmNlIH0gZnJvbSAnLi91dGlscy9pcy1tbmVtb25pY2EtaW5zdGFuY2UuanMnO1xuZXhwb3J0IHsgZm9ybWF0RmxvdywgZXJyb3JDb250ZXh0LCB0eXBlIEZvcm1hdHRlZEZsb3dFZGdlIH0gZnJvbSAnLi91dGlscy9kaXZlLWZsb3cuanMnO1xuZXhwb3J0IHsgYXR0YWNoSG9va3MgfSBmcm9tICcuL2hvb2tzL2F0dGFjaC1ob29rcy5qcyc7XG5leHBvcnQgeyBNbmVtb25pY2FPdGVsUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9tbmVtb25pY2Etb3RlbC5wcm92aWRlci5qcyc7XG5leHBvcnQgeyBEaXZlT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZGl2ZS1vdGVsLnByb3ZpZGVyLmpzJztcbmV4cG9ydCB7IEFzeW5jRmxvd1Byb3ZpZGVyLCB0eXBlIEZsb3dGcmFtZSwgdHlwZSBDcmFzaENvbnRleHQgfSBmcm9tICcuL3Byb3ZpZGVycy9hc3luYy1mbG93LnByb3ZpZGVyLmpzJztcbmV4cG9ydCB7IE1uZW1vbmljYVRyYWNlTWlkZGxld2FyZSB9IGZyb20gJy4vbWlkZGxld2FyZS9tbmVtb25pY2EtdHJhY2UubWlkZGxld2FyZS5qcyc7XG5leHBvcnQgeyBNbmVtb25pY2FFeGNlcHRpb25GaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcnMvbW5lbW9uaWNhLWV4Y2VwdGlvbi5maWx0ZXIuanMnO1xuZXhwb3J0IHsgZ2V0UHJlUm9vdCwgdHlwZSBQcmVSb290RGF0YSwgdHlwZSBSYXdQcmVSb290UGF5bG9hZCB9IGZyb20gJy4vdGh1bmRlcnN0cnVjay9wcmUtcm9vdC5qcyc7XG4iXX0=
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
 *   - formatFlow() / errorContext() — read-side helpers over dive's trace
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreRoot = exports.MnemonicaTraceMiddleware = exports.AsyncFlowProvider = exports.DiveOtelProvider = exports.MnemonicaOtelProvider = exports.attachHooks = exports.errorContext = exports.formatFlow = exports.isMnemonicaInstance = exports.MNEMONICA_COLLECTION = exports.InjectMnemonicaCollection = exports.MnemonicaBody = exports.mtm = exports.mvp = exports.mti = exports.MnemonicaValidationPipe = exports.MnemonicaThunderstruckInterceptor = exports.MnemonicaSerializerInterceptor = exports.DEFAULT_TRACE_LIMIT = exports.MnemonicaModule = void 0;
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
var pre_root_js_1 = require("./thunderstruck/pre-root.js");
Object.defineProperty(exports, "getPreRoot", { enumerable: true, get: function () { return pre_root_js_1.getPreRoot; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7O0dBYUc7OztBQUVILDZEQUEwRztBQUFqRyxzSEFBQSxlQUFlLE9BQUE7QUFBK0IsMEhBQUEsbUJBQW1CLE9BQUE7QUFDMUUsMEdBQW9HO0FBQTNGLHFKQUFBLDhCQUE4QixPQUFBO0FBQ3ZDLGdIQUFxSTtBQUE1SCwySkFBQSxpQ0FBaUMsT0FBQTtBQUMxQyxxRkFBK0U7QUFBdEUsdUlBQUEsdUJBQXVCLE9BQUE7QUFDaEMsb0VBQW9FO0FBQ3BFLGdIQUFpSDtBQUF4Ryw2SEFBQSxpQ0FBaUMsT0FBTztBQUNqRCxxRkFBc0Y7QUFBN0UsbUhBQUEsdUJBQXVCLE9BQU87QUFDdkMsNEZBQTZGO0FBQXBGLG9IQUFBLHdCQUF3QixPQUFPO0FBQ3hDLHdGQUF5RTtBQUFoRSw0SEFBQSxhQUFhLE9BQUE7QUFDdEIseUNBQThFO0FBQXJFLHNIQUFBLHlCQUF5QixPQUFBO0FBQUUsaUhBQUEsb0JBQW9CLE9BQUE7QUFDeEQsNkVBQXVFO0FBQTlELCtIQUFBLG1CQUFtQixPQUFBO0FBQzVCLHFEQUF3RjtBQUEvRSwwR0FBQSxVQUFVLE9BQUE7QUFBRSw0R0FBQSxZQUFZLE9BQUE7QUFDakMsMkRBQXNEO0FBQTdDLDhHQUFBLFdBQVcsT0FBQTtBQUNwQixxRkFBK0U7QUFBdEUsbUlBQUEscUJBQXFCLE9BQUE7QUFDOUIsMkVBQXFFO0FBQTVELHlIQUFBLGdCQUFnQixPQUFBO0FBQ3pCLDZFQUEwRztBQUFqRywySEFBQSxpQkFBaUIsT0FBQTtBQUMxQiw0RkFBc0Y7QUFBN0UseUlBQUEsd0JBQXdCLE9BQUE7QUFDakMsMkRBQW1HO0FBQTFGLHlHQUFBLFVBQVUsT0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQG1uZW1vbmljYS9uZXN0anMg4oCUIE5lc3RKUyBhZGFwdGVyIGZvciBtbmVtb25pY2FcbiAqXG4gKiBQcm92aWRlczpcbiAqICAgLSBNbmVtb25pY2FNb2R1bGUuZm9yUm9vdCgpIC8gZm9yRmVhdHVyZSgpXG4gKiAgIC0gYXR0YWNoSG9va3MoKSDigJQgZGl2ZSBsaWZlY3ljbGUgd2lyaW5nIGZvciBhIFR5cGVzQ29sbGVjdGlvblxuICogICAtIE1uZW1vbmljYVNlcmlhbGl6ZXJJbnRlcmNlcHRvclxuICogICAtIE1uZW1vbmljYVRodW5kZXJzdHJ1Y2tJbnRlcmNlcHRvciArIGdldFByZVJvb3QoKSAoZGl2ZSBwcmUtcm9vdCBkYXRhKVxuICogICAtIE1uZW1vbmljYVZhbGlkYXRpb25QaXBlXG4gKiAgIC0gTW5lbW9uaWNhQm9keSBkZWNvcmF0b3JcbiAqICAgLSBJbmplY3RNbmVtb25pY2FDb2xsZWN0aW9uIGRlY29yYXRvclxuICogICAtIGlzTW5lbW9uaWNhSW5zdGFuY2UoKSB0eXBlIGd1YXJkXG4gKiAgIC0gZm9ybWF0RmxvdygpIC8gZXJyb3JDb250ZXh0KCkg4oCUIHJlYWQtc2lkZSBoZWxwZXJzIG92ZXIgZGl2ZSdzIHRyYWNlXG4gKi9cblxuZXhwb3J0IHsgTW5lbW9uaWNhTW9kdWxlLCB0eXBlIE1uZW1vbmljYU1vZHVsZU9wdGlvbnMsIERFRkFVTFRfVFJBQ0VfTElNSVQgfSBmcm9tICcuL21uZW1vbmljYS5tb2R1bGUuanMnO1xuZXhwb3J0IHsgTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvcnMvbW5lbW9uaWNhLXNlcmlhbGl6ZXIuaW50ZXJjZXB0b3IuanMnO1xuZXhwb3J0IHsgTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yLCB0eXBlIFRodW5kZXJzdHJ1Y2tPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmNlcHRvcnMvbW5lbW9uaWNhLXRodW5kZXJzdHJ1Y2suaW50ZXJjZXB0b3IuanMnO1xuZXhwb3J0IHsgTW5lbW9uaWNhVmFsaWRhdGlvblBpcGUgfSBmcm9tICcuL3BpcGVzL21uZW1vbmljYS12YWxpZGF0aW9uLnBpcGUuanMnO1xuLy8gU2hvcnRjdXRzIOKAlCB0aGUgbG9uZyBuYW1lcyBhcmUgZm9yIHJlYWRpbmc7IHRoZXNlIGFyZSBmb3IgdHlwaW5nLlxuZXhwb3J0IHsgTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yIGFzIG10aSB9IGZyb20gJy4vaW50ZXJjZXB0b3JzL21uZW1vbmljYS10aHVuZGVyc3RydWNrLmludGVyY2VwdG9yLmpzJztcbmV4cG9ydCB7IE1uZW1vbmljYVZhbGlkYXRpb25QaXBlIGFzIG12cCB9IGZyb20gJy4vcGlwZXMvbW5lbW9uaWNhLXZhbGlkYXRpb24ucGlwZS5qcyc7XG5leHBvcnQgeyBNbmVtb25pY2FUcmFjZU1pZGRsZXdhcmUgYXMgbXRtIH0gZnJvbSAnLi9taWRkbGV3YXJlL21uZW1vbmljYS10cmFjZS5taWRkbGV3YXJlLmpzJztcbmV4cG9ydCB7IE1uZW1vbmljYUJvZHkgfSBmcm9tICcuL2RlY29yYXRvcnMvbW5lbW9uaWNhLWJvZHkuZGVjb3JhdG9yLmpzJztcbmV4cG9ydCB7IEluamVjdE1uZW1vbmljYUNvbGxlY3Rpb24sIE1ORU1PTklDQV9DT0xMRUNUSU9OIH0gZnJvbSAnLi90b2tlbnMuanMnO1xuZXhwb3J0IHsgaXNNbmVtb25pY2FJbnN0YW5jZSB9IGZyb20gJy4vdXRpbHMvaXMtbW5lbW9uaWNhLWluc3RhbmNlLmpzJztcbmV4cG9ydCB7IGZvcm1hdEZsb3csIGVycm9yQ29udGV4dCwgdHlwZSBGb3JtYXR0ZWRGbG93RWRnZSB9IGZyb20gJy4vdXRpbHMvZGl2ZS1mbG93LmpzJztcbmV4cG9ydCB7IGF0dGFjaEhvb2tzIH0gZnJvbSAnLi9ob29rcy9hdHRhY2gtaG9va3MuanMnO1xuZXhwb3J0IHsgTW5lbW9uaWNhT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvbW5lbW9uaWNhLW90ZWwucHJvdmlkZXIuanMnO1xuZXhwb3J0IHsgRGl2ZU90ZWxQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2RpdmUtb3RlbC5wcm92aWRlci5qcyc7XG5leHBvcnQgeyBBc3luY0Zsb3dQcm92aWRlciwgdHlwZSBGbG93RnJhbWUsIHR5cGUgQ3Jhc2hDb250ZXh0IH0gZnJvbSAnLi9wcm92aWRlcnMvYXN5bmMtZmxvdy5wcm92aWRlci5qcyc7XG5leHBvcnQgeyBNbmVtb25pY2FUcmFjZU1pZGRsZXdhcmUgfSBmcm9tICcuL21pZGRsZXdhcmUvbW5lbW9uaWNhLXRyYWNlLm1pZGRsZXdhcmUuanMnO1xuZXhwb3J0IHsgZ2V0UHJlUm9vdCwgdHlwZSBQcmVSb290RGF0YSwgdHlwZSBSYXdQcmVSb290UGF5bG9hZCB9IGZyb20gJy4vdGh1bmRlcnN0cnVjay9wcmUtcm9vdC5qcyc7XG4iXX0=
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MnemonicaModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaModule = exports.DEFAULT_TRACE_LIMIT = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const module_1 = require("mnemonica/module");
const dive_1 = require("@mnemonica/dive");
const attach_hooks_js_1 = require("./hooks/attach-hooks.js");
const mnemonica_serializer_interceptor_js_1 = require("./interceptors/mnemonica-serializer.interceptor.js");
const mnemonica_thunderstruck_interceptor_js_1 = require("./interceptors/mnemonica-thunderstruck.interceptor.js");
const tokens_js_1 = require("./tokens.js");
const mnemonica_otel_provider_js_1 = require("./providers/mnemonica-otel.provider.js");
const dive_otel_provider_js_1 = require("./providers/dive-otel.provider.js");
/**
 * The dive trace's default ring-buffer size — re-exported so the tuning
 * knob is discoverable where the module is configured. Matches dive's own
 * internal default; the buffer size IS dive's memory bound.
 */
exports.DEFAULT_TRACE_LIMIT = 1024;
let MnemonicaModule = MnemonicaModule_1 = class MnemonicaModule {
    static forRoot(options = {}) {
        const collection = options.collection ?? module_1.defaultTypes;
        // Dive-global knob: applied only when explicitly provided — a direct
        // setTraceLimit() from userland must never be silently overridden.
        if (options.traceLimit !== undefined) {
            (0, dive_1.setTraceLimit)(options.traceLimit);
        }
        const providers = [
            { provide: tokens_js_1.MNEMONICA_COLLECTION, useValue: collection },
        ];
        if (options.autoExtract) {
            providers.push({
                provide: core_1.APP_INTERCEPTOR,
                useClass: mnemonica_serializer_interceptor_js_1.MnemonicaSerializerInterceptor,
            });
        }
        if (options.thunderstruck) {
            // Dive hooks first (creation edges + method wrapping), then the
            // boundary interceptor that stamps pre-root payloads. The config
            // rides a DI token: a constructor parameter of an interface type
            // would surface in design:paramtypes as Object and break Nest's
            // class-based instantiation where the token is not registered.
            (0, attach_hooks_js_1.attachHooks)(collection);
            providers.push({
                provide: tokens_js_1.MNEMONICA_THUNDERSTRUCK_OPTIONS,
                useValue: typeof options.thunderstruck === 'object'
                    ? options.thunderstruck
                    : {},
            });
            providers.push({
                provide: core_1.APP_INTERCEPTOR,
                useClass: mnemonica_thunderstruck_interceptor_js_1.MnemonicaThunderstruckInterceptor,
            });
        }
        if (options.tracer) {
            const otel = new mnemonica_otel_provider_js_1.MnemonicaOtelProvider(options.tracer);
            otel.attachHooks(collection);
            providers.push({
                provide: mnemonica_otel_provider_js_1.MnemonicaOtelProvider,
                useValue: otel,
            });
            if (options.traceDiveCalls) {
                const diveOtel = new dive_otel_provider_js_1.DiveOtelProvider(options.tracer);
                diveOtel.attach();
                providers.push({
                    provide: dive_otel_provider_js_1.DiveOtelProvider,
                    useValue: diveOtel,
                });
            }
        }
        else if (options.telemetry) {
            this.registerTelemetryHooks(collection);
        }
        return {
            module: MnemonicaModule_1,
            providers,
            exports: [tokens_js_1.MNEMONICA_COLLECTION],
            global: true,
        };
    }
    static forFeature(name, config) {
        const collection = (0, module_1.createTypesCollection)(config);
        const token = (0, tokens_js_1.getFeatureToken)(name);
        return {
            module: MnemonicaModule_1,
            providers: [
                { provide: token, useValue: collection },
            ],
            exports: [token],
            global: false,
        };
    }
    static registerTelemetryHooks(collection) {
        collection.registerHook('postCreation', ({ TypeName }) => {
            // eslint-disable-next-line no-console
            console.log('[mnemonica] created:', TypeName);
        });
        collection.registerHook('creationError', ({ TypeName }) => {
            // eslint-disable-next-line no-console
            console.error('[mnemonica] error:', TypeName);
        });
    }
};
exports.MnemonicaModule = MnemonicaModule;
exports.MnemonicaModule = MnemonicaModule = MnemonicaModule_1 = __decorate([
    (0, common_1.Module)({})
], MnemonicaModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tbmVtb25pY2EubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFrQkEsMkNBQXdDO0FBQ3hDLHVDQUErQztBQUUvQyw2Q0FBdUU7QUFFdkUsMENBQWdEO0FBQ2hELDZEQUFzRDtBQVN0RCw0R0FBb0c7QUFDcEcsa0hBRytEO0FBQy9ELDJDQUFxRztBQUNyRyx1RkFBK0U7QUFDL0UsNkVBQXFFO0FBa0NyRTs7OztHQUlHO0FBQ1UsUUFBQSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFHakMsSUFBTSxlQUFlLHVCQUFyQixNQUFNLGVBQWU7SUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBRSxVQUFrQyxFQUFFO1FBQ25ELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUkscUJBQVksQ0FBQztRQUV0RCxxRUFBcUU7UUFDckUsbUVBQW1FO1FBQ25FLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN0QyxJQUFBLG9CQUFhLEVBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBZTtZQUM3QixFQUFFLE9BQU8sRUFBRSxnQ0FBb0IsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO1NBQ3ZELENBQUM7UUFFRixJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QixTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNkLE9BQU8sRUFBRyxzQkFBZTtnQkFDekIsUUFBUSxFQUFHLG9FQUE4QjthQUN6QyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDM0IsZ0VBQWdFO1lBQ2hFLGlFQUFpRTtZQUNqRSxpRUFBaUU7WUFDakUsZ0VBQWdFO1lBQ2hFLCtEQUErRDtZQUMvRCxJQUFBLDZCQUFXLEVBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEIsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDZCxPQUFPLEVBQUcsMkNBQStCO2dCQUN6QyxRQUFRLEVBQUcsT0FBTyxPQUFPLENBQUMsYUFBYSxLQUFLLFFBQVE7b0JBQ25ELENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYTtvQkFDdkIsQ0FBQyxDQUFDLEVBQUU7YUFDTCxDQUFDLENBQUM7WUFDSCxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNkLE9BQU8sRUFBRyxzQkFBZTtnQkFDekIsUUFBUSxFQUFHLDBFQUFpQzthQUM1QyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxrREFBcUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3QixTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNkLE9BQU8sRUFBRyxrREFBcUI7Z0JBQy9CLFFBQVEsRUFBRyxJQUFJO2FBQ2YsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksd0NBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0RCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2xCLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQ2QsT0FBTyxFQUFHLHdDQUFnQjtvQkFDMUIsUUFBUSxFQUFHLFFBQVE7aUJBQ25CLENBQUMsQ0FBQztZQUNKLENBQUM7UUFDRixDQUFDO2FBQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFRCxPQUFPO1lBQ04sTUFBTSxFQUFJLGlCQUFlO1lBQ3pCLFNBQVM7WUFDVCxPQUFPLEVBQUcsQ0FBQyxnQ0FBb0IsQ0FBQztZQUNoQyxNQUFNLEVBQUksSUFBSTtTQUNkLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBRSxJQUFZLEVBQUUsTUFBMkI7UUFDM0QsTUFBTSxVQUFVLEdBQUcsSUFBQSw4QkFBcUIsRUFBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxNQUFNLEtBQUssR0FBRyxJQUFBLDJCQUFlLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEMsT0FBTztZQUNOLE1BQU0sRUFBSSxpQkFBZTtZQUN6QixTQUFTLEVBQUc7Z0JBQ1gsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7YUFDeEM7WUFDRCxPQUFPLEVBQUcsQ0FBQyxLQUFLLENBQUM7WUFDakIsTUFBTSxFQUFJLEtBQUs7U0FDZixDQUFDO0lBQ0gsQ0FBQztJQUVPLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBRSxVQUEyQjtRQUNqRSxVQUFVLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUN4RCxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQ3pELHNDQUFzQztZQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNELENBQUE7QUE1RlksMENBQWU7MEJBQWYsZUFBZTtJQUQzQixJQUFBLGVBQU0sRUFBQyxFQUFFLENBQUM7R0FDRSxlQUFlLENBNEYzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTmVzdEpTIG1vZHVsZSBmb3IgbW5lbW9uaWNhIGludGVncmF0aW9uLlxuICpcbiAqIGZvclJvb3QoKSAgIOKAlCByZWdpc3RlcnMgdGhlIGdsb2JhbC9kZWZhdWx0IFR5cGVzQ29sbGVjdGlvblxuICogZm9yRmVhdHVyZSgpIOKAlCBjcmVhdGVzIGFuIGlzb2xhdGVkIFR5cGVzQ29sbGVjdGlvbiBwZXIgbW9kdWxlXG4gKlxuICogVXNhZ2U6XG4gKiAgIEBNb2R1bGUoe1xuICogICAgIGltcG9ydHM6IFtNbmVtb25pY2FNb2R1bGUuZm9yUm9vdCh7IGF1dG9FeHRyYWN0OiB0cnVlIH0pXSxcbiAqICAgfSlcbiAqICAgY2xhc3MgQXBwTW9kdWxlIHt9XG4gKlxuICogICBATW9kdWxlKHtcbiAqICAgICBpbXBvcnRzOiBbTW5lbW9uaWNhTW9kdWxlLmZvckZlYXR1cmUoJ3BheW1lbnRzJyldLFxuICogICB9KVxuICogICBjbGFzcyBQYXltZW50c01vZHVsZSB7fVxuICovXG5pbXBvcnQgdHlwZSB7IER5bmFtaWNNb2R1bGUsIFByb3ZpZGVyIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgTW9kdWxlIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgQVBQX0lOVEVSQ0VQVE9SIH0gZnJvbSAnQG5lc3Rqcy9jb3JlJztcbmltcG9ydCB0eXBlIHsgVHJhY2VyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvYXBpJztcbmltcG9ydCB7IGRlZmF1bHRUeXBlcywgY3JlYXRlVHlwZXNDb2xsZWN0aW9uIH0gZnJvbSAnbW5lbW9uaWNhL21vZHVsZSc7XG5pbXBvcnQgdHlwZSB7IFR5cGVzQ29sbGVjdGlvbiB9IGZyb20gJ21uZW1vbmljYS9tb2R1bGUnO1xuaW1wb3J0IHsgc2V0VHJhY2VMaW1pdCB9IGZyb20gJ0BtbmVtb25pY2EvZGl2ZSc7XG5pbXBvcnQgeyBhdHRhY2hIb29rcyB9IGZyb20gJy4vaG9va3MvYXR0YWNoLWhvb2tzLmpzJztcblxudHlwZSBDb25zdHJ1Y3Rvck9wdGlvbnMgPSB7XG5cdHN0cmljdENoYWluPzogYm9vbGVhbjtcblx0YmxvY2tFcnJvcnM/OiBib29sZWFuO1xuXHRzdWJtaXRTdGFjaz86IGJvb2xlYW47XG5cdGF3YWl0UmV0dXJuPzogYm9vbGVhbjtcblx0YXNDbGFzcz86IGJvb2xlYW47XG59O1xuaW1wb3J0IHsgTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvcnMvbW5lbW9uaWNhLXNlcmlhbGl6ZXIuaW50ZXJjZXB0b3IuanMnO1xuaW1wb3J0IHtcblx0TW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yLFxuXHR0eXBlIFRodW5kZXJzdHJ1Y2tPcHRpb25zLFxufSBmcm9tICcuL2ludGVyY2VwdG9ycy9tbmVtb25pY2EtdGh1bmRlcnN0cnVjay5pbnRlcmNlcHRvci5qcyc7XG5pbXBvcnQgeyBNTkVNT05JQ0FfQ09MTEVDVElPTiwgTU5FTU9OSUNBX1RIVU5ERVJTVFJVQ0tfT1BUSU9OUywgZ2V0RmVhdHVyZVRva2VuIH0gZnJvbSAnLi90b2tlbnMuanMnO1xuaW1wb3J0IHsgTW5lbW9uaWNhT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvbW5lbW9uaWNhLW90ZWwucHJvdmlkZXIuanMnO1xuaW1wb3J0IHsgRGl2ZU90ZWxQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2RpdmUtb3RlbC5wcm92aWRlci5qcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW5lbW9uaWNhTW9kdWxlT3B0aW9ucyB7XG5cdC8qKiBFeGlzdGluZyBUeXBlc0NvbGxlY3Rpb24gKGRlZmF1bHQgPSBtbmVtb25pY2EuZGVmYXVsdFR5cGVzKSAqL1xuXHRjb2xsZWN0aW9uPzogVHlwZXNDb2xsZWN0aW9uO1xuXHQvKiogQXV0by13aXJlIGNvbnNvbGUgdGVsZW1ldHJ5IGhvb2tzICovXG5cdHRlbGVtZXRyeT86IGJvb2xlYW47XG5cdC8qKiBHbG9iYWxseSByZWdpc3RlciBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IgKi9cblx0YXV0b0V4dHJhY3Q/OiBib29sZWFuO1xuXHQvKiogT3BlblRlbGVtZXRyeSB0cmFjZXIg4oCUIGlmIHByb3ZpZGVkLCByZXBsYWNlcyBjb25zb2xlIHRlbGVtZXRyeSB3aXRoIE9UZWwgc3BhbnMgKi9cblx0dHJhY2VyPzogVHJhY2VyO1xuXHQvKipcblx0ICogU3BhbiBFVkVSWSBkaXZlLXdyYXBwZWQgY2FsbCAoY2FsbCAvIGNvbnN0cnVjdCAvIG1ldGhvZCAvIHJlY29udGV4dCksXG5cdCAqIG5vdCBqdXN0IGNvbnN0cnVjdGlvbnMuIFJlcXVpcmVzIGB0cmFjZXJgLiBTcGFucyBhcmUgcGFyZW50ZWQgb24gZGl2ZSdzXG5cdCAqIG93biB0cmFjZSBwYXJlbnRhZ2U7IGF0IHVud3JhcHBlZCBib3VuZGFyaWVzIHRoZXkgbmVzdCB1bmRlciB0aGUgYWN0aXZlXG5cdCAqIE9UZWwgc3BhbiAoZS5nLiB0aGUgSFRUUCByZXF1ZXN0IHNwYW4gZnJvbSBtdG0pLlxuXHQgKi9cblx0dHJhY2VEaXZlQ2FsbHM/OiBib29sZWFuO1xuXHQvKipcblx0ICogRGl2ZSByaW5nLWJ1ZmZlciBzaXplIChlZGdlcyBrZXB0IGluIHRoZSB0cmFjZSkuIEFwcGxpZWQgb25seSB3aGVuXG5cdCAqIGV4cGxpY2l0bHkgcHJvdmlkZWQsIHNvIGEgZGlyZWN0IHNldFRyYWNlTGltaXQoKSBjYWxsIGZyb20gdXNlcmxhbmQgaXNcblx0ICogbmV2ZXIgb3ZlcnJpZGRlbi4gRGl2ZSdzIG93biBkZWZhdWx0IGVxdWFscyBERUZBVUxUX1RSQUNFX0xJTUlULlxuXHQgKi9cblx0dHJhY2VMaW1pdD86IG51bWJlcjtcblx0LyoqXG5cdCAqIFRodW5kZXJzdHJ1Y2s6IGF0dGFjaCBkaXZlIGhvb2tzIHRvIHRoZSBjb2xsZWN0aW9uIEFORCByZWdpc3RlciB0aGVcblx0ICogTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yIGdsb2JhbGx5IOKAlCByYXcgcmVxdWVzdCBwYXlsb2FkcyBhcmVcblx0ICogZmVkIGludG8gZGl2ZSdzIHByZS1yb290IGNvbGxlY3RvciBhaGVhZCBvZiBldmVyeSBjb25zdHJ1Y3Rpb24uXG5cdCAqIFBhc3MgYSBUaHVuZGVyc3RydWNrT3B0aW9ucyBvYmplY3QgZm9yIHRoZSBleHRyYXMsIGUuZy5cblx0ICogeyBzdG9yZVJlcXVlc3Q6IHRydWUgfS5cblx0ICovXG5cdHRodW5kZXJzdHJ1Y2s/OiBib29sZWFuIHwgVGh1bmRlcnN0cnVja09wdGlvbnM7XG59XG5cbi8qKlxuICogVGhlIGRpdmUgdHJhY2UncyBkZWZhdWx0IHJpbmctYnVmZmVyIHNpemUg4oCUIHJlLWV4cG9ydGVkIHNvIHRoZSB0dW5pbmdcbiAqIGtub2IgaXMgZGlzY292ZXJhYmxlIHdoZXJlIHRoZSBtb2R1bGUgaXMgY29uZmlndXJlZC4gTWF0Y2hlcyBkaXZlJ3Mgb3duXG4gKiBpbnRlcm5hbCBkZWZhdWx0OyB0aGUgYnVmZmVyIHNpemUgSVMgZGl2ZSdzIG1lbW9yeSBib3VuZC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVFJBQ0VfTElNSVQgPSAxMDI0O1xuXG5ATW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIE1uZW1vbmljYU1vZHVsZSB7XG5cdHN0YXRpYyBmb3JSb290IChvcHRpb25zOiBNbmVtb25pY2FNb2R1bGVPcHRpb25zID0ge30pOiBEeW5hbWljTW9kdWxlIHtcblx0XHRjb25zdCBjb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uID8/IGRlZmF1bHRUeXBlcztcblxuXHRcdC8vIERpdmUtZ2xvYmFsIGtub2I6IGFwcGxpZWQgb25seSB3aGVuIGV4cGxpY2l0bHkgcHJvdmlkZWQg4oCUIGEgZGlyZWN0XG5cdFx0Ly8gc2V0VHJhY2VMaW1pdCgpIGZyb20gdXNlcmxhbmQgbXVzdCBuZXZlciBiZSBzaWxlbnRseSBvdmVycmlkZGVuLlxuXHRcdGlmIChvcHRpb25zLnRyYWNlTGltaXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0c2V0VHJhY2VMaW1pdChvcHRpb25zLnRyYWNlTGltaXQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByb3ZpZGVyczogUHJvdmlkZXJbXSA9IFtcblx0XHRcdHsgcHJvdmlkZTogTU5FTU9OSUNBX0NPTExFQ1RJT04sIHVzZVZhbHVlOiBjb2xsZWN0aW9uIH0sXG5cdFx0XTtcblxuXHRcdGlmIChvcHRpb25zLmF1dG9FeHRyYWN0KSB7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBBUFBfSU5URVJDRVBUT1IsXG5cdFx0XHRcdHVzZUNsYXNzIDogTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMudGh1bmRlcnN0cnVjaykge1xuXHRcdFx0Ly8gRGl2ZSBob29rcyBmaXJzdCAoY3JlYXRpb24gZWRnZXMgKyBtZXRob2Qgd3JhcHBpbmcpLCB0aGVuIHRoZVxuXHRcdFx0Ly8gYm91bmRhcnkgaW50ZXJjZXB0b3IgdGhhdCBzdGFtcHMgcHJlLXJvb3QgcGF5bG9hZHMuIFRoZSBjb25maWdcblx0XHRcdC8vIHJpZGVzIGEgREkgdG9rZW46IGEgY29uc3RydWN0b3IgcGFyYW1ldGVyIG9mIGFuIGludGVyZmFjZSB0eXBlXG5cdFx0XHQvLyB3b3VsZCBzdXJmYWNlIGluIGRlc2lnbjpwYXJhbXR5cGVzIGFzIE9iamVjdCBhbmQgYnJlYWsgTmVzdCdzXG5cdFx0XHQvLyBjbGFzcy1iYXNlZCBpbnN0YW50aWF0aW9uIHdoZXJlIHRoZSB0b2tlbiBpcyBub3QgcmVnaXN0ZXJlZC5cblx0XHRcdGF0dGFjaEhvb2tzKGNvbGxlY3Rpb24pO1xuXHRcdFx0cHJvdmlkZXJzLnB1c2goe1xuXHRcdFx0XHRwcm92aWRlIDogTU5FTU9OSUNBX1RIVU5ERVJTVFJVQ0tfT1BUSU9OUyxcblx0XHRcdFx0dXNlVmFsdWUgOiB0eXBlb2Ygb3B0aW9ucy50aHVuZGVyc3RydWNrID09PSAnb2JqZWN0J1xuXHRcdFx0XHRcdD8gb3B0aW9ucy50aHVuZGVyc3RydWNrXG5cdFx0XHRcdFx0OiB7fSxcblx0XHRcdH0pO1xuXHRcdFx0cHJvdmlkZXJzLnB1c2goe1xuXHRcdFx0XHRwcm92aWRlIDogQVBQX0lOVEVSQ0VQVE9SLFxuXHRcdFx0XHR1c2VDbGFzcyA6IE1uZW1vbmljYVRodW5kZXJzdHJ1Y2tJbnRlcmNlcHRvcixcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLnRyYWNlcikge1xuXHRcdFx0Y29uc3Qgb3RlbCA9IG5ldyBNbmVtb25pY2FPdGVsUHJvdmlkZXIob3B0aW9ucy50cmFjZXIpO1xuXHRcdFx0b3RlbC5hdHRhY2hIb29rcyhjb2xsZWN0aW9uKTtcblx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0cHJvdmlkZSA6IE1uZW1vbmljYU90ZWxQcm92aWRlcixcblx0XHRcdFx0dXNlVmFsdWUgOiBvdGVsLFxuXHRcdFx0fSk7XG5cdFx0XHRpZiAob3B0aW9ucy50cmFjZURpdmVDYWxscykge1xuXHRcdFx0XHRjb25zdCBkaXZlT3RlbCA9IG5ldyBEaXZlT3RlbFByb3ZpZGVyKG9wdGlvbnMudHJhY2VyKTtcblx0XHRcdFx0ZGl2ZU90ZWwuYXR0YWNoKCk7XG5cdFx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0XHRwcm92aWRlIDogRGl2ZU90ZWxQcm92aWRlcixcblx0XHRcdFx0XHR1c2VWYWx1ZSA6IGRpdmVPdGVsLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMudGVsZW1ldHJ5KSB7XG5cdFx0XHR0aGlzLnJlZ2lzdGVyVGVsZW1ldHJ5SG9va3MoY29sbGVjdGlvbik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG1vZHVsZSAgOiBNbmVtb25pY2FNb2R1bGUsXG5cdFx0XHRwcm92aWRlcnMsXG5cdFx0XHRleHBvcnRzIDogW01ORU1PTklDQV9DT0xMRUNUSU9OXSxcblx0XHRcdGdsb2JhbCAgOiB0cnVlLFxuXHRcdH07XG5cdH1cblxuXHRzdGF0aWMgZm9yRmVhdHVyZSAobmFtZTogc3RyaW5nLCBjb25maWc/OiBDb25zdHJ1Y3Rvck9wdGlvbnMpOiBEeW5hbWljTW9kdWxlIHtcblx0XHRjb25zdCBjb2xsZWN0aW9uID0gY3JlYXRlVHlwZXNDb2xsZWN0aW9uKGNvbmZpZyk7XG5cdFx0Y29uc3QgdG9rZW4gPSBnZXRGZWF0dXJlVG9rZW4obmFtZSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bW9kdWxlICA6IE1uZW1vbmljYU1vZHVsZSxcblx0XHRcdHByb3ZpZGVycyA6IFtcblx0XHRcdFx0eyBwcm92aWRlOiB0b2tlbiwgdXNlVmFsdWU6IGNvbGxlY3Rpb24gfSxcblx0XHRcdF0sXG5cdFx0XHRleHBvcnRzIDogW3Rva2VuXSxcblx0XHRcdGdsb2JhbCAgOiBmYWxzZSxcblx0XHR9O1xuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgcmVnaXN0ZXJUZWxlbWV0cnlIb29rcyAoY29sbGVjdGlvbjogVHlwZXNDb2xsZWN0aW9uKTogdm9pZCB7XG5cdFx0Y29sbGVjdGlvbi5yZWdpc3Rlckhvb2soJ3Bvc3RDcmVhdGlvbicsICh7IFR5cGVOYW1lIH0pID0+IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG5cdFx0XHRjb25zb2xlLmxvZygnW21uZW1vbmljYV0gY3JlYXRlZDonLCBUeXBlTmFtZSk7XG5cdFx0fSk7XG5cblx0XHRjb2xsZWN0aW9uLnJlZ2lzdGVySG9vaygnY3JlYXRpb25FcnJvcicsICh7IFR5cGVOYW1lIH0pID0+IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG5cdFx0XHRjb25zb2xlLmVycm9yKCdbbW5lbW9uaWNhXSBlcnJvcjonLCBUeXBlTmFtZSk7XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==
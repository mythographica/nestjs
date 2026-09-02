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
const async_flow_provider_js_1 = require("./providers/async-flow.provider.js");
/**
 * The dive trace's default ring size — re-exported so the tuning knob is
 * discoverable where the module is configured. Matches dive's own internal
 * default: UNBOUNDED since dive's 2026-09-02 flip (retention is GC-driven
 * in weak mode; pass an explicit traceLimit to bound the ring).
 */
exports.DEFAULT_TRACE_LIMIT = Number.MAX_SAFE_INTEGER;
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
        if (options.asyncFlow) {
            const asyncFlow = new async_flow_provider_js_1.AsyncFlowProvider();
            asyncFlow.attach();
            providers.push({
                provide: async_flow_provider_js_1.AsyncFlowProvider,
                useValue: asyncFlow,
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
            exports: options.asyncFlow
                ? [tokens_js_1.MNEMONICA_COLLECTION, async_flow_provider_js_1.AsyncFlowProvider]
                : [tokens_js_1.MNEMONICA_COLLECTION],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tbmVtb25pY2EubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFrQkEsMkNBQXdDO0FBQ3hDLHVDQUErQztBQUUvQyw2Q0FBdUU7QUFFdkUsMENBQWdEO0FBQ2hELDZEQUFzRDtBQVN0RCw0R0FBb0c7QUFDcEcsa0hBRytEO0FBQy9ELDJDQUFxRztBQUNyRyx1RkFBK0U7QUFDL0UsNkVBQXFFO0FBQ3JFLCtFQUF1RTtBQTRDdkU7Ozs7O0dBS0c7QUFDVSxRQUFBLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUdwRCxJQUFNLGVBQWUsdUJBQXJCLE1BQU0sZUFBZTtJQUMzQixNQUFNLENBQUMsT0FBTyxDQUFFLFVBQWtDLEVBQUU7UUFDbkQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxxQkFBWSxDQUFDO1FBRXRELHFFQUFxRTtRQUNyRSxtRUFBbUU7UUFDbkUsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RDLElBQUEsb0JBQWEsRUFBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUVELE1BQU0sU0FBUyxHQUFlO1lBQzdCLEVBQUUsT0FBTyxFQUFFLGdDQUFvQixFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7U0FDdkQsQ0FBQztRQUVGLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsT0FBTyxFQUFHLHNCQUFlO2dCQUN6QixRQUFRLEVBQUcsb0VBQThCO2FBQ3pDLENBQUMsQ0FBQztRQUNKLENBQUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMzQixnRUFBZ0U7WUFDaEUsaUVBQWlFO1lBQ2pFLGlFQUFpRTtZQUNqRSxnRUFBZ0U7WUFDaEUsK0RB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QUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUN6RCxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCxDQUFBO0FBdkdZLDBDQUFlOzBCQUFmLGVBQWU7SUFEM0IsSUFBQSxlQUFNLEVBQUMsRUFBRSxDQUFDO0dBQ0UsZUFBZSxDQXVHM0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5lc3RKUyBtb2R1bGUgZm9yIG1uZW1vbmljYSBpbnRlZ3JhdGlvbi5cbiAqXG4gKiBmb3JSb290KCkgICDigJQgcmVnaXN0ZXJzIHRoZSBnbG9iYWwvZGVmYXVsdCBUeXBlc0NvbGxlY3Rpb25cbiAqIGZvckZlYXR1cmUoKSDigJQgY3JlYXRlcyBhbiBpc29sYXRlZCBUeXBlc0NvbGxlY3Rpb24gcGVyIG1vZHVsZVxuICpcbiAqIFVzYWdlOlxuICogICBATW9kdWxlKHtcbiAqICAgICBpbXBvcnRzOiBbTW5lbW9uaWNhTW9kdWxlLmZvclJvb3QoeyBhdXRvRXh0cmFjdDogdHJ1ZSB9KV0sXG4gKiAgIH0pXG4gKiAgIGNsYXNzIEFwcE1vZHVsZSB7fVxuICpcbiAqICAgQE1vZHVsZSh7XG4gKiAgICAgaW1wb3J0czogW01uZW1vbmljYU1vZHVsZS5mb3JGZWF0dXJlKCdwYXltZW50cycpXSxcbiAqICAgfSlcbiAqICAgY2xhc3MgUGF5bWVudHNNb2R1bGUge31cbiAqL1xuaW1wb3J0IHR5cGUgeyBEeW5hbWljTW9kdWxlLCBQcm92aWRlciB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IE1vZHVsZSB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IEFQUF9JTlRFUkNFUFRPUiB9IGZyb20gJ0BuZXN0anMvY29yZSc7XG5pbXBvcnQgdHlwZSB7IFRyYWNlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSc7XG5pbXBvcnQgeyBkZWZhdWx0VHlwZXMsIGNyZWF0ZVR5cGVzQ29sbGVjdGlvbiB9IGZyb20gJ21uZW1vbmljYS9tb2R1bGUnO1xuaW1wb3J0IHR5cGUgeyBUeXBlc0NvbGxlY3Rpb24gfSBmcm9tICdtbmVtb25pY2EvbW9kdWxlJztcbmltcG9ydCB7IHNldFRyYWNlTGltaXQgfSBmcm9tICdAbW5lbW9uaWNhL2RpdmUnO1xuaW1wb3J0IHsgYXR0YWNoSG9va3MgfSBmcm9tICcuL2hvb2tzL2F0dGFjaC1ob29rcy5qcyc7XG5cbnR5cGUgQ29uc3RydWN0b3JPcHRpb25zID0ge1xuXHRzdHJpY3RDaGFpbj86IGJvb2xlYW47XG5cdGJsb2NrRXJyb3JzPzogYm9vbGVhbjtcblx0c3VibWl0U3RhY2s/OiBib29sZWFuO1xuXHRhd2FpdFJldHVybj86IGJvb2xlYW47XG5cdGFzQ2xhc3M/OiBib29sZWFuO1xufTtcbmltcG9ydCB7IE1uZW1vbmljYVNlcmlhbGl6ZXJJbnRlcmNlcHRvciB9IGZyb20gJy4vaW50ZXJjZXB0b3JzL21uZW1vbmljYS1zZXJpYWxpemVyLmludGVyY2VwdG9yLmpzJztcbmltcG9ydCB7XG5cdE1uZW1vbmljYVRodW5kZXJzdHJ1Y2tJbnRlcmNlcHRvcixcblx0dHlwZSBUaHVuZGVyc3RydWNrT3B0aW9ucyxcbn0gZnJvbSAnLi9pbnRlcmNlcHRvcnMvbW5lbW9uaWNhLXRodW5kZXJzdHJ1Y2suaW50ZXJjZXB0b3IuanMnO1xuaW1wb3J0IHsgTU5FTU9OSUNBX0NPTExFQ1RJT04sIE1ORU1PTklDQV9USFVOREVSU1RSVUNLX09QVElPTlMsIGdldEZlYXR1cmVUb2tlbiB9IGZyb20gJy4vdG9rZW5zLmpzJztcbmltcG9ydCB7IE1uZW1vbmljYU90ZWxQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL21uZW1vbmljYS1vdGVsLnByb3ZpZGVyLmpzJztcbmltcG9ydCB7IERpdmVPdGVsUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9kaXZlLW90ZWwucHJvdmlkZXIuanMnO1xuaW1wb3J0IHsgQXN5bmNGbG93UHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9hc3luYy1mbG93LnByb3ZpZGVyLmpzJztcblxuZXhwb3J0IGludGVyZmFjZSBNbmVtb25pY2FNb2R1bGVPcHRpb25zIHtcblx0LyoqIEV4aXN0aW5nIFR5cGVzQ29sbGVjdGlvbiAoZGVmYXVsdCA9IG1uZW1vbmljYS5kZWZhdWx0VHlwZXMpICovXG5cdGNvbGxlY3Rpb24/OiBUeXBlc0NvbGxlY3Rpb247XG5cdC8qKiBBdXRvLXdpcmUgY29uc29sZSB0ZWxlbWV0cnkgaG9va3MgKi9cblx0dGVsZW1ldHJ5PzogYm9vbGVhbjtcblx0LyoqIEdsb2JhbGx5IHJlZ2lzdGVyIE1uZW1vbmljYVNlcmlhbGl6ZXJJbnRlcmNlcHRvciAqL1xuXHRhdXRvRXh0cmFjdD86IGJvb2xlYW47XG5cdC8qKiBPcGVuVGVsZW1ldHJ5IHRyYWNlciDigJQgaWYgcHJvdmlkZWQsIHJlcGxhY2VzIGNvbnNvbGUgdGVsZW1ldHJ5IHdpdGggT1RlbCBzcGFucyAqL1xuXHR0cmFjZXI/OiBUcmFjZXI7XG5cdC8qKlxuXHQgKiBTcGFuIEVWRVJZIGRpdmUtd3JhcHBlZCBjYWxsIChjYWxsIC8gY29uc3RydWN0IC8gbWV0aG9kIC8gcmVjb250ZXh0KSxcblx0ICogbm90IGp1c3QgY29uc3RydWN0aW9ucy4gUmVxdWlyZXMgYHRyYWNlcmAuIFNwYW5zIGFyZSBwYXJlbnRlZCBvbiBkaXZlJ3Ncblx0ICogb3duIHRyYWNlIHBhcmVudGFnZTsgYXQgdW53cmFwcGVkIGJvdW5kYXJpZXMgdGhleSBuZXN0IHVuZGVyIHRoZSBhY3RpdmVcblx0ICogT1RlbCBzcGFuIChlLmcuIHRoZSBIVFRQIHJlcXVlc3Qgc3BhbiBmcm9tIG10bSkuXG5cdCAqL1xuXHR0cmFjZURpdmVDYWxscz86IGJvb2xlYW47XG5cdC8qKlxuXHQgKiBEaXZlIHJpbmctYnVmZmVyIHNpemUgKGVkZ2VzIGtlcHQgaW4gdGhlIHRyYWNlKS4gQXBwbGllZCBvbmx5IHdoZW5cblx0ICogZXhwbGljaXRseSBwcm92aWRlZCwgc28gYSBkaXJlY3Qgc2V0VHJhY2VMaW1pdCgpIGNhbGwgZnJvbSB1c2VybGFuZCBpc1xuXHQgKiBuZXZlciBvdmVycmlkZGVuLiBEaXZlJ3Mgb3duIGRlZmF1bHQgZXF1YWxzIERFRkFVTFRfVFJBQ0VfTElNSVQuXG5cdCAqL1xuXHR0cmFjZUxpbWl0PzogbnVtYmVyO1xuXHQvKipcblx0ICogVGh1bmRlcnN0cnVjazogYXR0YWNoIGRpdmUgaG9va3MgdG8gdGhlIGNvbGxlY3Rpb24gQU5EIHJlZ2lzdGVyIHRoZVxuXHQgKiBNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IgZ2xvYmFsbHkg4oCUIHJhdyByZXF1ZXN0IHBheWxvYWRzIGFyZVxuXHQgKiBmZWQgaW50byBkaXZlJ3MgcHJlLXJvb3QgY29sbGVjdG9yIGFoZWFkIG9mIGV2ZXJ5IGNvbnN0cnVjdGlvbi5cblx0ICogUGFzcyBhIFRodW5kZXJzdHJ1Y2tPcHRpb25zIG9iamVjdCBmb3IgdGhlIGV4dHJhcywgZS5nLlxuXHQgKiB7IHN0b3JlUmVxdWVzdDogdHJ1ZSB9LlxuXHQgKi9cblx0dGh1bmRlcnN0cnVjaz86IGJvb2xlYW4gfCBUaHVuZGVyc3RydWNrT3B0aW9ucztcblx0LyoqXG5cdCAqIEFzeW5jLWZsb3cgdHJhY2tpbmcgKHJlcG9ydHMvYXN5bmMtZmxvdy10cmFja2luZy1kZXNpZ24ubWQpOiBhbiBBTFNcblx0ICogYmFja2JvbmUgdGhhdCBhdHRyaWJ1dGVzIFVOV1JBUFBFRCBhc3luYyBob3BzICh0aW1lcnMsIHByb21pc2Vcblx0ICogY29udGludWF0aW9ucywgYXN5bmMtZ2VuZXJhdG9yIHN1c3BlbnNpb25zKSB0byB0aGUgcGFyZW50YWwgZGl2ZVxuXHQgKiBlZGdlIGFuZCBwaW5zIGNvbnRleHQgaW5zdGFuY2VzIGZvciBleGFjdGx5IHRoZSByZXF1ZXN0J3MgbGlmZXRpbWUsXG5cdCAqIHNvIGVkZ2UuaW5zdGFuY2UgbmV2ZXIgZGVyZWZzIHRvIHVuZGVmaW5lZCBtaWQtcmVxdWVzdC4gVGhlIEhUVFBcblx0ICogcm9vdCBmcmFtZSBpcyBjcmVhdGVkIGJ5IE1uZW1vbmljYVRyYWNlTWlkZGxld2FyZSB3aGVuIHRoZSBwcm92aWRlclxuXHQgKiBpcyBwcmVzZW50OyBub24tSFRUUCByb290cyB1c2UgQXN5bmNGbG93UHJvdmlkZXIucnVuSW5TY29wZS5cblx0ICovXG5cdGFzeW5jRmxvdz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIGRpdmUgdHJhY2UncyBkZWZhdWx0IHJpbmcgc2l6ZSDigJQgcmUtZXhwb3J0ZWQgc28gdGhlIHR1bmluZyBrbm9iIGlzXG4gKiBkaXNjb3ZlcmFibGUgd2hlcmUgdGhlIG1vZHVsZSBpcyBjb25maWd1cmVkLiBNYXRjaGVzIGRpdmUncyBvd24gaW50ZXJuYWxcbiAqIGRlZmF1bHQ6IFVOQk9VTkRFRCBzaW5jZSBkaXZlJ3MgMjAyNi0wOS0wMiBmbGlwIChyZXRlbnRpb24gaXMgR0MtZHJpdmVuXG4gKiBpbiB3ZWFrIG1vZGU7IHBhc3MgYW4gZXhwbGljaXQgdHJhY2VMaW1pdCB0byBib3VuZCB0aGUgcmluZykuXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RSQUNFX0xJTUlUID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbkBNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgTW5lbW9uaWNhTW9kdWxlIHtcblx0c3RhdGljIGZvclJvb3QgKG9wdGlvbnM6IE1uZW1vbmljYU1vZHVsZU9wdGlvbnMgPSB7fSk6IER5bmFtaWNNb2R1bGUge1xuXHRcdGNvbnN0IGNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb24gPz8gZGVmYXVsdFR5cGVzO1xuXG5cdFx0Ly8gRGl2ZS1nbG9iYWwga25vYjogYXBwbGllZCBvbmx5IHdoZW4gZXhwbGljaXRseSBwcm92aWRlZCDigJQgYSBkaXJlY3Rcblx0XHQvLyBzZXRUcmFjZUxpbWl0KCkgZnJvbSB1c2VybGFuZCBtdXN0IG5ldmVyIGJlIHNpbGVudGx5IG92ZXJyaWRkZW4uXG5cdFx0aWYgKG9wdGlvbnMudHJhY2VMaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRzZXRUcmFjZUxpbWl0KG9wdGlvbnMudHJhY2VMaW1pdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvdmlkZXJzOiBQcm92aWRlcltdID0gW1xuXHRcdFx0eyBwcm92aWRlOiBNTkVNT05JQ0FfQ09MTEVDVElPTiwgdXNlVmFsdWU6IGNvbGxlY3Rpb24gfSxcblx0XHRdO1xuXG5cdFx0aWYgKG9wdGlvbnMuYXV0b0V4dHJhY3QpIHtcblx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0cHJvdmlkZSA6IEFQUF9JTlRFUkNFUFRPUixcblx0XHRcdFx0dXNlQ2xhc3MgOiBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IsXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy50aHVuZGVyc3RydWNrKSB7XG5cdFx0XHQvLyBEaXZlIGhvb2tzIGZpcnN0IChjcmVhdGlvbiBlZGdlcyArIG1ldGhvZCB3cmFwcGluZyksIHRoZW4gdGhlXG5cdFx0XHQvLyBib3VuZGFyeSBpbnRlcmNlcHRvciB0aGF0IHN0YW1wcyBwcmUtcm9vdCBwYXlsb2Fkcy4gVGhlIGNvbmZpZ1xuXHRcdFx0Ly8gcmlkZXMgYSBESSB0b2tlbjogYSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgb2YgYW4gaW50ZXJmYWNlIHR5cGVcblx0XHRcdC8vIHdvdWxkIHN1cmZhY2UgaW4gZGVzaWduOnBhcmFtdHlwZXMgYXMgT2JqZWN0IGFuZCBicmVhayBOZXN0J3Ncblx0XHRcdC8vIGNsYXNzLWJhc2VkIGluc3RhbnRpYXRpb24gd2hlcmUgdGhlIHRva2VuIGlzIG5vdCByZWdpc3RlcmVkLlxuXHRcdFx0YXR0YWNoSG9va3MoY29sbGVjdGlvbik7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBNTkVNT05JQ0FfVEhVTkRFUlNUUlVDS19PUFRJT05TLFxuXHRcdFx0XHR1c2VWYWx1ZSA6IHR5cGVvZiBvcHRpb25zLnRodW5kZXJzdHJ1Y2sgPT09ICdvYmplY3QnXG5cdFx0XHRcdFx0PyBvcHRpb25zLnRodW5kZXJzdHJ1Y2tcblx0XHRcdFx0XHQ6IHt9LFxuXHRcdFx0fSk7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBBUFBfSU5URVJDRVBUT1IsXG5cdFx0XHRcdHVzZUNsYXNzIDogTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuYXN5bmNGbG93KSB7XG5cdFx0XHRjb25zdCBhc3luY0Zsb3cgPSBuZXcgQXN5bmNGbG93UHJvdmlkZXIoKTtcblx0XHRcdGFzeW5jRmxvdy5hdHRhY2goKTtcblx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0cHJvdmlkZSA6IEFzeW5jRmxvd1Byb3ZpZGVyLFxuXHRcdFx0XHR1c2VWYWx1ZSA6IGFzeW5jRmxvdyxcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLnRyYWNlcikge1xuXHRcdFx0Y29uc3Qgb3RlbCA9IG5ldyBNbmVtb25pY2FPdGVsUHJvdmlkZXIob3B0aW9ucy50cmFjZXIpO1xuXHRcdFx0b3RlbC5hdHRhY2hIb29rcyhjb2xsZWN0aW9uKTtcblx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0cHJvdmlkZSA6IE1uZW1vbmljYU90ZWxQcm92aWRlcixcblx0XHRcdFx0dXNlVmFsdWUgOiBvdGVsLFxuXHRcdFx0fSk7XG5cdFx0XHRpZiAob3B0aW9ucy50cmFjZURpdmVDYWxscykge1xuXHRcdFx0XHRjb25zdCBkaXZlT3RlbCA9IG5ldyBEaXZlT3RlbFByb3ZpZGVyKG9wdGlvbnMudHJhY2VyKTtcblx0XHRcdFx0ZGl2ZU90ZWwuYXR0YWNoKCk7XG5cdFx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0XHRwcm92aWRlIDogRGl2ZU90ZWxQcm92aWRlcixcblx0XHRcdFx0XHR1c2VWYWx1ZSA6IGRpdmVPdGVsLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMudGVsZW1ldHJ5KSB7XG5cdFx0XHR0aGlzLnJlZ2lzdGVyVGVsZW1ldHJ5SG9va3MoY29sbGVjdGlvbik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG1vZHVsZSAgOiBNbmVtb25pY2FNb2R1bGUsXG5cdFx0XHRwcm92aWRlcnMsXG5cdFx0XHRleHBvcnRzIDogb3B0aW9ucy5hc3luY0Zsb3dcblx0XHRcdFx0PyBbTU5FTU9OSUNBX0NPTExFQ1RJT04sIEFzeW5jRmxvd1Byb3ZpZGVyXVxuXHRcdFx0XHQ6IFtNTkVNT05JQ0FfQ09MTEVDVElPTl0sXG5cdFx0XHRnbG9iYWwgIDogdHJ1ZSxcblx0XHR9O1xuXHR9XG5cblx0c3RhdGljIGZvckZlYXR1cmUgKG5hbWU6IHN0cmluZywgY29uZmlnPzogQ29uc3RydWN0b3JPcHRpb25zKTogRHluYW1pY01vZHVsZSB7XG5cdFx0Y29uc3QgY29sbGVjdGlvbiA9IGNyZWF0ZVR5cGVzQ29sbGVjdGlvbihjb25maWcpO1xuXHRcdGNvbnN0IHRva2VuID0gZ2V0RmVhdHVyZVRva2VuKG5hbWUpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG1vZHVsZSAgOiBNbmVtb25pY2FNb2R1bGUsXG5cdFx0XHRwcm92aWRlcnMgOiBbXG5cdFx0XHRcdHsgcHJvdmlkZTogdG9rZW4sIHVzZVZhbHVlOiBjb2xsZWN0aW9uIH0sXG5cdFx0XHRdLFxuXHRcdFx0ZXhwb3J0cyA6IFt0b2tlbl0sXG5cdFx0XHRnbG9iYWwgIDogZmFsc2UsXG5cdFx0fTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIHJlZ2lzdGVyVGVsZW1ldHJ5SG9va3MgKGNvbGxlY3Rpb246IFR5cGVzQ29sbGVjdGlvbik6IHZvaWQge1xuXHRcdGNvbGxlY3Rpb24ucmVnaXN0ZXJIb29rKCdwb3N0Q3JlYXRpb24nLCAoeyBUeXBlTmFtZSB9KSA9PiB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuXHRcdFx0Y29uc29sZS5sb2coJ1ttbmVtb25pY2FdIGNyZWF0ZWQ6JywgVHlwZU5hbWUpO1xuXHRcdH0pO1xuXG5cdFx0Y29sbGVjdGlvbi5yZWdpc3Rlckhvb2soJ2NyZWF0aW9uRXJyb3InLCAoeyBUeXBlTmFtZSB9KSA9PiB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuXHRcdFx0Y29uc29sZS5lcnJvcignW21uZW1vbmljYV0gZXJyb3I6JywgVHlwZU5hbWUpO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=
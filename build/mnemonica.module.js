var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MnemonicaModule_1;
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { defaultTypes, createTypesCollection } from 'mnemonica/module';
import { setTraceLimit } from '@mnemonica/dive';
import { attachHooks } from './hooks/attach-hooks.js';
import { MnemonicaSerializerInterceptor } from './interceptors/mnemonica-serializer.interceptor.js';
import { MnemonicaThunderstruckInterceptor, } from './interceptors/mnemonica-thunderstruck.interceptor.js';
import { MNEMONICA_COLLECTION, MNEMONICA_THUNDERSTRUCK_OPTIONS, getFeatureToken } from './tokens.js';
import { MnemonicaOtelProvider } from './providers/mnemonica-otel.provider.js';
import { DiveOtelProvider } from './providers/dive-otel.provider.js';
import { AsyncFlowProvider } from './providers/async-flow.provider.js';
/**
 * The dive trace's default ring size — re-exported so the tuning knob is
 * discoverable where the module is configured. Matches dive's own internal
 * default: UNBOUNDED since dive's 2026-09-02 flip (retention is GC-driven
 * in weak mode; pass an explicit traceLimit to bound the ring).
 */
export const DEFAULT_TRACE_LIMIT = Number.MAX_SAFE_INTEGER;
let MnemonicaModule = MnemonicaModule_1 = class MnemonicaModule {
    static forRoot(options = {}) {
        const collection = options.collection ?? defaultTypes;
        // Dive-global knob: applied only when explicitly provided — a direct
        // setTraceLimit() from userland must never be silently overridden.
        if (options.traceLimit !== undefined) {
            setTraceLimit(options.traceLimit);
        }
        const providers = [
            { provide: MNEMONICA_COLLECTION, useValue: collection },
        ];
        if (options.autoExtract) {
            providers.push({
                provide: APP_INTERCEPTOR,
                useClass: MnemonicaSerializerInterceptor,
            });
        }
        if (options.thunderstruck) {
            // Dive hooks first (creation edges + method wrapping), then the
            // boundary interceptor that stamps pre-root payloads. The config
            // rides a DI token: a constructor parameter of an interface type
            // would surface in design:paramtypes as Object and break Nest's
            // class-based instantiation where the token is not registered.
            attachHooks(collection);
            providers.push({
                provide: MNEMONICA_THUNDERSTRUCK_OPTIONS,
                useValue: typeof options.thunderstruck === 'object'
                    ? options.thunderstruck
                    : {},
            });
            providers.push({
                provide: APP_INTERCEPTOR,
                useClass: MnemonicaThunderstruckInterceptor,
            });
        }
        if (options.asyncFlow) {
            const asyncFlow = new AsyncFlowProvider();
            asyncFlow.attach();
            providers.push({
                provide: AsyncFlowProvider,
                useValue: asyncFlow,
            });
        }
        if (options.tracer) {
            const otel = new MnemonicaOtelProvider(options.tracer);
            otel.attachHooks(collection);
            providers.push({
                provide: MnemonicaOtelProvider,
                useValue: otel,
            });
            if (options.traceDiveCalls) {
                const diveOtel = new DiveOtelProvider(options.tracer);
                diveOtel.attach();
                providers.push({
                    provide: DiveOtelProvider,
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
                ? [MNEMONICA_COLLECTION, AsyncFlowProvider]
                : [MNEMONICA_COLLECTION],
            global: true,
        };
    }
    static forFeature(name, config) {
        const collection = createTypesCollection(config);
        const token = getFeatureToken(name);
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
MnemonicaModule = MnemonicaModule_1 = __decorate([
    Module({})
], MnemonicaModule);
export { MnemonicaModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tbmVtb25pY2EubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFrQkEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFTdEQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDcEcsT0FBTyxFQUNOLGlDQUFpQyxHQUVqQyxNQUFNLHVEQUF1RCxDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSwrQkFBK0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUE0Q3ZFOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBR3BELElBQU0sZUFBZSx1QkFBckIsTUFBTSxlQUFlO0lBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUUsVUFBa0MsRUFBRTtRQUNuRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFlBQVksQ0FBQztRQUV0RCxxRUFBcUU7UUFDckUsbUVBQW1FO1FBQ25FLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVB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QUFHO2dCQUNYLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO2FBQ3hDO1lBQ0QsT0FBTyxFQUFHLENBQUMsS0FBSyxDQUFDO1lBQ2pCLE1BQU0sRUFBSSxLQUFLO1NBQ2YsQ0FBQztJQUNILENBQUM7SUFFTyxNQUFNLENBQUMsc0JBQXNCLENBQUUsVUFBMkI7UUFDakUsVUFBVSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDeEQsc0NBQXNDO1lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUN6RCxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCxDQUFBO0FBdkdZLGVBQWU7SUFEM0IsTUFBTSxDQUFDLEVBQUUsQ0FBQztHQUNFLGVBQWUsQ0F1RzNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBOZXN0SlMgbW9kdWxlIGZvciBtbmVtb25pY2EgaW50ZWdyYXRpb24uXG4gKlxuICogZm9yUm9vdCgpICAg4oCUIHJlZ2lzdGVycyB0aGUgZ2xvYmFsL2RlZmF1bHQgVHlwZXNDb2xsZWN0aW9uXG4gKiBmb3JGZWF0dXJlKCkg4oCUIGNyZWF0ZXMgYW4gaXNvbGF0ZWQgVHlwZXNDb2xsZWN0aW9uIHBlciBtb2R1bGVcbiAqXG4gKiBVc2FnZTpcbiAqICAgQE1vZHVsZSh7XG4gKiAgICAgaW1wb3J0czogW01uZW1vbmljYU1vZHVsZS5mb3JSb290KHsgYXV0b0V4dHJhY3Q6IHRydWUgfSldLFxuICogICB9KVxuICogICBjbGFzcyBBcHBNb2R1bGUge31cbiAqXG4gKiAgIEBNb2R1bGUoe1xuICogICAgIGltcG9ydHM6IFtNbmVtb25pY2FNb2R1bGUuZm9yRmVhdHVyZSgncGF5bWVudHMnKV0sXG4gKiAgIH0pXG4gKiAgIGNsYXNzIFBheW1lbnRzTW9kdWxlIHt9XG4gKi9cbmltcG9ydCB0eXBlIHsgRHluYW1pY01vZHVsZSwgUHJvdmlkZXIgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBNb2R1bGUgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBBUFBfSU5URVJDRVBUT1IgfSBmcm9tICdAbmVzdGpzL2NvcmUnO1xuaW1wb3J0IHR5cGUgeyBUcmFjZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHsgZGVmYXVsdFR5cGVzLCBjcmVhdGVUeXBlc0NvbGxlY3Rpb24gfSBmcm9tICdtbmVtb25pY2EvbW9kdWxlJztcbmltcG9ydCB0eXBlIHsgVHlwZXNDb2xsZWN0aW9uIH0gZnJvbSAnbW5lbW9uaWNhL21vZHVsZSc7XG5pbXBvcnQgeyBzZXRUcmFjZUxpbWl0IH0gZnJvbSAnQG1uZW1vbmljYS9kaXZlJztcbmltcG9ydCB7IGF0dGFjaEhvb2tzIH0gZnJvbSAnLi9ob29rcy9hdHRhY2gtaG9va3MuanMnO1xuXG50eXBlIENvbnN0cnVjdG9yT3B0aW9ucyA9IHtcblx0c3RyaWN0Q2hhaW4/OiBib29sZWFuO1xuXHRibG9ja0Vycm9ycz86IGJvb2xlYW47XG5cdHN1Ym1pdFN0YWNrPzogYm9vbGVhbjtcblx0YXdhaXRSZXR1cm4/OiBib29sZWFuO1xuXHRhc0NsYXNzPzogYm9vbGVhbjtcbn07XG5pbXBvcnQgeyBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9ycy9tbmVtb25pY2Etc2VyaWFsaXplci5pbnRlcmNlcHRvci5qcyc7XG5pbXBvcnQge1xuXHRNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IsXG5cdHR5cGUgVGh1bmRlcnN0cnVja09wdGlvbnMsXG59IGZyb20gJy4vaW50ZXJjZXB0b3JzL21uZW1vbmljYS10aHVuZGVyc3RydWNrLmludGVyY2VwdG9yLmpzJztcbmltcG9ydCB7IE1ORU1PTklDQV9DT0xMRUNUSU9OLCBNTkVNT05JQ0FfVEhVTkRFUlNUUlVDS19PUFRJT05TLCBnZXRGZWF0dXJlVG9rZW4gfSBmcm9tICcuL3Rva2Vucy5qcyc7XG5pbXBvcnQgeyBNbmVtb25pY2FPdGVsUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9tbmVtb25pY2Etb3RlbC5wcm92aWRlci5qcyc7XG5pbXBvcnQgeyBEaXZlT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZGl2ZS1vdGVsLnByb3ZpZGVyLmpzJztcbmltcG9ydCB7IEFzeW5jRmxvd1Byb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvYXN5bmMtZmxvdy5wcm92aWRlci5qcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW5lbW9uaWNhTW9kdWxlT3B0aW9ucyB7XG5cdC8qKiBFeGlzdGluZyBUeXBlc0NvbGxlY3Rpb24gKGRlZmF1bHQgPSBtbmVtb25pY2EuZGVmYXVsdFR5cGVzKSAqL1xuXHRjb2xsZWN0aW9uPzogVHlwZXNDb2xsZWN0aW9uO1xuXHQvKiogQXV0by13aXJlIGNvbnNvbGUgdGVsZW1ldHJ5IGhvb2tzICovXG5cdHRlbGVtZXRyeT86IGJvb2xlYW47XG5cdC8qKiBHbG9iYWxseSByZWdpc3RlciBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IgKi9cblx0YXV0b0V4dHJhY3Q/OiBib29sZWFuO1xuXHQvKiogT3BlblRlbGVtZXRyeSB0cmFjZXIg4oCUIGlmIHByb3ZpZGVkLCByZXBsYWNlcyBjb25zb2xlIHRlbGVtZXRyeSB3aXRoIE9UZWwgc3BhbnMgKi9cblx0dHJhY2VyPzogVHJhY2VyO1xuXHQvKipcblx0ICogU3BhbiBFVkVSWSBkaXZlLXdyYXBwZWQgY2FsbCAoY2FsbCAvIGNvbnN0cnVjdCAvIG1ldGhvZCAvIHJlY29udGV4dCksXG5cdCAqIG5vdCBqdXN0IGNvbnN0cnVjdGlvbnMuIFJlcXVpcmVzIGB0cmFjZXJgLiBTcGFucyBhcmUgcGFyZW50ZWQgb24gZGl2ZSdzXG5cdCAqIG93biB0cmFjZSBwYXJlbnRhZ2U7IGF0IHVud3JhcHBlZCBib3VuZGFyaWVzIHRoZXkgbmVzdCB1bmRlciB0aGUgYWN0aXZlXG5cdCAqIE9UZWwgc3BhbiAoZS5nLiB0aGUgSFRUUCByZXF1ZXN0IHNwYW4gZnJvbSBtdG0pLlxuXHQgKi9cblx0dHJhY2VEaXZlQ2FsbHM/OiBib29sZWFuO1xuXHQvKipcblx0ICogRGl2ZSByaW5nLWJ1ZmZlciBzaXplIChlZGdlcyBrZXB0IGluIHRoZSB0cmFjZSkuIEFwcGxpZWQgb25seSB3aGVuXG5cdCAqIGV4cGxpY2l0bHkgcHJvdmlkZWQsIHNvIGEgZGlyZWN0IHNldFRyYWNlTGltaXQoKSBjYWxsIGZyb20gdXNlcmxhbmQgaXNcblx0ICogbmV2ZXIgb3ZlcnJpZGRlbi4gRGl2ZSdzIG93biBkZWZhdWx0IGVxdWFscyBERUZBVUxUX1RSQUNFX0xJTUlULlxuXHQgKi9cblx0dHJhY2VMaW1pdD86IG51bWJlcjtcblx0LyoqXG5cdCAqIFRodW5kZXJzdHJ1Y2s6IGF0dGFjaCBkaXZlIGhvb2tzIHRvIHRoZSBjb2xsZWN0aW9uIEFORCByZWdpc3RlciB0aGVcblx0ICogTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yIGdsb2JhbGx5IOKAlCByYXcgcmVxdWVzdCBwYXlsb2FkcyBhcmVcblx0ICogZmVkIGludG8gZGl2ZSdzIHByZS1yb290IGNvbGxlY3RvciBhaGVhZCBvZiBldmVyeSBjb25zdHJ1Y3Rpb24uXG5cdCAqIFBhc3MgYSBUaHVuZGVyc3RydWNrT3B0aW9ucyBvYmplY3QgZm9yIHRoZSBleHRyYXMsIGUuZy5cblx0ICogeyBzdG9yZVJlcXVlc3Q6IHRydWUgfS5cblx0ICovXG5cdHRodW5kZXJzdHJ1Y2s/OiBib29sZWFuIHwgVGh1bmRlcnN0cnVja09wdGlvbnM7XG5cdC8qKlxuXHQgKiBBc3luYy1mbG93IHRyYWNraW5nIChyZXBvcnRzL2FzeW5jLWZsb3ctdHJhY2tpbmctZGVzaWduLm1kKTogYW4gQUxTXG5cdCAqIGJhY2tib25lIHRoYXQgYXR0cmlidXRlcyBVTldSQVBQRUQgYXN5bmMgaG9wcyAodGltZXJzLCBwcm9taXNlXG5cdCAqIGNvbnRpbnVhdGlvbnMsIGFzeW5jLWdlbmVyYXRvciBzdXNwZW5zaW9ucykgdG8gdGhlIHBhcmVudGFsIGRpdmVcblx0ICogZWRnZSBhbmQgcGlucyBjb250ZXh0IGluc3RhbmNlcyBmb3IgZXhhY3RseSB0aGUgcmVxdWVzdCdzIGxpZmV0aW1lLFxuXHQgKiBzbyBlZGdlLmluc3RhbmNlIG5ldmVyIGRlcmVmcyB0byB1bmRlZmluZWQgbWlkLXJlcXVlc3QuIFRoZSBIVFRQXG5cdCAqIHJvb3QgZnJhbWUgaXMgY3JlYXRlZCBieSBNbmVtb25pY2FUcmFjZU1pZGRsZXdhcmUgd2hlbiB0aGUgcHJvdmlkZXJcblx0ICogaXMgcHJlc2VudDsgbm9uLUhUVFAgcm9vdHMgdXNlIEFzeW5jRmxvd1Byb3ZpZGVyLnJ1bkluU2NvcGUuXG5cdCAqL1xuXHRhc3luY0Zsb3c/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRoZSBkaXZlIHRyYWNlJ3MgZGVmYXVsdCByaW5nIHNpemUg4oCUIHJlLWV4cG9ydGVkIHNvIHRoZSB0dW5pbmcga25vYiBpc1xuICogZGlzY292ZXJhYmxlIHdoZXJlIHRoZSBtb2R1bGUgaXMgY29uZmlndXJlZC4gTWF0Y2hlcyBkaXZlJ3Mgb3duIGludGVybmFsXG4gKiBkZWZhdWx0OiBVTkJPVU5ERUQgc2luY2UgZGl2ZSdzIDIwMjYtMDktMDIgZmxpcCAocmV0ZW50aW9uIGlzIEdDLWRyaXZlblxuICogaW4gd2VhayBtb2RlOyBwYXNzIGFuIGV4cGxpY2l0IHRyYWNlTGltaXQgdG8gYm91bmQgdGhlIHJpbmcpLlxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9UUkFDRV9MSU1JVCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG5ATW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIE1uZW1vbmljYU1vZHVsZSB7XG5cdHN0YXRpYyBmb3JSb290IChvcHRpb25zOiBNbmVtb25pY2FNb2R1bGVPcHRpb25zID0ge30pOiBEeW5hbWljTW9kdWxlIHtcblx0XHRjb25zdCBjb2xsZWN0aW9uID0gb3B0aW9ucy5jb2xsZWN0aW9uID8/IGRlZmF1bHRUeXBlcztcblxuXHRcdC8vIERpdmUtZ2xvYmFsIGtub2I6IGFwcGxpZWQgb25seSB3aGVuIGV4cGxpY2l0bHkgcHJvdmlkZWQg4oCUIGEgZGlyZWN0XG5cdFx0Ly8gc2V0VHJhY2VMaW1pdCgpIGZyb20gdXNlcmxhbmQgbXVzdCBuZXZlciBiZSBzaWxlbnRseSBvdmVycmlkZGVuLlxuXHRcdGlmIChvcHRpb25zLnRyYWNlTGltaXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0c2V0VHJhY2VMaW1pdChvcHRpb25zLnRyYWNlTGltaXQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByb3ZpZGVyczogUHJvdmlkZXJbXSA9IFtcblx0XHRcdHsgcHJvdmlkZTogTU5FTU9OSUNBX0NPTExFQ1RJT04sIHVzZVZhbHVlOiBjb2xsZWN0aW9uIH0sXG5cdFx0XTtcblxuXHRcdGlmIChvcHRpb25zLmF1dG9FeHRyYWN0KSB7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBBUFBfSU5URVJDRVBUT1IsXG5cdFx0XHRcdHVzZUNsYXNzIDogTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMudGh1bmRlcnN0cnVjaykge1xuXHRcdFx0Ly8gRGl2ZSBob29rcyBmaXJzdCAoY3JlYXRpb24gZWRnZXMgKyBtZXRob2Qgd3JhcHBpbmcpLCB0aGVuIHRoZVxuXHRcdFx0Ly8gYm91bmRhcnkgaW50ZXJjZXB0b3IgdGhhdCBzdGFtcHMgcHJlLXJvb3QgcGF5bG9hZHMuIFRoZSBjb25maWdcblx0XHRcdC8vIHJpZGVzIGEgREkgdG9rZW46IGEgY29uc3RydWN0b3IgcGFyYW1ldGVyIG9mIGFuIGludGVyZmFjZSB0eXBlXG5cdFx0XHQvLyB3b3VsZCBzdXJmYWNlIGluIGRlc2lnbjpwYXJhbXR5cGVzIGFzIE9iamVjdCBhbmQgYnJlYWsgTmVzdCdzXG5cdFx0XHQvLyBjbGFzcy1iYXNlZCBpbnN0YW50aWF0aW9uIHdoZXJlIHRoZSB0b2tlbiBpcyBub3QgcmVnaXN0ZXJlZC5cblx0XHRcdGF0dGFjaEhvb2tzKGNvbGxlY3Rpb24pO1xuXHRcdFx0cHJvdmlkZXJzLnB1c2goe1xuXHRcdFx0XHRwcm92aWRlIDogTU5FTU9OSUNBX1RIVU5ERVJTVFJVQ0tfT1BUSU9OUyxcblx0XHRcdFx0dXNlVmFsdWUgOiB0eXBlb2Ygb3B0aW9ucy50aHVuZGVyc3RydWNrID09PSAnb2JqZWN0J1xuXHRcdFx0XHRcdD8gb3B0aW9ucy50aHVuZGVyc3RydWNrXG5cdFx0XHRcdFx0OiB7fSxcblx0XHRcdH0pO1xuXHRcdFx0cHJvdmlkZXJzLnB1c2goe1xuXHRcdFx0XHRwcm92aWRlIDogQVBQX0lOVEVSQ0VQVE9SLFxuXHRcdFx0XHR1c2VDbGFzcyA6IE1uZW1vbmljYVRodW5kZXJzdHJ1Y2tJbnRlcmNlcHRvcixcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLmFzeW5jRmxvdykge1xuXHRcdFx0Y29uc3QgYXN5bmNGbG93ID0gbmV3IEFzeW5jRmxvd1Byb3ZpZGVyKCk7XG5cdFx0XHRhc3luY0Zsb3cuYXR0YWNoKCk7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBBc3luY0Zsb3dQcm92aWRlcixcblx0XHRcdFx0dXNlVmFsdWUgOiBhc3luY0Zsb3csXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy50cmFjZXIpIHtcblx0XHRcdGNvbnN0IG90ZWwgPSBuZXcgTW5lbW9uaWNhT3RlbFByb3ZpZGVyKG9wdGlvbnMudHJhY2VyKTtcblx0XHRcdG90ZWwuYXR0YWNoSG9va3MoY29sbGVjdGlvbik7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBNbmVtb25pY2FPdGVsUHJvdmlkZXIsXG5cdFx0XHRcdHVzZVZhbHVlIDogb3RlbCxcblx0XHRcdH0pO1xuXHRcdFx0aWYgKG9wdGlvbnMudHJhY2VEaXZlQ2FsbHMpIHtcblx0XHRcdFx0Y29uc3QgZGl2ZU90ZWwgPSBuZXcgRGl2ZU90ZWxQcm92aWRlcihvcHRpb25zLnRyYWNlcik7XG5cdFx0XHRcdGRpdmVPdGVsLmF0dGFjaCgpO1xuXHRcdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdFx0cHJvdmlkZSA6IERpdmVPdGVsUHJvdmlkZXIsXG5cdFx0XHRcdFx0dXNlVmFsdWUgOiBkaXZlT3RlbCxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChvcHRpb25zLnRlbGVtZXRyeSkge1xuXHRcdFx0dGhpcy5yZWdpc3RlclRlbGVtZXRyeUhvb2tzKGNvbGxlY3Rpb24pO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRtb2R1bGUgIDogTW5lbW9uaWNhTW9kdWxlLFxuXHRcdFx0cHJvdmlkZXJzLFxuXHRcdFx0ZXhwb3J0cyA6IG9wdGlvbnMuYXN5bmNGbG93XG5cdFx0XHRcdD8gW01ORU1PTklDQV9DT0xMRUNUSU9OLCBBc3luY0Zsb3dQcm92aWRlcl1cblx0XHRcdFx0OiBbTU5FTU9OSUNBX0NPTExFQ1RJT05dLFxuXHRcdFx0Z2xvYmFsICA6IHRydWUsXG5cdFx0fTtcblx0fVxuXG5cdHN0YXRpYyBmb3JGZWF0dXJlIChuYW1lOiBzdHJpbmcsIGNvbmZpZz86IENvbnN0cnVjdG9yT3B0aW9ucyk6IER5bmFtaWNNb2R1bGUge1xuXHRcdGNvbnN0IGNvbGxlY3Rpb24gPSBjcmVhdGVUeXBlc0NvbGxlY3Rpb24oY29uZmlnKTtcblx0XHRjb25zdCB0b2tlbiA9IGdldEZlYXR1cmVUb2tlbihuYW1lKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRtb2R1bGUgIDogTW5lbW9uaWNhTW9kdWxlLFxuXHRcdFx0cHJvdmlkZXJzIDogW1xuXHRcdFx0XHR7IHByb3ZpZGU6IHRva2VuLCB1c2VWYWx1ZTogY29sbGVjdGlvbiB9LFxuXHRcdFx0XSxcblx0XHRcdGV4cG9ydHMgOiBbdG9rZW5dLFxuXHRcdFx0Z2xvYmFsICA6IGZhbHNlLFxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyByZWdpc3RlclRlbGVtZXRyeUhvb2tzIChjb2xsZWN0aW9uOiBUeXBlc0NvbGxlY3Rpb24pOiB2b2lkIHtcblx0XHRjb2xsZWN0aW9uLnJlZ2lzdGVySG9vaygncG9zdENyZWF0aW9uJywgKHsgVHlwZU5hbWUgfSkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdGNvbnNvbGUubG9nKCdbbW5lbW9uaWNhXSBjcmVhdGVkOicsIFR5cGVOYW1lKTtcblx0XHR9KTtcblxuXHRcdGNvbGxlY3Rpb24ucmVnaXN0ZXJIb29rKCdjcmVhdGlvbkVycm9yJywgKHsgVHlwZU5hbWUgfSkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1ttbmVtb25pY2FdIGVycm9yOicsIFR5cGVOYW1lKTtcblx0XHR9KTtcblx0fVxufVxuIl19
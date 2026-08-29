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
/**
 * The dive trace's default ring-buffer size — re-exported so the tuning
 * knob is discoverable where the module is configured. Matches dive's own
 * internal default; the buffer size IS dive's memory bound.
 */
export const DEFAULT_TRACE_LIMIT = 1024;
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
            exports: [MNEMONICA_COLLECTION],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tbmVtb25pY2EubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFrQkEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFTdEQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDcEcsT0FBTyxFQUNOLGlDQUFpQyxHQUVqQyxNQUFNLHVEQUF1RCxDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSwrQkFBK0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFrQ3JFOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFHakMsSUFBTSxlQUFlLHVCQUFyQixNQUFNLGVBQWU7SUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBRSxVQUFrQyxFQUFFO1FBQ25ELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksWUFBWSxDQUFDO1FBRXRELHFFQUFxRTtRQUNyRSxtRUFBbUU7UUFDbkUsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsQ0FB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LGVBQWUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUN6RCxzQ0FBc0M7WUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCxDQUFBO0FBNUZZLGVBQWU7SUFEM0IsTUFBTSxDQUFDLEVBQUUsQ0FBQztHQUNFLGVBQWUsQ0E0RjNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBOZXN0SlMgbW9kdWxlIGZvciBtbmVtb25pY2EgaW50ZWdyYXRpb24uXG4gKlxuICogZm9yUm9vdCgpICAg4oCUIHJlZ2lzdGVycyB0aGUgZ2xvYmFsL2RlZmF1bHQgVHlwZXNDb2xsZWN0aW9uXG4gKiBmb3JGZWF0dXJlKCkg4oCUIGNyZWF0ZXMgYW4gaXNvbGF0ZWQgVHlwZXNDb2xsZWN0aW9uIHBlciBtb2R1bGVcbiAqXG4gKiBVc2FnZTpcbiAqICAgQE1vZHVsZSh7XG4gKiAgICAgaW1wb3J0czogW01uZW1vbmljYU1vZHVsZS5mb3JSb290KHsgYXV0b0V4dHJhY3Q6IHRydWUgfSldLFxuICogICB9KVxuICogICBjbGFzcyBBcHBNb2R1bGUge31cbiAqXG4gKiAgIEBNb2R1bGUoe1xuICogICAgIGltcG9ydHM6IFtNbmVtb25pY2FNb2R1bGUuZm9yRmVhdHVyZSgncGF5bWVudHMnKV0sXG4gKiAgIH0pXG4gKiAgIGNsYXNzIFBheW1lbnRzTW9kdWxlIHt9XG4gKi9cbmltcG9ydCB0eXBlIHsgRHluYW1pY01vZHVsZSwgUHJvdmlkZXIgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBNb2R1bGUgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBBUFBfSU5URVJDRVBUT1IgfSBmcm9tICdAbmVzdGpzL2NvcmUnO1xuaW1wb3J0IHR5cGUgeyBUcmFjZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHsgZGVmYXVsdFR5cGVzLCBjcmVhdGVUeXBlc0NvbGxlY3Rpb24gfSBmcm9tICdtbmVtb25pY2EvbW9kdWxlJztcbmltcG9ydCB0eXBlIHsgVHlwZXNDb2xsZWN0aW9uIH0gZnJvbSAnbW5lbW9uaWNhL21vZHVsZSc7XG5pbXBvcnQgeyBzZXRUcmFjZUxpbWl0IH0gZnJvbSAnQG1uZW1vbmljYS9kaXZlJztcbmltcG9ydCB7IGF0dGFjaEhvb2tzIH0gZnJvbSAnLi9ob29rcy9hdHRhY2gtaG9va3MuanMnO1xuXG50eXBlIENvbnN0cnVjdG9yT3B0aW9ucyA9IHtcblx0c3RyaWN0Q2hhaW4/OiBib29sZWFuO1xuXHRibG9ja0Vycm9ycz86IGJvb2xlYW47XG5cdHN1Ym1pdFN0YWNrPzogYm9vbGVhbjtcblx0YXdhaXRSZXR1cm4/OiBib29sZWFuO1xuXHRhc0NsYXNzPzogYm9vbGVhbjtcbn07XG5pbXBvcnQgeyBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9ycy9tbmVtb25pY2Etc2VyaWFsaXplci5pbnRlcmNlcHRvci5qcyc7XG5pbXBvcnQge1xuXHRNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IsXG5cdHR5cGUgVGh1bmRlcnN0cnVja09wdGlvbnMsXG59IGZyb20gJy4vaW50ZXJjZXB0b3JzL21uZW1vbmljYS10aHVuZGVyc3RydWNrLmludGVyY2VwdG9yLmpzJztcbmltcG9ydCB7IE1ORU1PTklDQV9DT0xMRUNUSU9OLCBNTkVNT05JQ0FfVEhVTkRFUlNUUlVDS19PUFRJT05TLCBnZXRGZWF0dXJlVG9rZW4gfSBmcm9tICcuL3Rva2Vucy5qcyc7XG5pbXBvcnQgeyBNbmVtb25pY2FPdGVsUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9tbmVtb25pY2Etb3RlbC5wcm92aWRlci5qcyc7XG5pbXBvcnQgeyBEaXZlT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZGl2ZS1vdGVsLnByb3ZpZGVyLmpzJztcblxuZXhwb3J0IGludGVyZmFjZSBNbmVtb25pY2FNb2R1bGVPcHRpb25zIHtcblx0LyoqIEV4aXN0aW5nIFR5cGVzQ29sbGVjdGlvbiAoZGVmYXVsdCA9IG1uZW1vbmljYS5kZWZhdWx0VHlwZXMpICovXG5cdGNvbGxlY3Rpb24/OiBUeXBlc0NvbGxlY3Rpb247XG5cdC8qKiBBdXRvLXdpcmUgY29uc29sZSB0ZWxlbWV0cnkgaG9va3MgKi9cblx0dGVsZW1ldHJ5PzogYm9vbGVhbjtcblx0LyoqIEdsb2JhbGx5IHJlZ2lzdGVyIE1uZW1vbmljYVNlcmlhbGl6ZXJJbnRlcmNlcHRvciAqL1xuXHRhdXRvRXh0cmFjdD86IGJvb2xlYW47XG5cdC8qKiBPcGVuVGVsZW1ldHJ5IHRyYWNlciDigJQgaWYgcHJvdmlkZWQsIHJlcGxhY2VzIGNvbnNvbGUgdGVsZW1ldHJ5IHdpdGggT1RlbCBzcGFucyAqL1xuXHR0cmFjZXI/OiBUcmFjZXI7XG5cdC8qKlxuXHQgKiBTcGFuIEVWRVJZIGRpdmUtd3JhcHBlZCBjYWxsIChjYWxsIC8gY29uc3RydWN0IC8gbWV0aG9kIC8gcmVjb250ZXh0KSxcblx0ICogbm90IGp1c3QgY29uc3RydWN0aW9ucy4gUmVxdWlyZXMgYHRyYWNlcmAuIFNwYW5zIGFyZSBwYXJlbnRlZCBvbiBkaXZlJ3Ncblx0ICogb3duIHRyYWNlIHBhcmVudGFnZTsgYXQgdW53cmFwcGVkIGJvdW5kYXJpZXMgdGhleSBuZXN0IHVuZGVyIHRoZSBhY3RpdmVcblx0ICogT1RlbCBzcGFuIChlLmcuIHRoZSBIVFRQIHJlcXVlc3Qgc3BhbiBmcm9tIG10bSkuXG5cdCAqL1xuXHR0cmFjZURpdmVDYWxscz86IGJvb2xlYW47XG5cdC8qKlxuXHQgKiBEaXZlIHJpbmctYnVmZmVyIHNpemUgKGVkZ2VzIGtlcHQgaW4gdGhlIHRyYWNlKS4gQXBwbGllZCBvbmx5IHdoZW5cblx0ICogZXhwbGljaXRseSBwcm92aWRlZCwgc28gYSBkaXJlY3Qgc2V0VHJhY2VMaW1pdCgpIGNhbGwgZnJvbSB1c2VybGFuZCBpc1xuXHQgKiBuZXZlciBvdmVycmlkZGVuLiBEaXZlJ3Mgb3duIGRlZmF1bHQgZXF1YWxzIERFRkFVTFRfVFJBQ0VfTElNSVQuXG5cdCAqL1xuXHR0cmFjZUxpbWl0PzogbnVtYmVyO1xuXHQvKipcblx0ICogVGh1bmRlcnN0cnVjazogYXR0YWNoIGRpdmUgaG9va3MgdG8gdGhlIGNvbGxlY3Rpb24gQU5EIHJlZ2lzdGVyIHRoZVxuXHQgKiBNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IgZ2xvYmFsbHkg4oCUIHJhdyByZXF1ZXN0IHBheWxvYWRzIGFyZVxuXHQgKiBmZWQgaW50byBkaXZlJ3MgcHJlLXJvb3QgY29sbGVjdG9yIGFoZWFkIG9mIGV2ZXJ5IGNvbnN0cnVjdGlvbi5cblx0ICogUGFzcyBhIFRodW5kZXJzdHJ1Y2tPcHRpb25zIG9iamVjdCBmb3IgdGhlIGV4dHJhcywgZS5nLlxuXHQgKiB7IHN0b3JlUmVxdWVzdDogdHJ1ZSB9LlxuXHQgKi9cblx0dGh1bmRlcnN0cnVjaz86IGJvb2xlYW4gfCBUaHVuZGVyc3RydWNrT3B0aW9ucztcbn1cblxuLyoqXG4gKiBUaGUgZGl2ZSB0cmFjZSdzIGRlZmF1bHQgcmluZy1idWZmZXIgc2l6ZSDigJQgcmUtZXhwb3J0ZWQgc28gdGhlIHR1bmluZ1xuICoga25vYiBpcyBkaXNjb3ZlcmFibGUgd2hlcmUgdGhlIG1vZHVsZSBpcyBjb25maWd1cmVkLiBNYXRjaGVzIGRpdmUncyBvd25cbiAqIGludGVybmFsIGRlZmF1bHQ7IHRoZSBidWZmZXIgc2l6ZSBJUyBkaXZlJ3MgbWVtb3J5IGJvdW5kLlxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9UUkFDRV9MSU1JVCA9IDEwMjQ7XG5cbkBNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgTW5lbW9uaWNhTW9kdWxlIHtcblx0c3RhdGljIGZvclJvb3QgKG9wdGlvbnM6IE1uZW1vbmljYU1vZHVsZU9wdGlvbnMgPSB7fSk6IER5bmFtaWNNb2R1bGUge1xuXHRcdGNvbnN0IGNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb24gPz8gZGVmYXVsdFR5cGVzO1xuXG5cdFx0Ly8gRGl2ZS1nbG9iYWwga25vYjogYXBwbGllZCBvbmx5IHdoZW4gZXhwbGljaXRseSBwcm92aWRlZCDigJQgYSBkaXJlY3Rcblx0XHQvLyBzZXRUcmFjZUxpbWl0KCkgZnJvbSB1c2VybGFuZCBtdXN0IG5ldmVyIGJlIHNpbGVudGx5IG92ZXJyaWRkZW4uXG5cdFx0aWYgKG9wdGlvbnMudHJhY2VMaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRzZXRUcmFjZUxpbWl0KG9wdGlvbnMudHJhY2VMaW1pdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvdmlkZXJzOiBQcm92aWRlcltdID0gW1xuXHRcdFx0eyBwcm92aWRlOiBNTkVNT05JQ0FfQ09MTEVDVElPTiwgdXNlVmFsdWU6IGNvbGxlY3Rpb24gfSxcblx0XHRdO1xuXG5cdFx0aWYgKG9wdGlvbnMuYXV0b0V4dHJhY3QpIHtcblx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0cHJvdmlkZSA6IEFQUF9JTlRFUkNFUFRPUixcblx0XHRcdFx0dXNlQ2xhc3MgOiBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IsXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy50aHVuZGVyc3RydWNrKSB7XG5cdFx0XHQvLyBEaXZlIGhvb2tzIGZpcnN0IChjcmVhdGlvbiBlZGdlcyArIG1ldGhvZCB3cmFwcGluZyksIHRoZW4gdGhlXG5cdFx0XHQvLyBib3VuZGFyeSBpbnRlcmNlcHRvciB0aGF0IHN0YW1wcyBwcmUtcm9vdCBwYXlsb2Fkcy4gVGhlIGNvbmZpZ1xuXHRcdFx0Ly8gcmlkZXMgYSBESSB0b2tlbjogYSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgb2YgYW4gaW50ZXJmYWNlIHR5cGVcblx0XHRcdC8vIHdvdWxkIHN1cmZhY2UgaW4gZGVzaWduOnBhcmFtdHlwZXMgYXMgT2JqZWN0IGFuZCBicmVhayBOZXN0J3Ncblx0XHRcdC8vIGNsYXNzLWJhc2VkIGluc3RhbnRpYXRpb24gd2hlcmUgdGhlIHRva2VuIGlzIG5vdCByZWdpc3RlcmVkLlxuXHRcdFx0YXR0YWNoSG9va3MoY29sbGVjdGlvbik7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBNTkVNT05JQ0FfVEhVTkRFUlNUUlVDS19PUFRJT05TLFxuXHRcdFx0XHR1c2VWYWx1ZSA6IHR5cGVvZiBvcHRpb25zLnRodW5kZXJzdHJ1Y2sgPT09ICdvYmplY3QnXG5cdFx0XHRcdFx0PyBvcHRpb25zLnRodW5kZXJzdHJ1Y2tcblx0XHRcdFx0XHQ6IHt9LFxuXHRcdFx0fSk7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBBUFBfSU5URVJDRVBUT1IsXG5cdFx0XHRcdHVzZUNsYXNzIDogTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMudHJhY2VyKSB7XG5cdFx0XHRjb25zdCBvdGVsID0gbmV3IE1uZW1vbmljYU90ZWxQcm92aWRlcihvcHRpb25zLnRyYWNlcik7XG5cdFx0XHRvdGVsLmF0dGFjaEhvb2tzKGNvbGxlY3Rpb24pO1xuXHRcdFx0cHJvdmlkZXJzLnB1c2goe1xuXHRcdFx0XHRwcm92aWRlIDogTW5lbW9uaWNhT3RlbFByb3ZpZGVyLFxuXHRcdFx0XHR1c2VWYWx1ZSA6IG90ZWwsXG5cdFx0XHR9KTtcblx0XHRcdGlmIChvcHRpb25zLnRyYWNlRGl2ZUNhbGxzKSB7XG5cdFx0XHRcdGNvbnN0IGRpdmVPdGVsID0gbmV3IERpdmVPdGVsUHJvdmlkZXIob3B0aW9ucy50cmFjZXIpO1xuXHRcdFx0XHRkaXZlT3RlbC5hdHRhY2goKTtcblx0XHRcdFx0cHJvdmlkZXJzLnB1c2goe1xuXHRcdFx0XHRcdHByb3ZpZGUgOiBEaXZlT3RlbFByb3ZpZGVyLFxuXHRcdFx0XHRcdHVzZVZhbHVlIDogZGl2ZU90ZWwsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAob3B0aW9ucy50ZWxlbWV0cnkpIHtcblx0XHRcdHRoaXMucmVnaXN0ZXJUZWxlbWV0cnlIb29rcyhjb2xsZWN0aW9uKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bW9kdWxlICA6IE1uZW1vbmljYU1vZHVsZSxcblx0XHRcdHByb3ZpZGVycyxcblx0XHRcdGV4cG9ydHMgOiBbTU5FTU9OSUNBX0NPTExFQ1RJT05dLFxuXHRcdFx0Z2xvYmFsICA6IHRydWUsXG5cdFx0fTtcblx0fVxuXG5cdHN0YXRpYyBmb3JGZWF0dXJlIChuYW1lOiBzdHJpbmcsIGNvbmZpZz86IENvbnN0cnVjdG9yT3B0aW9ucyk6IER5bmFtaWNNb2R1bGUge1xuXHRcdGNvbnN0IGNvbGxlY3Rpb24gPSBjcmVhdGVUeXBlc0NvbGxlY3Rpb24oY29uZmlnKTtcblx0XHRjb25zdCB0b2tlbiA9IGdldEZlYXR1cmVUb2tlbihuYW1lKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRtb2R1bGUgIDogTW5lbW9uaWNhTW9kdWxlLFxuXHRcdFx0cHJvdmlkZXJzIDogW1xuXHRcdFx0XHR7IHByb3ZpZGU6IHRva2VuLCB1c2VWYWx1ZTogY29sbGVjdGlvbiB9LFxuXHRcdFx0XSxcblx0XHRcdGV4cG9ydHMgOiBbdG9rZW5dLFxuXHRcdFx0Z2xvYmFsICA6IGZhbHNlLFxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyByZWdpc3RlclRlbGVtZXRyeUhvb2tzIChjb2xsZWN0aW9uOiBUeXBlc0NvbGxlY3Rpb24pOiB2b2lkIHtcblx0XHRjb2xsZWN0aW9uLnJlZ2lzdGVySG9vaygncG9zdENyZWF0aW9uJywgKHsgVHlwZU5hbWUgfSkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdGNvbnNvbGUubG9nKCdbbW5lbW9uaWNhXSBjcmVhdGVkOicsIFR5cGVOYW1lKTtcblx0XHR9KTtcblxuXHRcdGNvbGxlY3Rpb24ucmVnaXN0ZXJIb29rKCdjcmVhdGlvbkVycm9yJywgKHsgVHlwZU5hbWUgfSkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1ttbmVtb25pY2FdIGVycm9yOicsIFR5cGVOYW1lKTtcblx0XHR9KTtcblx0fVxufVxuIl19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tbmVtb25pY2EubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFrQkEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFTdEQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDcEcsT0FBTyxFQUNOLGlDQUFpQyxHQUVqQyxNQUFNLHVEQUF1RCxDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSwrQkFBK0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUEyQi9FOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFHakMsSUFBTSxlQUFlLHVCQUFyQixNQUFNLGVBQWU7SUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBRSxVQUFrQyxFQUFFO1FBQ25ELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksWUFBWSxDQUFDO1FBRXRELHFFQUFxRTtRQUNyRSxtRUFBbUU7UUFDbkUsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUVELE1BQU0sU0FBUyxHQUFlO1lBQzdCLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7U0FDdkQsQ0FBQztRQUVGLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsT0FBTyxFQUFHLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRyw4QkFBOEI7YUFDekMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUVELElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzNCLGdFQUFnRTtZQUNoRSxpRUFBaUU7WUFDakUsaUVBQWlFO1lBQ2pFLGdFQUFnRTtZQUNoRSwrREFBK0Q7WUFDL0QsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsT0FBTyxFQUFHLCtCQUErQjtnQkFDekMsUUFBUSxFQUFHLE9BQU8sT0FBTyxDQUFDLGFBQWEsS0FBSyxRQUFRO29CQUNuRCxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWE7b0JBQ3ZCLENBQUMsQ0FBQyxFQUFFO2FBQ0wsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDZCxPQUFPLEVBQUcsZUFBZTtnQkFDekIsUUFBUSxFQUFHLGlDQUFpQzthQUM1QyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3QixTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNkLE9BQU8sRUFBRyxxQkFBcUI7Z0JBQy9CLFFBQVEsRUFBRyxJQUFJO2FBQ2YsQ0FBQyxDQUFDO1FBQ0osQ0FBQzthQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRUQsT0FBTztZQUNOLE1BQU0sRUFBSSxpQkFBZTtZQUN6QixTQUFTO1lBQ1QsT0FBTyxFQUFHLENBQUMsb0JBQW9CLENBQUM7WUFDaEMsTUFBTSxFQUFJLElBQUk7U0FDZCxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUUsSUFBWSxFQUFFLE1BQTJCO1FBQzNELE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxPQUFPO1lBQ04sTUFBTSxFQUFJLGlCQUFlO1lBQ3pCLFNBQVMsRUFBRztnQkFDWCxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTthQUN4QztZQUNELE9BQU8sRUFBRyxDQUFDLEtBQUssQ0FBQztZQUNqQixNQUFNLEVBQUksS0FBSztTQUNmLENBQUM7SUFDSCxDQUFDO0lBRU8sTUFBTSxDQUFDLHNCQUFzQixDQUFFLFVBQTJCO1FBQ2pFLFVBQVUsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQ3hELHNDQUFzQztZQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDekQsc0NBQXNDO1lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0QsQ0FBQTtBQXBGWSxlQUFlO0lBRDNCLE1BQU0sQ0FBQyxFQUFFLENBQUM7R0FDRSxlQUFlLENBb0YzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTmVzdEpTIG1vZHVsZSBmb3IgbW5lbW9uaWNhIGludGVncmF0aW9uLlxuICpcbiAqIGZvclJvb3QoKSAgIOKAlCByZWdpc3RlcnMgdGhlIGdsb2JhbC9kZWZhdWx0IFR5cGVzQ29sbGVjdGlvblxuICogZm9yRmVhdHVyZSgpIOKAlCBjcmVhdGVzIGFuIGlzb2xhdGVkIFR5cGVzQ29sbGVjdGlvbiBwZXIgbW9kdWxlXG4gKlxuICogVXNhZ2U6XG4gKiAgIEBNb2R1bGUoe1xuICogICAgIGltcG9ydHM6IFtNbmVtb25pY2FNb2R1bGUuZm9yUm9vdCh7IGF1dG9FeHRyYWN0OiB0cnVlIH0pXSxcbiAqICAgfSlcbiAqICAgY2xhc3MgQXBwTW9kdWxlIHt9XG4gKlxuICogICBATW9kdWxlKHtcbiAqICAgICBpbXBvcnRzOiBbTW5lbW9uaWNhTW9kdWxlLmZvckZlYXR1cmUoJ3BheW1lbnRzJyldLFxuICogICB9KVxuICogICBjbGFzcyBQYXltZW50c01vZHVsZSB7fVxuICovXG5pbXBvcnQgdHlwZSB7IER5bmFtaWNNb2R1bGUsIFByb3ZpZGVyIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgTW9kdWxlIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgQVBQX0lOVEVSQ0VQVE9SIH0gZnJvbSAnQG5lc3Rqcy9jb3JlJztcbmltcG9ydCB0eXBlIHsgVHJhY2VyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvYXBpJztcbmltcG9ydCB7IGRlZmF1bHRUeXBlcywgY3JlYXRlVHlwZXNDb2xsZWN0aW9uIH0gZnJvbSAnbW5lbW9uaWNhL21vZHVsZSc7XG5pbXBvcnQgdHlwZSB7IFR5cGVzQ29sbGVjdGlvbiB9IGZyb20gJ21uZW1vbmljYS9tb2R1bGUnO1xuaW1wb3J0IHsgc2V0VHJhY2VMaW1pdCB9IGZyb20gJ0BtbmVtb25pY2EvZGl2ZSc7XG5pbXBvcnQgeyBhdHRhY2hIb29rcyB9IGZyb20gJy4vaG9va3MvYXR0YWNoLWhvb2tzLmpzJztcblxudHlwZSBDb25zdHJ1Y3Rvck9wdGlvbnMgPSB7XG5cdHN0cmljdENoYWluPzogYm9vbGVhbjtcblx0YmxvY2tFcnJvcnM/OiBib29sZWFuO1xuXHRzdWJtaXRTdGFjaz86IGJvb2xlYW47XG5cdGF3YWl0UmV0dXJuPzogYm9vbGVhbjtcblx0YXNDbGFzcz86IGJvb2xlYW47XG59O1xuaW1wb3J0IHsgTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvcnMvbW5lbW9uaWNhLXNlcmlhbGl6ZXIuaW50ZXJjZXB0b3IuanMnO1xuaW1wb3J0IHtcblx0TW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yLFxuXHR0eXBlIFRodW5kZXJzdHJ1Y2tPcHRpb25zLFxufSBmcm9tICcuL2ludGVyY2VwdG9ycy9tbmVtb25pY2EtdGh1bmRlcnN0cnVjay5pbnRlcmNlcHRvci5qcyc7XG5pbXBvcnQgeyBNTkVNT05JQ0FfQ09MTEVDVElPTiwgTU5FTU9OSUNBX1RIVU5ERVJTVFJVQ0tfT1BUSU9OUywgZ2V0RmVhdHVyZVRva2VuIH0gZnJvbSAnLi90b2tlbnMuanMnO1xuaW1wb3J0IHsgTW5lbW9uaWNhT3RlbFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvbW5lbW9uaWNhLW90ZWwucHJvdmlkZXIuanMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1uZW1vbmljYU1vZHVsZU9wdGlvbnMge1xuXHQvKiogRXhpc3RpbmcgVHlwZXNDb2xsZWN0aW9uIChkZWZhdWx0ID0gbW5lbW9uaWNhLmRlZmF1bHRUeXBlcykgKi9cblx0Y29sbGVjdGlvbj86IFR5cGVzQ29sbGVjdGlvbjtcblx0LyoqIEF1dG8td2lyZSBjb25zb2xlIHRlbGVtZXRyeSBob29rcyAqL1xuXHR0ZWxlbWV0cnk/OiBib29sZWFuO1xuXHQvKiogR2xvYmFsbHkgcmVnaXN0ZXIgTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yICovXG5cdGF1dG9FeHRyYWN0PzogYm9vbGVhbjtcblx0LyoqIE9wZW5UZWxlbWV0cnkgdHJhY2VyIOKAlCBpZiBwcm92aWRlZCwgcmVwbGFjZXMgY29uc29sZSB0ZWxlbWV0cnkgd2l0aCBPVGVsIHNwYW5zICovXG5cdHRyYWNlcj86IFRyYWNlcjtcblx0LyoqXG5cdCAqIERpdmUgcmluZy1idWZmZXIgc2l6ZSAoZWRnZXMga2VwdCBpbiB0aGUgdHJhY2UpLiBBcHBsaWVkIG9ubHkgd2hlblxuXHQgKiBleHBsaWNpdGx5IHByb3ZpZGVkLCBzbyBhIGRpcmVjdCBzZXRUcmFjZUxpbWl0KCkgY2FsbCBmcm9tIHVzZXJsYW5kIGlzXG5cdCAqIG5ldmVyIG92ZXJyaWRkZW4uIERpdmUncyBvd24gZGVmYXVsdCBlcXVhbHMgREVGQVVMVF9UUkFDRV9MSU1JVC5cblx0ICovXG5cdHRyYWNlTGltaXQ/OiBudW1iZXI7XG5cdC8qKlxuXHQgKiBUaHVuZGVyc3RydWNrOiBhdHRhY2ggZGl2ZSBob29rcyB0byB0aGUgY29sbGVjdGlvbiBBTkQgcmVnaXN0ZXIgdGhlXG5cdCAqIE1uZW1vbmljYVRodW5kZXJzdHJ1Y2tJbnRlcmNlcHRvciBnbG9iYWxseSDigJQgcmF3IHJlcXVlc3QgcGF5bG9hZHMgYXJlXG5cdCAqIGZlZCBpbnRvIGRpdmUncyBwcmUtcm9vdCBjb2xsZWN0b3IgYWhlYWQgb2YgZXZlcnkgY29uc3RydWN0aW9uLlxuXHQgKiBQYXNzIGEgVGh1bmRlcnN0cnVja09wdGlvbnMgb2JqZWN0IGZvciB0aGUgZXh0cmFzLCBlLmcuXG5cdCAqIHsgc3RvcmVSZXF1ZXN0OiB0cnVlIH0uXG5cdCAqL1xuXHR0aHVuZGVyc3RydWNrPzogYm9vbGVhbiB8IFRodW5kZXJzdHJ1Y2tPcHRpb25zO1xufVxuXG4vKipcbiAqIFRoZSBkaXZlIHRyYWNlJ3MgZGVmYXVsdCByaW5nLWJ1ZmZlciBzaXplIOKAlCByZS1leHBvcnRlZCBzbyB0aGUgdHVuaW5nXG4gKiBrbm9iIGlzIGRpc2NvdmVyYWJsZSB3aGVyZSB0aGUgbW9kdWxlIGlzIGNvbmZpZ3VyZWQuIE1hdGNoZXMgZGl2ZSdzIG93blxuICogaW50ZXJuYWwgZGVmYXVsdDsgdGhlIGJ1ZmZlciBzaXplIElTIGRpdmUncyBtZW1vcnkgYm91bmQuXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RSQUNFX0xJTUlUID0gMTAyNDtcblxuQE1vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBNbmVtb25pY2FNb2R1bGUge1xuXHRzdGF0aWMgZm9yUm9vdCAob3B0aW9uczogTW5lbW9uaWNhTW9kdWxlT3B0aW9ucyA9IHt9KTogRHluYW1pY01vZHVsZSB7XG5cdFx0Y29uc3QgY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbiA/PyBkZWZhdWx0VHlwZXM7XG5cblx0XHQvLyBEaXZlLWdsb2JhbCBrbm9iOiBhcHBsaWVkIG9ubHkgd2hlbiBleHBsaWNpdGx5IHByb3ZpZGVkIOKAlCBhIGRpcmVjdFxuXHRcdC8vIHNldFRyYWNlTGltaXQoKSBmcm9tIHVzZXJsYW5kIG11c3QgbmV2ZXIgYmUgc2lsZW50bHkgb3ZlcnJpZGRlbi5cblx0XHRpZiAob3B0aW9ucy50cmFjZUxpbWl0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHNldFRyYWNlTGltaXQob3B0aW9ucy50cmFjZUxpbWl0KTtcblx0XHR9XG5cblx0XHRjb25zdCBwcm92aWRlcnM6IFByb3ZpZGVyW10gPSBbXG5cdFx0XHR7IHByb3ZpZGU6IE1ORU1PTklDQV9DT0xMRUNUSU9OLCB1c2VWYWx1ZTogY29sbGVjdGlvbiB9LFxuXHRcdF07XG5cblx0XHRpZiAob3B0aW9ucy5hdXRvRXh0cmFjdCkge1xuXHRcdFx0cHJvdmlkZXJzLnB1c2goe1xuXHRcdFx0XHRwcm92aWRlIDogQVBQX0lOVEVSQ0VQVE9SLFxuXHRcdFx0XHR1c2VDbGFzcyA6IE1uZW1vbmljYVNlcmlhbGl6ZXJJbnRlcmNlcHRvcixcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLnRodW5kZXJzdHJ1Y2spIHtcblx0XHRcdC8vIERpdmUgaG9va3MgZmlyc3QgKGNyZWF0aW9uIGVkZ2VzICsgbWV0aG9kIHdyYXBwaW5nKSwgdGhlbiB0aGVcblx0XHRcdC8vIGJvdW5kYXJ5IGludGVyY2VwdG9yIHRoYXQgc3RhbXBzIHByZS1yb290IHBheWxvYWRzLiBUaGUgY29uZmlnXG5cdFx0XHQvLyByaWRlcyBhIERJIHRva2VuOiBhIGNvbnN0cnVjdG9yIHBhcmFtZXRlciBvZiBhbiBpbnRlcmZhY2UgdHlwZVxuXHRcdFx0Ly8gd291bGQgc3VyZmFjZSBpbiBkZXNpZ246cGFyYW10eXBlcyBhcyBPYmplY3QgYW5kIGJyZWFrIE5lc3Qnc1xuXHRcdFx0Ly8gY2xhc3MtYmFzZWQgaW5zdGFudGlhdGlvbiB3aGVyZSB0aGUgdG9rZW4gaXMgbm90IHJlZ2lzdGVyZWQuXG5cdFx0XHRhdHRhY2hIb29rcyhjb2xsZWN0aW9uKTtcblx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0cHJvdmlkZSA6IE1ORU1PTklDQV9USFVOREVSU1RSVUNLX09QVElPTlMsXG5cdFx0XHRcdHVzZVZhbHVlIDogdHlwZW9mIG9wdGlvbnMudGh1bmRlcnN0cnVjayA9PT0gJ29iamVjdCdcblx0XHRcdFx0XHQ/IG9wdGlvbnMudGh1bmRlcnN0cnVja1xuXHRcdFx0XHRcdDoge30sXG5cdFx0XHR9KTtcblx0XHRcdHByb3ZpZGVycy5wdXNoKHtcblx0XHRcdFx0cHJvdmlkZSA6IEFQUF9JTlRFUkNFUFRPUixcblx0XHRcdFx0dXNlQ2xhc3MgOiBNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IsXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy50cmFjZXIpIHtcblx0XHRcdGNvbnN0IG90ZWwgPSBuZXcgTW5lbW9uaWNhT3RlbFByb3ZpZGVyKG9wdGlvbnMudHJhY2VyKTtcblx0XHRcdG90ZWwuYXR0YWNoSG9va3MoY29sbGVjdGlvbik7XG5cdFx0XHRwcm92aWRlcnMucHVzaCh7XG5cdFx0XHRcdHByb3ZpZGUgOiBNbmVtb25pY2FPdGVsUHJvdmlkZXIsXG5cdFx0XHRcdHVzZVZhbHVlIDogb3RlbCxcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAob3B0aW9ucy50ZWxlbWV0cnkpIHtcblx0XHRcdHRoaXMucmVnaXN0ZXJUZWxlbWV0cnlIb29rcyhjb2xsZWN0aW9uKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bW9kdWxlICA6IE1uZW1vbmljYU1vZHVsZSxcblx0XHRcdHByb3ZpZGVycyxcblx0XHRcdGV4cG9ydHMgOiBbTU5FTU9OSUNBX0NPTExFQ1RJT05dLFxuXHRcdFx0Z2xvYmFsICA6IHRydWUsXG5cdFx0fTtcblx0fVxuXG5cdHN0YXRpYyBmb3JGZWF0dXJlIChuYW1lOiBzdHJpbmcsIGNvbmZpZz86IENvbnN0cnVjdG9yT3B0aW9ucyk6IER5bmFtaWNNb2R1bGUge1xuXHRcdGNvbnN0IGNvbGxlY3Rpb24gPSBjcmVhdGVUeXBlc0NvbGxlY3Rpb24oY29uZmlnKTtcblx0XHRjb25zdCB0b2tlbiA9IGdldEZlYXR1cmVUb2tlbihuYW1lKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRtb2R1bGUgIDogTW5lbW9uaWNhTW9kdWxlLFxuXHRcdFx0cHJvdmlkZXJzIDogW1xuXHRcdFx0XHR7IHByb3ZpZGU6IHRva2VuLCB1c2VWYWx1ZTogY29sbGVjdGlvbiB9LFxuXHRcdFx0XSxcblx0XHRcdGV4cG9ydHMgOiBbdG9rZW5dLFxuXHRcdFx0Z2xvYmFsICA6IGZhbHNlLFxuXHRcdH07XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyByZWdpc3RlclRlbGVtZXRyeUhvb2tzIChjb2xsZWN0aW9uOiBUeXBlc0NvbGxlY3Rpb24pOiB2b2lkIHtcblx0XHRjb2xsZWN0aW9uLnJlZ2lzdGVySG9vaygncG9zdENyZWF0aW9uJywgKHsgVHlwZU5hbWUgfSkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdGNvbnNvbGUubG9nKCdbbW5lbW9uaWNhXSBjcmVhdGVkOicsIFR5cGVOYW1lKTtcblx0XHR9KTtcblxuXHRcdGNvbGxlY3Rpb24ucmVnaXN0ZXJIb29rKCdjcmVhdGlvbkVycm9yJywgKHsgVHlwZU5hbWUgfSkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ1ttbmVtb25pY2FdIGVycm9yOicsIFR5cGVOYW1lKTtcblx0XHR9KTtcblx0fVxufVxuIl19
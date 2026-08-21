/**
 * NestJS module for mnemonica integration.
 *
 * forRoot()   — registers the global/default TypesCollection
 * forFeature() — creates an isolated TypesCollection per module
 *
 * Usage:
 *   @Module({
 *     imports: [MnemonicaModule.forRoot({ autoExtract: true })],
 *   })
 *   class AppModule {}
 *
 *   @Module({
 *     imports: [MnemonicaModule.forFeature('payments')],
 *   })
 *   class PaymentsModule {}
 */
import type { DynamicModule } from '@nestjs/common';
import type { Tracer } from '@opentelemetry/api';
import type { TypesCollection } from 'mnemonica/module';
type ConstructorOptions = {
    strictChain?: boolean;
    blockErrors?: boolean;
    submitStack?: boolean;
    awaitReturn?: boolean;
    asClass?: boolean;
};
import { type ThunderstruckOptions } from './interceptors/mnemonica-thunderstruck.interceptor.js';
export interface MnemonicaModuleOptions {
    /** Existing TypesCollection (default = mnemonica.defaultTypes) */
    collection?: TypesCollection;
    /** Auto-wire console telemetry hooks */
    telemetry?: boolean;
    /** Globally register MnemonicaSerializerInterceptor */
    autoExtract?: boolean;
    /** OpenTelemetry tracer — if provided, replaces console telemetry with OTel spans */
    tracer?: Tracer;
    /**
     * Dive ring-buffer size (edges kept in the trace). Applied only when
     * explicitly provided, so a direct setTraceLimit() call from userland is
     * never overridden. Dive's own default equals DEFAULT_TRACE_LIMIT.
     */
    traceLimit?: number;
    /**
     * Thunderstruck: attach dive hooks to the collection AND register the
     * MnemonicaThunderstruckInterceptor globally — raw request payloads are
     * fed into dive's pre-root collector ahead of every construction.
     * Pass a ThunderstruckOptions object for the extras, e.g.
     * { storeRequest: true }.
     */
    thunderstruck?: boolean | ThunderstruckOptions;
}
/**
 * The dive trace's default ring-buffer size — re-exported so the tuning
 * knob is discoverable where the module is configured. Matches dive's own
 * internal default; the buffer size IS dive's memory bound.
 */
export declare const DEFAULT_TRACE_LIMIT = 1024;
export declare class MnemonicaModule {
    static forRoot(options?: MnemonicaModuleOptions): DynamicModule;
    static forFeature(name: string, config?: ConstructorOptions): DynamicModule;
    private static registerTelemetryHooks;
}
export {};
//# sourceMappingURL=mnemonica.module.d.ts.map
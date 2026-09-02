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
     * Span EVERY dive-wrapped call (call / construct / method / recontext),
     * not just constructions. Requires `tracer`. Spans are parented on dive's
     * own trace parentage; at unwrapped boundaries they nest under the active
     * OTel span (e.g. the HTTP request span from mtm).
     */
    traceDiveCalls?: boolean;
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
    /**
     * Async-flow tracking (reports/async-flow-tracking-design.md): an ALS
     * backbone that attributes UNWRAPPED async hops (timers, promise
     * continuations, async-generator suspensions) to the parental dive
     * edge and pins context instances for exactly the request's lifetime,
     * so edge.instance never derefs to undefined mid-request. The HTTP
     * root frame is created by MnemonicaTraceMiddleware when the provider
     * is present; non-HTTP roots use AsyncFlowProvider.runInScope.
     */
    asyncFlow?: boolean;
}
/**
 * The dive trace's default ring size — re-exported so the tuning knob is
 * discoverable where the module is configured. Matches dive's own internal
 * default: UNBOUNDED since dive's 2026-09-02 flip (retention is GC-driven
 * in weak mode; pass an explicit traceLimit to bound the ring).
 */
export declare const DEFAULT_TRACE_LIMIT: number;
export declare class MnemonicaModule {
    static forRoot(options?: MnemonicaModuleOptions): DynamicModule;
    static forFeature(name: string, config?: ConstructorOptions): DynamicModule;
    private static registerTelemetryHooks;
}
export {};
//# sourceMappingURL=mnemonica.module.d.ts.map
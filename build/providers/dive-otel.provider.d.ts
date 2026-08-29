/**
 * OpenTelemetry provider for dive's edge lifecycle hooks.
 *
 * Where MnemonicaOtelProvider spans CONSTRUCTIONS (mnemonica hooks), this
 * provider spans EVERY WRAPPED CALL (dive hooks): call / construct / method /
 * recontext edges each become a span, parented on the span of the edge's
 * parentId — dive's own trace parentage, not ALS. At unwrapped boundaries
 * (parentId null) the span nests under the currently ACTIVE OTel span, so an
 * HTTP request span adopts the whole dive branch.
 *
 * Async truthfulness: a span does NOT end at the sync close when the wrap
 * produced a tapped promise — it ends at settle, with the chain's outcome.
 * Spans are keyed on edge id; every recorded edge fires leave (and, when
 * async, settle), so the map always drains.
 */
import type { Tracer } from '@opentelemetry/api';
export declare class DiveOtelProvider {
    private tracer;
    private spans;
    private detachers;
    constructor(tracer?: Tracer);
    /**
     * Subscribe to dive's edge lifecycle. Idempotent: attaching twice would
     * double every span. Dive's clear() wipes subscribers — re-attach after it.
     */
    attach(): void;
    detach(): void;
    private onEnter;
    private onLeave;
    private onSettle;
    private onRecontext;
    private findParentSpan;
    private closeSpan;
}
//# sourceMappingURL=dive-otel.provider.d.ts.map
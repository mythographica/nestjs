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
import type { Span, Tracer } from '@opentelemetry/api';
import { SpanStatusCode, context as otelContext, trace } from '@opentelemetry/api';
import {
	registerHook,
	type DiveEnterPayload,
	type DiveLeavePayload,
	type DiveRecontextPayload,
	type DiveSettlePayload,
	type FlowEdge,
} from '@mnemonica/dive';

export class DiveOtelProvider {
	private tracer: Tracer;
	// open spans, keyed on dive edge id — drained by leave/settle
	private spans = new Map<number, Span>();
	private detachers: Array<() => void> = [];

	constructor (tracer?: Tracer) {
		this.tracer = tracer ?? trace.getTracer('@mnemonica/nestjs');
	}

	/**
	 * Subscribe to dive's edge lifecycle. Idempotent: attaching twice would
	 * double every span. Dive's clear() wipes subscribers — re-attach after it.
	 */
	attach (): void {
		if (this.detachers.length > 0) {
			return;
		}
		this.detachers.push(
			registerHook('enter', (payload) => {
				this.onEnter(payload);
			}),
			registerHook('leave', (payload) => {
				this.onLeave(payload);
			}),
			registerHook('settle', (payload) => {
				this.onSettle(payload);
			}),
			registerHook('recontext', (payload) => {
				this.onRecontext(payload);
			}),
		);
	}

	detach (): void {
		for (const detach of this.detachers) {
			detach();
		}
		this.detachers = [];
	}

	private onEnter ({ edge }: DiveEnterPayload): void {
		const parentSpan = this.findParentSpan(edge);
		const ctx = parentSpan
			? trace.setSpan(otelContext.active(), parentSpan)
			: undefined;
		const name = `dive.${edge.kind}:${edge.name}`;
		const span = ctx
			? this.tracer.startSpan(name, {}, ctx)
			: this.tracer.startSpan(name);

		span.setAttribute('dive.edge_id', edge.id);
		span.setAttribute('dive.kind', edge.kind);
		span.setAttribute('dive.name', edge.name);

		this.spans.set(edge.id, span);
	}

	private onLeave ({ edge, result }: DiveLeavePayload): void {
		if (result instanceof Promise) {
			// async work: the span closes at settle, not at the sync head —
			// "the function returned" is not "the work is done"
			return;
		}
		this.closeSpan(edge);
	}

	private onSettle ({ edge, error }: DiveSettlePayload): void {
		this.closeSpan(edge, error);
	}

	private onRecontext ({ edge, previousContext, context }: DiveRecontextPayload): void {
		// One-shot span: the ownership transfer itself, parented on the OLD
		// context's span (the handoff edge's parentId), so the trace shows
		// where the callback's story crossed flows.
		const parentSpan = this.findParentSpan(edge);
		const ctx = parentSpan
			? trace.setSpan(otelContext.active(), parentSpan)
			: undefined;
		const name = `dive.${edge.kind}:${edge.name}`;
		const span = ctx
			? this.tracer.startSpan(name, {}, ctx)
			: this.tracer.startSpan(name);

		span.setAttribute('dive.edge_id', edge.id);
		span.setAttribute('dive.kind', edge.kind);
		span.setAttribute('dive.name', edge.name);
		span.setAttribute('dive.handoff', true);
		span.setAttribute('dive.handoff.had_previous', previousContext !== undefined);
		span.setAttribute('dive.handoff.has_context', context !== undefined);
		span.end();
	}

	private findParentSpan (edge: FlowEdge): Span | undefined {
		if (edge.parentId !== null) {
			const own = this.spans.get(edge.parentId);
			if (own) {
				return own;
			}
		}
		// Boundary (or evicted parent): adopt the active OTel span — the HTTP
		// request span becomes the root of the dive branch.
		const active = trace.getSpan(otelContext.active());
		return active;
	}

	private closeSpan (edge: FlowEdge, error?: unknown): void {
		const span = this.spans.get(edge.id);
		if (!span) {
			return;
		}
		this.spans.delete(edge.id);

		span.setAttribute('dive.status', edge.status);
		if (edge.duration !== undefined) {
			span.setAttribute('dive.duration_ms', edge.duration);
		}
		if (edge.status === 'error') {
			// sync throws carry no error value in the leave payload — the
			// edge's own status is the truthful signal; the exception record
			// is available only when settle carried the rejection itself
			span.setStatus({ code: SpanStatusCode.ERROR });
			if (error instanceof Error) {
				span.recordException(error);
			}
		}
		span.end();
	}
}

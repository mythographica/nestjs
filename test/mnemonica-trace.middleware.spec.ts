/**
 * Tests for MnemonicaTraceMiddleware.
 *
 * Pins the dual context entry: inside next(), the request span must be
 * visible BOTH through the provider's own AsyncLocalStorage (used by
 * mnemonica hooks) AND through the OTEL global context (read by
 * DiveOtelProvider when it looks for a parent span at wrap boundaries).
 */
import { EventEmitter } from 'events';
import { describe, it, expect, beforeEach } from 'vitest';
import {
	NodeTracerProvider,
	InMemorySpanExporter,
	SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { context as otelContext, trace } from '@opentelemetry/api';
import type { Request, Response, NextFunction } from 'express';
import type { Span } from '@opentelemetry/api';
import { MnemonicaOtelProvider } from '../src/providers/mnemonica-otel.provider.js';
import { MnemonicaTraceMiddleware } from '../src/middleware/mnemonica-trace.middleware.js';

describe('MnemonicaTraceMiddleware', () => {
	let exporter: InMemorySpanExporter;
	let provider: NodeTracerProvider;
	let otel: MnemonicaOtelProvider;
	let middleware: MnemonicaTraceMiddleware;

	beforeEach(() => {
		exporter = new InMemorySpanExporter();
		provider = new NodeTracerProvider();
		provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
		provider.register();

		otel = new MnemonicaOtelProvider(provider.getTracer('test'));
		middleware = new MnemonicaTraceMiddleware(provider.getTracer('test'), otel);
	});

	const makeReq = (): Request => {
		const req = {
			method : 'GET',
			url    : '/chaos/ok',
		} as unknown as Request;
		return req;
	};

	const makeRes = (): Response & EventEmitter => {
		const res = new EventEmitter() as Response & EventEmitter;
		res.statusCode = 200;
		return res;
	};

	it('exposes the request span via provider ALS inside next()', () => {
		const req = makeReq();
		const res = makeRes();

		let seen: Span | undefined;
		const next: NextFunction = () => {
			seen = otel.getCurrentSpan();
		};

		middleware.use(req, res, next);

		expect(seen).toBeDefined();
		expect(otel.getCurrentSpan()).toBeUndefined();
	});

	it('exposes the request span via OTEL global context inside next()', () => {
		const req = makeReq();
		const res = makeRes();

		let seen: Span | undefined;
		let alsSpan: Span | undefined;
		const next: NextFunction = () => {
			seen = trace.getSpan(otelContext.active());
			alsSpan = otel.getCurrentSpan();
		};

		middleware.use(req, res, next);

		expect(seen).toBeDefined();
		expect(alsSpan).toBeDefined();
		// same span on both sides — dive and mnemonica hooks share the parent
		expect(seen!.spanContext().spanId).toBe(alsSpan!.spanContext().spanId);
	});

	it('ends the span with http.status_code on response finish', async () => {
		const req = makeReq();
		const res = makeRes();
		res.statusCode = 201;

		middleware.use(req, res, () => {});
		res.emit('finish');

		await provider.forceFlush();

		const spans = exporter.getFinishedSpans();
		expect(spans.length).toBe(1);
		expect(spans[0].name).toBe('HTTP GET /chaos/ok');
		expect(spans[0].attributes['http.method']).toBe('GET');
		expect(spans[0].attributes['http.status_code']).toBe(201);
	});
});

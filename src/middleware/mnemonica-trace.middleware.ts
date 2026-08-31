/**
 * NestJS middleware that creates an OpenTelemetry span per HTTP request
 * and stores it in AsyncLocalStorage so mnemonica hooks can nest under it.
 */
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import type { Tracer } from '@opentelemetry/api';
import { context as otelContext, trace } from '@opentelemetry/api';
import { MnemonicaOtelProvider } from '../providers/mnemonica-otel.provider.js';

@Injectable()
export class MnemonicaTraceMiddleware implements NestMiddleware {
	constructor (
		private readonly tracer: Tracer,
		private readonly otel: MnemonicaOtelProvider,
	) {}

	use (req: Request, res: Response, next: NextFunction): void {
		const route = req.route?.path ?? req.url;
		const span = this.tracer.startSpan(`HTTP ${req.method} ${route}`);
		span.setAttribute('http.method', req.method);
		span.setAttribute('http.url', req.url);

		res.on('finish', () => {
			span.setAttribute('http.status_code', res.statusCode);
			span.end();
		});

		// runWithSpan covers the mnemonica-hook side (the provider's own ALS);
		// the OTEL global context is what DiveOtelProvider reads when it looks
		// for a parent span at wrap boundaries — without this second entry
		// dive spans never adopt the request span and stay root traces.
		const activeCtx = trace.setSpan(otelContext.active(), span);
		this.otel.runWithSpan(span, () => {
			otelContext.with(activeCtx, () => next());
		});
	}
}

/**
 * NestJS middleware that creates an OpenTelemetry span per HTTP request
 * and stores it in AsyncLocalStorage so mnemonica hooks can nest under it.
 */
import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Optional } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import type { Tracer } from '@opentelemetry/api';
import { context as otelContext, trace } from '@opentelemetry/api';
import { MnemonicaOtelProvider } from '../providers/mnemonica-otel.provider.js';
import { AsyncFlowProvider } from '../providers/async-flow.provider.js';

@Injectable()
export class MnemonicaTraceMiddleware implements NestMiddleware {
	constructor (
		private readonly tracer: Tracer,
		private readonly otel: MnemonicaOtelProvider,
		@Optional() private readonly asyncFlow?: AsyncFlowProvider,
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
		// The async-flow root frame (when the module option is on) is the
		// outermost scope: every async hop of this request — wrapped or not —
		// inherits it via ALS propagation.
		const activeCtx = trace.setSpan(otelContext.active(), span);
		const run = (): void => {
			this.otel.runWithSpan(span, () => {
				otelContext.with(activeCtx, () => next());
			});
		};
		if (this.asyncFlow) {
			this.asyncFlow.runInScope(run);
			return;
		}
		run();
	}
}

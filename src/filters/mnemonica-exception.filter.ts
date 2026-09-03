import { Catch, HttpException } from '@nestjs/common';
import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import type { Response } from 'express';
import { getFlow } from '@mnemonica/dive';
import { utils, getProps } from 'mnemonica';
import { trace, SpanStatusCode } from '@opentelemetry/api';

/**
 * extract() that cannot throw inside an error path — non-mnemonica
 * values degrade to their key list.
 */
function extractSafe (instance: object): unknown {
	try {
		const result = utils.extract(instance);
		return result;
	} catch {
		const result = Object.keys(instance);
		return result;
	}
}

/**
 * The attempted constructor args of a FAILED mnemonica construction ride
 * the errored instance itself: the caught object IS the errored shell
 * (probed 2026-09-03: caught === creationError's inheritedInstance,
 * instanceof Error via the spliced prototype chain), and core's own
 * getProps exposes { args, originalError, … } off the props WeakMap.
 * Plain errors yield undefined; anything unexpected degrades, never
 * throws inside a filter.
 */
function erroredArgsSafe (error: Error): unknown {
	try {
		const props = getProps(error) as { args?: unknown } | undefined;
		const result = props?.args;
		return result;
	} catch {
		const result = undefined;
		return result;
	}
}

/**
 * JSON.stringify that cannot throw inside an error path — circular or
 * hostile values degrade to a marker instead of crashing the filter
 * (a throwing filter is exactly the cascade this demo fights).
 */
function stringifySafe (value: unknown): string {
	try {
		const result = JSON.stringify(value);
		return result;
	} catch {
		const result = '"[unserializable report payload]"';
		return result;
	}
}

/**
 * The Unblinder (2026-09-03, Viktor): teaches Nest's error boundary to
 * speak trace instead of serving the blind default
 * {"statusCode":500,"message":"Internal server error"}.
 *
 * Answers 500 with the dive branch, the errored construction edge, the
 * attempted constructor args (core's getProps off the errored instance —
 * the caught error IS that instance) and the actual error — plus an OTel
 * span carrying the exception, so the failure exists in the trace backend
 * too (a Nest-caught business error otherwise leaves NO trace mark at all).
 *
 * Register per-route (@UseFilters(MnemonicaExceptionFilter)) or globally
 * ({ provide: APP_FILTER, useClass: MnemonicaExceptionFilter }). Nest's
 * filter tiering is nearest-scope-first, first match wins, no chaining —
 * a route-scoped filter shadows the global one.
 *
 * Discipline:
 *  - expected client errors (HttpException, validation 400s) keep Nest's
 *    own answer — the trace treatment is for genuine failures only;
 *  - telemetry is UNCONDITIONAL, the body is CONDITIONAL: when the
 *    handler already poisoned the response (partial write), the client's
 *    misleading status line cannot be undone, but stdout, the span and
 *    the dive trace still get everything;
 *  - non-Error throws are reported truthfully as such, never dressed up
 *    as Errors.
 */
@Catch()
export class MnemonicaExceptionFilter implements ExceptionFilter {
	catch (error: Error, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();

		// Expected client errors keep Nest's own answer.
		if (error instanceof HttpException) {
			const status = error.getStatus();
			const body = error.getResponse();
			res.status(status).json(body);
			return;
		}

		const isError = error instanceof Error;
		const message = isError ? error.message : `non-Error thrown (${typeof error})`;
		const flow = isError ? getFlow(error) : [];
		// The errored create edge attributes the construction's PARENT
		// instance (probed 2026-09-03: edge.instance === existentInstance).
		// The attempted constructor ARGS ride the caught error itself — it
		// IS the errored shell, and getProps exposes its args (see
		// erroredArgsSafe above).
		const erroredEdge = [...flow].reverse().find((edge) => edge.kind === 'create' && edge.status === 'error');
		const erroredInstance = erroredEdge?.instance;
		const attemptedArgs = isError ? erroredArgsSafe(error) : undefined;
		const report = {
			kind            : 'nest-caught-unblinded',
			message,
			branch          : flow.map((edge) => `${edge.kind}:${edge.name}`),
			erroredType     : erroredEdge?.name ?? null,
			erroredInstance : erroredInstance ? extractSafe(erroredInstance) : null,
			attemptedArgs   : attemptedArgs ?? null,
		};

		// OTel: an ERROR span with the recorded exception + the dive branch —
		// inside the request's async context, so the ALS context manager
		// parents it under the request span on its own. A non-Error throw is
		// recorded as an attribute: recordException on a circular object
		// could break exporter serialization.
		const span = trace.getTracer('@mnemonica/nestjs').startSpan('nest.caught-exception');
		span.setAttribute('dive.branch', report.branch.join(' → '));
		if (report.erroredType) {
			span.setAttribute('mnemonica.errored_type', report.erroredType);
		}
		span.setStatus({ code: SpanStatusCode.ERROR, message });
		if (isError) {
			span.recordException(error);
		} else {
			span.setAttribute('exception.type', 'non-Error-throw');
		}
		span.end();

		// The [unblind] prefix is the demo contract — the tactica-nestjs
		// RUNBOOK greps for exactly this marker.
		console.log(`[unblind] ${stringifySafe(report)}`);

		// Telemetry unconditional, body conditional: a handler that already
		// wrote a partial answer (headers sent) keeps its misleading status
		// line — nothing can uncommit it — but the trace above still lands.
		if (!res.headersSent) {
			res.status(500).json(report);
			return;
		}
		res.end();
	}
}

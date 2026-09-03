import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
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
export declare class MnemonicaExceptionFilter implements ExceptionFilter {
    catch(error: Error, host: ArgumentsHost): void;
}
//# sourceMappingURL=mnemonica-exception.filter.d.ts.map
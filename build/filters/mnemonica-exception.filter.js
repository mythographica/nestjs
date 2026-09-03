var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException } from '@nestjs/common';
import { getFlow } from '@mnemonica/dive';
import { utils, getProps } from 'mnemonica';
import { trace, SpanStatusCode } from '@opentelemetry/api';
/**
 * extract() that cannot throw inside an error path — non-mnemonica
 * values degrade to their key list.
 */
function extractSafe(instance) {
    try {
        const result = utils.extract(instance);
        return result;
    }
    catch {
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
function erroredArgsSafe(error) {
    try {
        const props = getProps(error);
        const result = props?.args;
        return result;
    }
    catch {
        const result = undefined;
        return result;
    }
}
/**
 * JSON.stringify that cannot throw inside an error path — circular or
 * hostile values degrade to a marker instead of crashing the filter
 * (a throwing filter is exactly the cascade this demo fights).
 */
function stringifySafe(value) {
    try {
        const result = JSON.stringify(value);
        return result;
    }
    catch {
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
let MnemonicaExceptionFilter = class MnemonicaExceptionFilter {
    catch(error, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
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
            kind: 'nest-caught-unblinded',
            message,
            branch: flow.map((edge) => `${edge.kind}:${edge.name}`),
            erroredType: erroredEdge?.name ?? null,
            erroredInstance: erroredInstance ? extractSafe(erroredInstance) : null,
            attemptedArgs: attemptedArgs ?? null,
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
        }
        else {
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
};
MnemonicaExceptionFilter = __decorate([
    Catch()
], MnemonicaExceptionFilter);
export { MnemonicaExceptionFilter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLWV4Y2VwdGlvbi5maWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmlsdGVycy9tbmVtb25pY2EtZXhjZXB0aW9uLmZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3RELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM1QyxPQUFPLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTNEOzs7R0FHRztBQUNILFNBQVMsV0FBVyxDQUFFLFFBQWdCO0lBQ3JDLElBQUksQ0FBQztRQUNKLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1IsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7QUFDRixDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFTLGVBQWUsQ0FBRSxLQUFZO0lBQ3JDLElBQUksQ0FBQztRQUNKLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQW1DLENBQUM7UUFDaEUsTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQztRQUMzQixPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFBQyxNQUFNLENBQUM7UUFDUixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDekIsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0FBQ0YsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGFBQWEs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QUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsQ0FBQzthQUFNLENBQUM7WUFDUCxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVYLGlFQUFpRTtRQUNqRSx5Q0FBeUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbEQsb0VBQW9FO1FBQ3BFLG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QixPQUFPO1FBQ1IsQ0FBQztRQUNELEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNYLENBQUM7Q0FDRCxDQUFBO0FBaEVZLHdCQUF3QjtJQURwQyxLQUFLLEVBQUU7R0FDSyx3QkFBd0IsQ0FnRXBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2F0Y2gsIEh0dHBFeGNlcHRpb24gfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgdHlwZSB7IEV4Y2VwdGlvbkZpbHRlciwgQXJndW1lbnRzSG9zdCB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB0eXBlIHsgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGdldEZsb3cgfSBmcm9tICdAbW5lbW9uaWNhL2RpdmUnO1xuaW1wb3J0IHsgdXRpbHMsIGdldFByb3BzIH0gZnJvbSAnbW5lbW9uaWNhJztcbmltcG9ydCB7IHRyYWNlLCBTcGFuU3RhdHVzQ29kZSB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSc7XG5cbi8qKlxuICogZXh0cmFjdCgpIHRoYXQgY2Fubm90IHRocm93IGluc2lkZSBhbiBlcnJvciBwYXRoIOKAlCBub24tbW5lbW9uaWNhXG4gKiB2YWx1ZXMgZGVncmFkZSB0byB0aGVpciBrZXkgbGlzdC5cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFNhZmUgKGluc3RhbmNlOiBvYmplY3QpOiB1bmtub3duIHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSB1dGlscy5leHRyYWN0KGluc3RhbmNlKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9IGNhdGNoIHtcblx0XHRjb25zdCByZXN1bHQgPSBPYmplY3Qua2V5cyhpbnN0YW5jZSk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufVxuXG4vKipcbiAqIFRoZSBhdHRlbXB0ZWQgY29uc3RydWN0b3IgYXJncyBvZiBhIEZBSUxFRCBtbmVtb25pY2EgY29uc3RydWN0aW9uIHJpZGVcbiAqIHRoZSBlcnJvcmVkIGluc3RhbmNlIGl0c2VsZjogdGhlIGNhdWdodCBvYmplY3QgSVMgdGhlIGVycm9yZWQgc2hlbGxcbiAqIChwcm9iZWQgMjAyNi0wOS0wMzogY2F1Z2h0ID09PSBjcmVhdGlvbkVycm9yJ3MgaW5oZXJpdGVkSW5zdGFuY2UsXG4gKiBpbnN0YW5jZW9mIEVycm9yIHZpYSB0aGUgc3BsaWNlZCBwcm90b3R5cGUgY2hhaW4pLCBhbmQgY29yZSdzIG93blxuICogZ2V0UHJvcHMgZXhwb3NlcyB7IGFyZ3MsIG9yaWdpbmFsRXJyb3IsIOKApiB9IG9mZiB0aGUgcHJvcHMgV2Vha01hcC5cbiAqIFBsYWluIGVycm9ycyB5aWVsZCB1bmRlZmluZWQ7IGFueXRoaW5nIHVuZXhwZWN0ZWQgZGVncmFkZXMsIG5ldmVyXG4gKiB0aHJvd3MgaW5zaWRlIGEgZmlsdGVyLlxuICovXG5mdW5jdGlvbiBlcnJvcmVkQXJnc1NhZmUgKGVycm9yOiBFcnJvcik6IHVua25vd24ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHByb3BzID0gZ2V0UHJvcHMoZXJyb3IpIGFzIHsgYXJncz86IHVua25vd24gfSB8IHVuZGVmaW5lZDtcblx0XHRjb25zdCByZXN1bHQgPSBwcm9wcz8uYXJncztcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9IGNhdGNoIHtcblx0XHRjb25zdCByZXN1bHQgPSB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufVxuXG4vKipcbiAqIEpTT04uc3RyaW5naWZ5IHRoYXQgY2Fubm90IHRocm93IGluc2lkZSBhbiBlcnJvciBwYXRoIOKAlCBjaXJjdWxhciBvclxuICogaG9zdGlsZSB2YWx1ZXMgZGVncmFkZSB0byBhIG1hcmtlciBpbnN0ZWFkIG9mIGNyYXNoaW5nIHRoZSBmaWx0ZXJcbiAqIChhIHRocm93aW5nIGZpbHRlciBpcyBleGFjdGx5IHRoZSBjYXNjYWRlIHRoaXMgZGVtbyBmaWdodHMpLlxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlICh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2gge1xuXHRcdGNvbnN0IHJlc3VsdCA9ICdcIlt1bnNlcmlhbGl6YWJsZSByZXBvcnQgcGF5bG9hZF1cIic7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufVxuXG4vKipcbiAqIFRoZSBVbmJsaW5kZXIgKDIwMjYtMDktMDMsIFZpa3Rvcik6IHRlYWNoZXMgTmVzdCdzIGVycm9yIGJvdW5kYXJ5IHRvXG4gKiBzcGVhayB0cmFjZSBpbnN0ZWFkIG9mIHNlcnZpbmcgdGhlIGJsaW5kIGRlZmF1bHRcbiAqIHtcInN0YXR1c0NvZGVcIjo1MDAsXCJtZXNzYWdlXCI6XCJJbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIn0uXG4gKlxuICogQW5zd2VycyA1MDAgd2l0aCB0aGUgZGl2ZSBicmFuY2gsIHRoZSBlcnJvcmVkIGNvbnN0cnVjdGlvbiBlZGdlLCB0aGVcbiAqIGF0dGVtcHRlZCBjb25zdHJ1Y3RvciBhcmdzIChjb3JlJ3MgZ2V0UHJvcHMgb2ZmIHRoZSBlcnJvcmVkIGluc3RhbmNlIOKAlFxuICogdGhlIGNhdWdodCBlcnJvciBJUyB0aGF0IGluc3RhbmNlKSBhbmQgdGhlIGFjdHVhbCBlcnJvciDigJQgcGx1cyBhbiBPVGVsXG4gKiBzcGFuIGNhcnJ5aW5nIHRoZSBleGNlcHRpb24sIHNvIHRoZSBmYWlsdXJlIGV4aXN0cyBpbiB0aGUgdHJhY2UgYmFja2VuZFxuICogdG9vIChhIE5lc3QtY2F1Z2h0IGJ1c2luZXNzIGVycm9yIG90aGVyd2lzZSBsZWF2ZXMgTk8gdHJhY2UgbWFyayBhdCBhbGwpLlxuICpcbiAqIFJlZ2lzdGVyIHBlci1yb3V0ZSAoQFVzZUZpbHRlcnMoTW5lbW9uaWNhRXhjZXB0aW9uRmlsdGVyKSkgb3IgZ2xvYmFsbHlcbiAqICh7IHByb3ZpZGU6IEFQUF9GSUxURVIsIHVzZUNsYXNzOiBNbmVtb25pY2FFeGNlcHRpb25GaWx0ZXIgfSkuIE5lc3Qnc1xuICogZmlsdGVyIHRpZXJpbmcgaXMgbmVhcmVzdC1zY29wZS1maXJzdCwgZmlyc3QgbWF0Y2ggd2lucywgbm8gY2hhaW5pbmcg4oCUXG4gKiBhIHJvdXRlLXNjb3BlZCBmaWx0ZXIgc2hhZG93cyB0aGUgZ2xvYmFsIG9uZS5cbiAqXG4gKiBEaXNjaXBsaW5lOlxuICogIC0gZXhwZWN0ZWQgY2xpZW50IGVycm9ycyAoSHR0cEV4Y2VwdGlvbiwgdmFsaWRhdGlvbiA0MDBzKSBrZWVwIE5lc3Qnc1xuICogICAgb3duIGFuc3dlciDigJQgdGhlIHRyYWNlIHRyZWF0bWVudCBpcyBmb3IgZ2VudWluZSBmYWlsdXJlcyBvbmx5O1xuICogIC0gdGVsZW1ldHJ5IGlzIFVOQ09ORElUSU9OQUwsIHRoZSBib2R5IGlzIENPTkRJVElPTkFMOiB3aGVuIHRoZVxuICogICAgaGFuZGxlciBhbHJlYWR5IHBvaXNvbmVkIHRoZSByZXNwb25zZSAocGFydGlhbCB3cml0ZSksIHRoZSBjbGllbnQnc1xuICogICAgbWlzbGVhZGluZyBzdGF0dXMgbGluZSBjYW5ub3QgYmUgdW5kb25lLCBidXQgc3Rkb3V0LCB0aGUgc3BhbiBhbmRcbiAqICAgIHRoZSBkaXZlIHRyYWNlIHN0aWxsIGdldCBldmVyeXRoaW5nO1xuICogIC0gbm9uLUVycm9yIHRocm93cyBhcmUgcmVwb3J0ZWQgdHJ1dGhmdWxseSBhcyBzdWNoLCBuZXZlciBkcmVzc2VkIHVwXG4gKiAgICBhcyBFcnJvcnMuXG4gKi9cbkBDYXRjaCgpXG5leHBvcnQgY2xhc3MgTW5lbW9uaWNhRXhjZXB0aW9uRmlsdGVyIGltcGxlbWVudHMgRXhjZXB0aW9uRmlsdGVyIHtcblx0Y2F0Y2ggKGVycm9yOiBFcnJvciwgaG9zdDogQXJndW1lbnRzSG9zdCk6IHZvaWQge1xuXHRcdGNvbnN0IGN0eCA9IGhvc3Quc3dpdGNoVG9IdHRwKCk7XG5cdFx0Y29uc3QgcmVzID0gY3R4LmdldFJlc3BvbnNlPFJlc3BvbnNlPigpO1xuXG5cdFx0Ly8gRXhwZWN0ZWQgY2xpZW50IGVycm9ycyBrZWVwIE5lc3QncyBvd24gYW5zd2VyLlxuXHRcdGlmIChlcnJvciBpbnN0YW5jZW9mIEh0dHBFeGNlcHRpb24pIHtcblx0XHRcdGNvbnN0IHN0YXR1cyA9IGVycm9yLmdldFN0YXR1cygpO1xuXHRcdFx0Y29uc3QgYm9keSA9IGVycm9yLmdldFJlc3BvbnNlKCk7XG5cdFx0XHRyZXMuc3RhdHVzKHN0YXR1cykuanNvbihib2R5KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpc0Vycm9yID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvcjtcblx0XHRjb25zdCBtZXNzYWdlID0gaXNFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBgbm9uLUVycm9yIHRocm93biAoJHt0eXBlb2YgZXJyb3J9KWA7XG5cdFx0Y29uc3QgZmxvdyA9IGlzRXJyb3IgPyBnZXRGbG93KGVycm9yKSA6IFtdO1xuXHRcdC8vIFRoZSBlcnJvcmVkIGNyZWF0ZSBlZGdlIGF0dHJpYnV0ZXMgdGhlIGNvbnN0cnVjdGlvbidzIFBBUkVOVFxuXHRcdC8vIGluc3RhbmNlIChwcm9iZWQgMjAyNi0wOS0wMzogZWRnZS5pbnN0YW5jZSA9PT0gZXhpc3RlbnRJbnN0YW5jZSkuXG5cdFx0Ly8gVGhlIGF0dGVtcHRlZCBjb25zdHJ1Y3RvciBBUkdTIHJpZGUgdGhlIGNhdWdodCBlcnJvciBpdHNlbGYg4oCUIGl0XG5cdFx0Ly8gSVMgdGhlIGVycm9yZWQgc2hlbGwsIGFuZCBnZXRQcm9wcyBleHBvc2VzIGl0cyBhcmdzIChzZWVcblx0XHQvLyBlcnJvcmVkQXJnc1NhZmUgYWJvdmUpLlxuXHRcdGNvbnN0IGVycm9yZWRFZGdlID0gWy4uLmZsb3ddLnJldmVyc2UoKS5maW5kKChlZGdlKSA9PiBlZGdlLmtpbmQgPT09ICdjcmVhdGUnICYmIGVkZ2Uuc3RhdHVzID09PSAnZXJyb3InKTtcblx0XHRjb25zdCBlcnJvcmVkSW5zdGFuY2UgPSBlcnJvcmVkRWRnZT8uaW5zdGFuY2U7XG5cdFx0Y29uc3QgYXR0ZW1wdGVkQXJncyA9IGlzRXJyb3IgPyBlcnJvcmVkQXJnc1NhZmUoZXJyb3IpIDogdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHJlcG9ydCA9IHtcblx0XHRcdGtpbmQgICAgICAgICAgICA6ICduZXN0LWNhdWdodC11bmJsaW5kZWQnLFxuXHRcdFx0bWVzc2FnZSxcblx0XHRcdGJyYW5jaCAgICAgICAgICA6IGZsb3cubWFwKChlZGdlKSA9PiBgJHtlZGdlLmtpbmR9OiR7ZWRnZS5uYW1lfWApLFxuXHRcdFx0ZXJyb3JlZFR5cGUgICAgIDogZXJyb3JlZEVkZ2U/Lm5hbWUgPz8gbnVsbCxcblx0XHRcdGVycm9yZWRJbnN0YW5jZSA6IGVycm9yZWRJbnN0YW5jZSA/IGV4dHJhY3RTYWZlKGVycm9yZWRJbnN0YW5jZSkgOiBudWxsLFxuXHRcdFx0YXR0ZW1wdGVkQXJncyAgIDogYXR0ZW1wdGVkQXJncyA/PyBudWxsLFxuXHRcdH07XG5cblx0XHQvLyBPVGVsOiBhbiBFUlJPUiBzcGFuIHdpdGggdGhlIHJlY29yZGVkIGV4Y2VwdGlvbiArIHRoZSBkaXZlIGJyYW5jaCDigJRcblx0XHQvLyBpbnNpZGUgdGhlIHJlcXVlc3QncyBhc3luYyBjb250ZXh0LCBzbyB0aGUgQUxTIGNvbnRleHQgbWFuYWdlclxuXHRcdC8vIHBhcmVudHMgaXQgdW5kZXIgdGhlIHJlcXVlc3Qgc3BhbiBvbiBpdHMgb3duLiBBIG5vbi1FcnJvciB0aHJvdyBpc1xuXHRcdC8vIHJlY29yZGVkIGFzIGFuIGF0dHJpYnV0ZTogcmVjb3JkRXhjZXB0aW9uIG9uIGEgY2lyY3VsYXIgb2JqZWN0XG5cdFx0Ly8gY291bGQgYnJlYWsgZXhwb3J0ZXIgc2VyaWFsaXphdGlvbi5cblx0XHRjb25zdCBzcGFuID0gdHJhY2UuZ2V0VHJhY2VyKCdAbW5lbW9uaWNhL25lc3RqcycpLnN0YXJ0U3BhbignbmVzdC5jYXVnaHQtZXhjZXB0aW9uJyk7XG5cdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2RpdmUuYnJhbmNoJywgcmVwb3J0LmJyYW5jaC5qb2luKCcg4oaSICcpKTtcblx0XHRpZiAocmVwb3J0LmVycm9yZWRUeXBlKSB7XG5cdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnbW5lbW9uaWNhLmVycm9yZWRfdHlwZScsIHJlcG9ydC5lcnJvcmVkVHlwZSk7XG5cdFx0fVxuXHRcdHNwYW4uc2V0U3RhdHVzKHsgY29kZTogU3BhblN0YXR1c0NvZGUuRVJST1IsIG1lc3NhZ2UgfSk7XG5cdFx0aWYgKGlzRXJyb3IpIHtcblx0XHRcdHNwYW4ucmVjb3JkRXhjZXB0aW9uKGVycm9yKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2V4Y2VwdGlvbi50eXBlJywgJ25vbi1FcnJvci10aHJvdycpO1xuXHRcdH1cblx0XHRzcGFuLmVuZCgpO1xuXG5cdFx0Ly8gVGhlIFt1bmJsaW5kXSBwcmVmaXggaXMgdGhlIGRlbW8gY29udHJhY3Qg4oCUIHRoZSB0YWN0aWNhLW5lc3Rqc1xuXHRcdC8vIFJVTkJPT0sgZ3JlcHMgZm9yIGV4YWN0bHkgdGhpcyBtYXJrZXIuXG5cdFx0Y29uc29sZS5sb2coYFt1bmJsaW5kXSAke3N0cmluZ2lmeVNhZmUocmVwb3J0KX1gKTtcblxuXHRcdC8vIFRlbGVtZXRyeSB1bmNvbmRpdGlvbmFsLCBib2R5IGNvbmRpdGlvbmFsOiBhIGhhbmRsZXIgdGhhdCBhbHJlYWR5XG5cdFx0Ly8gd3JvdGUgYSBwYXJ0aWFsIGFuc3dlciAoaGVhZGVycyBzZW50KSBrZWVwcyBpdHMgbWlzbGVhZGluZyBzdGF0dXNcblx0XHQvLyBsaW5lIOKAlCBub3RoaW5nIGNhbiB1bmNvbW1pdCBpdCDigJQgYnV0IHRoZSB0cmFjZSBhYm92ZSBzdGlsbCBsYW5kcy5cblx0XHRpZiAoIXJlcy5oZWFkZXJzU2VudCkge1xuXHRcdFx0cmVzLnN0YXR1cyg1MDApLmpzb24ocmVwb3J0KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0cmVzLmVuZCgpO1xuXHR9XG59XG4iXX0=
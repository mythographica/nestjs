"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const dive_1 = require("@mnemonica/dive");
const mnemonica_1 = require("mnemonica");
const api_1 = require("@opentelemetry/api");
/**
 * extract() that cannot throw inside an error path — non-mnemonica
 * values degrade to their key list.
 */
function extractSafe(instance) {
    try {
        const result = mnemonica_1.utils.extract(instance);
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
        const props = (0, mnemonica_1.getProps)(error);
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
        if (error instanceof common_1.HttpException) {
            const status = error.getStatus();
            const body = error.getResponse();
            res.status(status).json(body);
            return;
        }
        const isError = error instanceof Error;
        const message = isError ? error.message : `non-Error thrown (${typeof error})`;
        const flow = isError ? (0, dive_1.getFlow)(error) : [];
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
        const span = api_1.trace.getTracer('@mnemonica/nestjs').startSpan('nest.caught-exception');
        span.setAttribute('dive.branch', report.branch.join(' → '));
        if (report.erroredType) {
            span.setAttribute('mnemonica.errored_type', report.erroredType);
        }
        span.setStatus({ code: api_1.SpanStatusCode.ERROR, message });
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
exports.MnemonicaExceptionFilter = MnemonicaExceptionFilter;
exports.MnemonicaExceptionFilter = MnemonicaExceptionFilter = __decorate([
    (0, common_1.Catch)()
], MnemonicaExceptionFilter);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLWV4Y2VwdGlvbi5maWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmlsdGVycy9tbmVtb25pY2EtZXhjZXB0aW9uLmZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwyQ0FBc0Q7QUFHdEQsMENBQTBDO0FBQzFDLHlDQUE0QztBQUM1Qyw0Q0FBMkQ7QUFFM0Q7OztHQUdHO0FBQ0gsU0FBUyxXQUFXLENBQUUsUUFBZ0I7SUFDckMsSUFBSSxDQUFDO1FBQ0osTUFBTSxNQUFNLEdBQUcsaUJBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1IsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7QUFDRixDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFTLGVBQWUsQ0FBRSxLQUFZO0lBQ3JDLElBQUksQ0FBQztRQUNKLE1BQU0sS0FBSyxHQUFHLElBQUEsb0JBQVEsRUFBQyxLQUFLLENBQW1DLENBQUM7UUFDaEUsTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQztRQUMzQixPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFBQyxNQUFNLENBQUM7UUFDUixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDekIsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0FBQ0YsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGFBQWEsQ0FBRSxLQUFjO0lBQ3JDLElBQUksQ0FBQztRQUNKLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1IsTUFBTSxN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LEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksT0FBTyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUM7YUFBTSxDQUFDO1lBQ1AsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFDRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWCxpRUFBaUU7UUFDakUseUNBQXlDO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWxELG9FQUFvRTtRQUNwRSxvRUFBb0U7UUFDcEUsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0IsT0FBTztRQUNSLENBQUM7UUFDRCxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDWCxDQUFDO0NBQ0QsQ0FBQTtBQWhFWSw0REFBd0I7bUNBQXhCLHdCQUF3QjtJQURwQyxJQUFBLGNBQUssR0FBRTtHQUNLLHdCQUF3QixDQWdFcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXRjaCwgSHR0cEV4Y2VwdGlvbiB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB0eXBlIHsgRXhjZXB0aW9uRmlsdGVyLCBBcmd1bWVudHNIb3N0IH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHR5cGUgeyBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgZ2V0RmxvdyB9IGZyb20gJ0BtbmVtb25pY2EvZGl2ZSc7XG5pbXBvcnQgeyB1dGlscywgZ2V0UHJvcHMgfSBmcm9tICdtbmVtb25pY2EnO1xuaW1wb3J0IHsgdHJhY2UsIFNwYW5TdGF0dXNDb2RlIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvYXBpJztcblxuLyoqXG4gKiBleHRyYWN0KCkgdGhhdCBjYW5ub3QgdGhyb3cgaW5zaWRlIGFuIGVycm9yIHBhdGgg4oCUIG5vbi1tbmVtb25pY2FcbiAqIHZhbHVlcyBkZWdyYWRlIHRvIHRoZWlyIGtleSBsaXN0LlxuICovXG5mdW5jdGlvbiBleHRyYWN0U2FmZSAoaW5zdGFuY2U6IG9iamVjdCk6IHVua25vd24ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHV0aWxzLmV4dHJhY3QoaW5zdGFuY2UpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2gge1xuXHRcdGNvbnN0IHJlc3VsdCA9IE9iamVjdC5rZXlzKGluc3RhbmNlKTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cbi8qKlxuICogVGhlIGF0dGVtcHRlZCBjb25zdHJ1Y3RvciBhcmdzIG9mIGEgRkFJTEVEIG1uZW1vbmljYSBjb25zdHJ1Y3Rpb24gcmlkZVxuICogdGhlIGVycm9yZWQgaW5zdGFuY2UgaXRzZWxmOiB0aGUgY2F1Z2h0IG9iamVjdCBJUyB0aGUgZXJyb3JlZCBzaGVsbFxuICogKHByb2JlZCAyMDI2LTA5LTAzOiBjYXVnaHQgPT09IGNyZWF0aW9uRXJyb3IncyBpbmhlcml0ZWRJbnN0YW5jZSxcbiAqIGluc3RhbmNlb2YgRXJyb3IgdmlhIHRoZSBzcGxpY2VkIHByb3RvdHlwZSBjaGFpbiksIGFuZCBjb3JlJ3Mgb3duXG4gKiBnZXRQcm9wcyBleHBvc2VzIHsgYXJncywgb3JpZ2luYWxFcnJvciwg4oCmIH0gb2ZmIHRoZSBwcm9wcyBXZWFrTWFwLlxuICogUGxhaW4gZXJyb3JzIHlpZWxkIHVuZGVmaW5lZDsgYW55dGhpbmcgdW5leHBlY3RlZCBkZWdyYWRlcywgbmV2ZXJcbiAqIHRocm93cyBpbnNpZGUgYSBmaWx0ZXIuXG4gKi9cbmZ1bmN0aW9uIGVycm9yZWRBcmdzU2FmZSAoZXJyb3I6IEVycm9yKTogdW5rbm93biB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcHJvcHMgPSBnZXRQcm9wcyhlcnJvcikgYXMgeyBhcmdzPzogdW5rbm93biB9IHwgdW5kZWZpbmVkO1xuXHRcdGNvbnN0IHJlc3VsdCA9IHByb3BzPy5hcmdzO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2gge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cbi8qKlxuICogSlNPTi5zdHJpbmdpZnkgdGhhdCBjYW5ub3QgdGhyb3cgaW5zaWRlIGFuIGVycm9yIHBhdGgg4oCUIGNpcmN1bGFyIG9yXG4gKiBob3N0aWxlIHZhbHVlcyBkZWdyYWRlIHRvIGEgbWFya2VyIGluc3RlYWQgb2YgY3Jhc2hpbmcgdGhlIGZpbHRlclxuICogKGEgdGhyb3dpbmcgZmlsdGVyIGlzIGV4YWN0bHkgdGhlIGNhc2NhZGUgdGhpcyBkZW1vIGZpZ2h0cykuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ2lmeVNhZmUgKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBjYXRjaCB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gJ1wiW3Vuc2VyaWFsaXphYmxlIHJlcG9ydCBwYXlsb2FkXVwiJztcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59XG5cbi8qKlxuICogVGhlIFVuYmxpbmRlciAoMjAyNi0wOS0wMywgVmlrdG9yKTogdGVhY2hlcyBOZXN0J3MgZXJyb3IgYm91bmRhcnkgdG9cbiAqIHNwZWFrIHRyYWNlIGluc3RlYWQgb2Ygc2VydmluZyB0aGUgYmxpbmQgZGVmYXVsdFxuICoge1wic3RhdHVzQ29kZVwiOjUwMCxcIm1lc3NhZ2VcIjpcIkludGVybmFsIHNlcnZlciBlcnJvclwifS5cbiAqXG4gKiBBbnN3ZXJzIDUwMCB3aXRoIHRoZSBkaXZlIGJyYW5jaCwgdGhlIGVycm9yZWQgY29uc3RydWN0aW9uIGVkZ2UsIHRoZVxuICogYXR0ZW1wdGVkIGNvbnN0cnVjdG9yIGFyZ3MgKGNvcmUncyBnZXRQcm9wcyBvZmYgdGhlIGVycm9yZWQgaW5zdGFuY2Ug4oCUXG4gKiB0aGUgY2F1Z2h0IGVycm9yIElTIHRoYXQgaW5zdGFuY2UpIGFuZCB0aGUgYWN0dWFsIGVycm9yIOKAlCBwbHVzIGFuIE9UZWxcbiAqIHNwYW4gY2FycnlpbmcgdGhlIGV4Y2VwdGlvbiwgc28gdGhlIGZhaWx1cmUgZXhpc3RzIGluIHRoZSB0cmFjZSBiYWNrZW5kXG4gKiB0b28gKGEgTmVzdC1jYXVnaHQgYnVzaW5lc3MgZXJyb3Igb3RoZXJ3aXNlIGxlYXZlcyBOTyB0cmFjZSBtYXJrIGF0IGFsbCkuXG4gKlxuICogUmVnaXN0ZXIgcGVyLXJvdXRlIChAVXNlRmlsdGVycyhNbmVtb25pY2FFeGNlcHRpb25GaWx0ZXIpKSBvciBnbG9iYWxseVxuICogKHsgcHJvdmlkZTogQVBQX0ZJTFRFUiwgdXNlQ2xhc3M6IE1uZW1vbmljYUV4Y2VwdGlvbkZpbHRlciB9KS4gTmVzdCdzXG4gKiBmaWx0ZXIgdGllcmluZyBpcyBuZWFyZXN0LXNjb3BlLWZpcnN0LCBmaXJzdCBtYXRjaCB3aW5zLCBubyBjaGFpbmluZyDigJRcbiAqIGEgcm91dGUtc2NvcGVkIGZpbHRlciBzaGFkb3dzIHRoZSBnbG9iYWwgb25lLlxuICpcbiAqIERpc2NpcGxpbmU6XG4gKiAgLSBleHBlY3RlZCBjbGllbnQgZXJyb3JzIChIdHRwRXhjZXB0aW9uLCB2YWxpZGF0aW9uIDQwMHMpIGtlZXAgTmVzdCdzXG4gKiAgICBvd24gYW5zd2VyIOKAlCB0aGUgdHJhY2UgdHJlYXRtZW50IGlzIGZvciBnZW51aW5lIGZhaWx1cmVzIG9ubHk7XG4gKiAgLSB0ZWxlbWV0cnkgaXMgVU5DT05ESVRJT05BTCwgdGhlIGJvZHkgaXMgQ09ORElUSU9OQUw6IHdoZW4gdGhlXG4gKiAgICBoYW5kbGVyIGFscmVhZHkgcG9pc29uZWQgdGhlIHJlc3BvbnNlIChwYXJ0aWFsIHdyaXRlKSwgdGhlIGNsaWVudCdzXG4gKiAgICBtaXNsZWFkaW5nIHN0YXR1cyBsaW5lIGNhbm5vdCBiZSB1bmRvbmUsIGJ1dCBzdGRvdXQsIHRoZSBzcGFuIGFuZFxuICogICAgdGhlIGRpdmUgdHJhY2Ugc3RpbGwgZ2V0IGV2ZXJ5dGhpbmc7XG4gKiAgLSBub24tRXJyb3IgdGhyb3dzIGFyZSByZXBvcnRlZCB0cnV0aGZ1bGx5IGFzIHN1Y2gsIG5ldmVyIGRyZXNzZWQgdXBcbiAqICAgIGFzIEVycm9ycy5cbiAqL1xuQENhdGNoKClcbmV4cG9ydCBjbGFzcyBNbmVtb25pY2FFeGNlcHRpb25GaWx0ZXIgaW1wbGVtZW50cyBFeGNlcHRpb25GaWx0ZXIge1xuXHRjYXRjaCAoZXJyb3I6IEVycm9yLCBob3N0OiBBcmd1bWVudHNIb3N0KTogdm9pZCB7XG5cdFx0Y29uc3QgY3R4ID0gaG9zdC5zd2l0Y2hUb0h0dHAoKTtcblx0XHRjb25zdCByZXMgPSBjdHguZ2V0UmVzcG9uc2U8UmVzcG9uc2U+KCk7XG5cblx0XHQvLyBFeHBlY3RlZCBjbGllbnQgZXJyb3JzIGtlZXAgTmVzdCdzIG93biBhbnN3ZXIuXG5cdFx0aWYgKGVycm9yIGluc3RhbmNlb2YgSHR0cEV4Y2VwdGlvbikge1xuXHRcdFx0Y29uc3Qgc3RhdHVzID0gZXJyb3IuZ2V0U3RhdHVzKCk7XG5cdFx0XHRjb25zdCBib2R5ID0gZXJyb3IuZ2V0UmVzcG9uc2UoKTtcblx0XHRcdHJlcy5zdGF0dXMoc3RhdHVzKS5qc29uKGJvZHkpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlzRXJyb3IgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yO1xuXHRcdGNvbnN0IG1lc3NhZ2UgPSBpc0Vycm9yID8gZXJyb3IubWVzc2FnZSA6IGBub24tRXJyb3IgdGhyb3duICgke3R5cGVvZiBlcnJvcn0pYDtcblx0XHRjb25zdCBmbG93ID0gaXNFcnJvciA/IGdldEZsb3coZXJyb3IpIDogW107XG5cdFx0Ly8gVGhlIGVycm9yZWQgY3JlYXRlIGVkZ2UgYXR0cmlidXRlcyB0aGUgY29uc3RydWN0aW9uJ3MgUEFSRU5UXG5cdFx0Ly8gaW5zdGFuY2UgKHByb2JlZCAyMDI2LTA5LTAzOiBlZGdlLmluc3RhbmNlID09PSBleGlzdGVudEluc3RhbmNlKS5cblx0XHQvLyBUaGUgYXR0ZW1wdGVkIGNvbnN0cnVjdG9yIEFSR1MgcmlkZSB0aGUgY2F1Z2h0IGVycm9yIGl0c2VsZiDigJQgaXRcblx0XHQvLyBJUyB0aGUgZXJyb3JlZCBzaGVsbCwgYW5kIGdldFByb3BzIGV4cG9zZXMgaXRzIGFyZ3MgKHNlZVxuXHRcdC8vIGVycm9yZWRBcmdzU2FmZSBhYm92ZSkuXG5cdFx0Y29uc3QgZXJyb3JlZEVkZ2UgPSBbLi4uZmxvd10ucmV2ZXJzZSgpLmZpbmQoKGVkZ2UpID0+IGVkZ2Uua2luZCA9PT0gJ2NyZWF0ZScgJiYgZWRnZS5zdGF0dXMgPT09ICdlcnJvcicpO1xuXHRcdGNvbnN0IGVycm9yZWRJbnN0YW5jZSA9IGVycm9yZWRFZGdlPy5pbnN0YW5jZTtcblx0XHRjb25zdCBhdHRlbXB0ZWRBcmdzID0gaXNFcnJvciA/IGVycm9yZWRBcmdzU2FmZShlcnJvcikgOiB1bmRlZmluZWQ7XG5cdFx0Y29uc3QgcmVwb3J0ID0ge1xuXHRcdFx0a2luZCAgICAgICAgICAgIDogJ25lc3QtY2F1Z2h0LXVuYmxpbmRlZCcsXG5cdFx0XHRtZXNzYWdlLFxuXHRcdFx0YnJhbmNoICAgICAgICAgIDogZmxvdy5tYXAoKGVkZ2UpID0+IGAke2VkZ2Uua2luZH06JHtlZGdlLm5hbWV9YCksXG5cdFx0XHRlcnJvcmVkVHlwZSAgICAgOiBlcnJvcmVkRWRnZT8ubmFtZSA/PyBudWxsLFxuXHRcdFx0ZXJyb3JlZEluc3RhbmNlIDogZXJyb3JlZEluc3RhbmNlID8gZXh0cmFjdFNhZmUoZXJyb3JlZEluc3RhbmNlKSA6IG51bGwsXG5cdFx0XHRhdHRlbXB0ZWRBcmdzICAgOiBhdHRlbXB0ZWRBcmdzID8/IG51bGwsXG5cdFx0fTtcblxuXHRcdC8vIE9UZWw6IGFuIEVSUk9SIHNwYW4gd2l0aCB0aGUgcmVjb3JkZWQgZXhjZXB0aW9uICsgdGhlIGRpdmUgYnJhbmNoIOKAlFxuXHRcdC8vIGluc2lkZSB0aGUgcmVxdWVzdCdzIGFzeW5jIGNvbnRleHQsIHNvIHRoZSBBTFMgY29udGV4dCBtYW5hZ2VyXG5cdFx0Ly8gcGFyZW50cyBpdCB1bmRlciB0aGUgcmVxdWVzdCBzcGFuIG9uIGl0cyBvd24uIEEgbm9uLUVycm9yIHRocm93IGlzXG5cdFx0Ly8gcmVjb3JkZWQgYXMgYW4gYXR0cmlidXRlOiByZWNvcmRFeGNlcHRpb24gb24gYSBjaXJjdWxhciBvYmplY3Rcblx0XHQvLyBjb3VsZCBicmVhayBleHBvcnRlciBzZXJpYWxpemF0aW9uLlxuXHRcdGNvbnN0IHNwYW4gPSB0cmFjZS5nZXRUcmFjZXIoJ0BtbmVtb25pY2EvbmVzdGpzJykuc3RhcnRTcGFuKCduZXN0LmNhdWdodC1leGNlcHRpb24nKTtcblx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnZGl2ZS5icmFuY2gnLCByZXBvcnQuYnJhbmNoLmpvaW4oJyDihpIgJykpO1xuXHRcdGlmIChyZXBvcnQuZXJyb3JlZFR5cGUpIHtcblx0XHRcdHNwYW4uc2V0QXR0cmlidXRlKCdtbmVtb25pY2EuZXJyb3JlZF90eXBlJywgcmVwb3J0LmVycm9yZWRUeXBlKTtcblx0XHR9XG5cdFx0c3Bhbi5zZXRTdGF0dXMoeyBjb2RlOiBTcGFuU3RhdHVzQ29kZS5FUlJPUiwgbWVzc2FnZSB9KTtcblx0XHRpZiAoaXNFcnJvcikge1xuXHRcdFx0c3Bhbi5yZWNvcmRFeGNlcHRpb24oZXJyb3IpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnZXhjZXB0aW9uLnR5cGUnLCAnbm9uLUVycm9yLXRocm93Jyk7XG5cdFx0fVxuXHRcdHNwYW4uZW5kKCk7XG5cblx0XHQvLyBUaGUgW3VuYmxpbmRdIHByZWZpeCBpcyB0aGUgZGVtbyBjb250cmFjdCDigJQgdGhlIHRhY3RpY2EtbmVzdGpzXG5cdFx0Ly8gUlVOQk9PSyBncmVwcyBmb3IgZXhhY3RseSB0aGlzIG1hcmtlci5cblx0XHRjb25zb2xlLmxvZyhgW3VuYmxpbmRdICR7c3RyaW5naWZ5U2FmZShyZXBvcnQpfWApO1xuXG5cdFx0Ly8gVGVsZW1ldHJ5IHVuY29uZGl0aW9uYWwsIGJvZHkgY29uZGl0aW9uYWw6IGEgaGFuZGxlciB0aGF0IGFscmVhZHlcblx0XHQvLyB3cm90ZSBhIHBhcnRpYWwgYW5zd2VyIChoZWFkZXJzIHNlbnQpIGtlZXBzIGl0cyBtaXNsZWFkaW5nIHN0YXR1c1xuXHRcdC8vIGxpbmUg4oCUIG5vdGhpbmcgY2FuIHVuY29tbWl0IGl0IOKAlCBidXQgdGhlIHRyYWNlIGFib3ZlIHN0aWxsIGxhbmRzLlxuXHRcdGlmICghcmVzLmhlYWRlcnNTZW50KSB7XG5cdFx0XHRyZXMuc3RhdHVzKDUwMCkuanNvbihyZXBvcnQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRyZXMuZW5kKCk7XG5cdH1cbn1cbiJdfQ==
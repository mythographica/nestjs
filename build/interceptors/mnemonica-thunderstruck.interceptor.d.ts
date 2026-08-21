/**
 * NestJS interceptor that feeds the raw HTTP boundary payload into dive's
 * Thunderstruck collector BEFORE any mnemonica construction happens.
 *
 * Per request it stores `{ method, url, params, query, body, headers }` and
 * stamps the params / query / body / headers objects so pipes and construct
 * handlers correlate the payload by object identity (see
 * thunderstruck/pre-root.ts). Headers are fed on purpose: they carry the
 * correlation ids (traceparent, x-request-id, …) that stitch pre-root
 * forensics to upstream traces. The record mirrors the request — detail
 * reduction / redaction is a separate concern.
 *
 * With `storeRequest` the raw request object itself is linked into the
 * record (`raw.request`) and stamped as a correlation key, so code holding
 * only the request — an exception filter, say — resolves getPreRoot(req).
 * Retention is unchanged: the record still dies with the request objects.
 *
 * The config arrives through DI (MNEMONICA_THUNDERSTRUCK_OPTIONS), never
 * through a plain constructor parameter: design:paramtypes would make Nest
 * try to resolve it as a provider and break class-based wiring in contexts
 * where the token was never registered. @Optional() keeps the defaults
 * there — e.g. per-controller @UseInterceptors(mti) runs without the
 * request link; the flag is a forRoot option.
 */
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import type { Observable } from 'rxjs';
export interface ThunderstruckOptions {
    /**
     * Link the raw request object into the pre-root record (`raw.request`)
     * AND stamp it as a correlation key, so getPreRoot(req) resolves from
     * anywhere the request is reachable — e.g. an exception filter holding
     * only @Req(). Retention is unchanged: the record dies with the request.
     */
    storeRequest?: boolean;
}
export declare class MnemonicaThunderstruckInterceptor implements NestInterceptor {
    private readonly storeRequest;
    constructor(options?: ThunderstruckOptions | null);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
//# sourceMappingURL=mnemonica-thunderstruck.interceptor.d.ts.map
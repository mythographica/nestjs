/**
 * NestJS interceptor that auto-calls .extract() on mnemonica instances
 * before JSON serialization. Controllers can return typed instances
 * directly without manual flattening.
 */
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class MnemonicaSerializerInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
//# sourceMappingURL=mnemonica-serializer.interceptor.d.ts.map
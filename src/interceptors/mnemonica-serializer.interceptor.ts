/**
 * NestJS interceptor that auto-calls .extract() on mnemonica instances
 * before JSON serialization. Controllers can return typed instances
 * directly without manual flattening.
 */
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isMnemonicaInstance } from '../utils/is-mnemonica-instance.js';

@Injectable()
export class MnemonicaSerializerInterceptor implements NestInterceptor {
	intercept (_context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			map((value: unknown) => {
				if (isMnemonicaInstance(value) && typeof value.extract === 'function') {
					return value.extract();
				}
				return value;
			}),
		);
	}
}

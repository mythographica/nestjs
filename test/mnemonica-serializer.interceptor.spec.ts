import { describe, it, expect } from 'vitest';
import { of, lastValueFrom } from 'rxjs';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host.js';
import { MnemonicaSerializerInterceptor } from '../src/interceptors/mnemonica-serializer.interceptor.js';
import { define } from 'mnemonica/module';

describe('MnemonicaSerializerInterceptor', () => {
	const interceptor = new MnemonicaSerializerInterceptor();

	it('calls .extract() on mnemonica instances', async () => {
		const MyType = define('MyType', function (this: { x: number }, val: number) {
			this.x = val;
		});
		const instance = new MyType(42);

		const context = new ExecutionContextHost([]);
		const observable = interceptor.intercept(context, { handle: () => of(instance) });
		const result = await lastValueFrom(observable);

		expect(result).toEqual({ x: 42 });
	});

	it('passes through plain objects unchanged', async () => {
		const plain = { x: 42 };
		const context = new ExecutionContextHost([]);
		const observable = interceptor.intercept(context, { handle: () => of(plain) });
		const result = await lastValueFrom(observable);

		expect(result).toBe(plain);
	});

	it('passes through arrays unchanged', async () => {
		const arr = [1, 2, 3];
		const context = new ExecutionContextHost([]);
		const observable = interceptor.intercept(context, { handle: () => of(arr) });
		const result = await lastValueFrom(observable);

		expect(result).toBe(arr);
	});

	it('passes through null unchanged', async () => {
		const context = new ExecutionContextHost([]);
		const observable = interceptor.intercept(context, { handle: () => of(null) });
		const result = await lastValueFrom(observable);

		expect(result).toBeNull();
	});
});

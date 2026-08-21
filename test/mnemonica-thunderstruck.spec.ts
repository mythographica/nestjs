/**
 * Thunderstruck wiring: interceptor feeds the raw boundary payload, the
 * validation pipe attaches the validated DTO, and construct handlers
 * correlate both by OBJECT IDENTITY via getPreRoot(data) — no ALS, no races.
 *
 * Lifetime semantics: payloads live inside a WeakMap keyed on the request
 * objects — retention IS the request's lifetime. There is no release step:
 * when the request objects are garbage-collected, the payloads go with them.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { of } from 'rxjs';
import type { ExecutionContext, CallHandler } from '@nestjs/common';
import { IsString, IsInt } from 'class-validator';
import { createTypesCollection, defaultTypes } from 'mnemonica/module';
import { clear, getFlow } from '@mnemonica/dive';
import { attachHooks } from '../src/index.js';

import { MnemonicaThunderstruckInterceptor } from '../src/interceptors/mnemonica-thunderstruck.interceptor.js';
import { MnemonicaValidationPipe } from '../src/pipes/mnemonica-validation.pipe.js';
import { getPreRoot, type PreRootData } from '../src/thunderstruck/pre-root.js';
import { MnemonicaModule } from '../src/mnemonica.module.js';
import { MNEMONICA_THUNDERSTRUCK_OPTIONS } from '../src/tokens.js';
import { APP_INTERCEPTOR } from '@nestjs/core';

class ThunderDto {
	@IsString()
	name!: string;

	@IsInt()
	age!: number;
}

const httpContext = (req: unknown): ExecutionContext => ({
	getType      : () => 'http',
	switchToHttp : () => ({ getRequest: () => req }),
}) as unknown as ExecutionContext;

const nullHandler = { handle: () => of(null) } as unknown as CallHandler;

const runBoundary = (req: object): void => {
	const interceptor = new MnemonicaThunderstruckInterceptor();
	interceptor.intercept(httpContext(req), nullHandler);
};

describe('MnemonicaThunderstruckInterceptor', () => {
	beforeEach(() => clear());

	it('feeds the raw request; body, query and headers correlate to the same payload', () => {
		const body = { hello: 'world' };
		const query = { page: '2' };
		const headers = { traceparent: '00-abc-def-01', 'x-request-id': 'req-1' };
		const req = { method: 'POST', url: '/x', params: { id: '1' }, query, body, headers };

		runBoundary(req);

		const viaBody = getPreRoot(body);
		const viaQuery = getPreRoot(query);
		const viaHeaders = getPreRoot(headers);
		expect(viaBody?.raw).toEqual({
			method : 'POST',
			url    : '/x',
			params : { id: '1' },
			query,
			body,
			headers,
		});
		expect(viaQuery?.raw).toEqual(viaBody?.raw);
		expect(viaHeaders?.raw).toEqual(viaBody?.raw);
	});

	it('ignores non-http contexts', () => {
		const wsContext = { getType: () => 'ws' } as unknown as ExecutionContext;
		const interceptor = new MnemonicaThunderstruckInterceptor();
		interceptor.intercept(wsContext, nullHandler);
		expect(getPreRoot({ anything: 'unstamped' })).toBeUndefined();
	});

	it('storeRequest off (default): the request is neither linked nor stamped', () => {
		const body = { hello: 'world' };
		const req = { method: 'GET', url: '/y', params: {}, query: {}, body, headers: {} };

		runBoundary(req);

		const raw = getPreRoot(body)?.raw as Record<string, unknown>;
		expect(raw.request).toBeUndefined();
		expect(getPreRoot(req)).toBeUndefined();
	});

	it('storeRequest on: links the full request and stamps it as a correlation key', () => {
		const body = { hello: 'world' };
		const headers = { 'x-request-id': 'req-9' };
		const req = { method: 'PUT', url: '/z', params: {}, query: {}, body, headers };

		const interceptor = new MnemonicaThunderstruckInterceptor({ storeRequest: true });
		interceptor.intercept(httpContext(req), nullHandler);

		const raw = getPreRoot(body)?.raw as Record<string, unknown>;
		expect(raw.request).toBe(req);
		// the request itself resolves — an exception filter holding only
		// @Req() can still report WHICH data caused the failure
		expect(getPreRoot(req)?.raw).toBe(raw);
	});
});

describe('getPreRoot', () => {
	beforeEach(() => clear());

	it('returns undefined for unknown objects and primitives', () => {
		runBoundary({ method: 'GET', url: '/y', query: {}, body: {} });
		expect(getPreRoot({ not: 'stamped' })).toBeUndefined();
		expect(getPreRoot('primitive')).toBeUndefined();
		expect(getPreRoot(null)).toBeUndefined();
	});
});

describe('thunderstruck full path: interceptor → pipe → construction', () => {
	beforeEach(() => clear());

	it('construct handler sees raw + validated; payloads outlive construction', async () => {
		const collection = createTypesCollection();
		attachHooks(collection);

		let seenInCtor: PreRootData | undefined;
		const Entity = collection.define('ThunderEntity', function (this: Record<string, unknown>, data: Record<string, unknown>) {
			seenInCtor = getPreRoot(data);
			Object.assign(this, data);
			if (seenInCtor?.raw !== undefined) {
				this.preRootRaw = seenInCtor.raw;
			}
			if (seenInCtor?.validated !== undefined) {
				this.preRootValidated = seenInCtor.validated;
			}
		});

		const body = { name: 'Alice', age: 30 };
		runBoundary({ method: 'POST', url: '/users', params: {}, query: {}, body });

		const pipe = MnemonicaValidationPipe.forType(Entity as never, ThunderDto);
		const result = await pipe.transform(body, { type: 'body' } as never) as Record<string, unknown>;

		// During construction both payloads were resolvable by object identity
		expect(seenInCtor?.raw).toMatchObject({ method: 'POST', url: '/users', body });
		expect(seenInCtor?.validated).toMatchObject({ name: 'Alice', age: 30 });

		// Wired data lives on with the instance…
		expect(result.preRootRaw).toBeDefined();
		expect(result.preRootValidated).toBeDefined();
		// …and the record stays resolvable while the request object lives —
		// an exception filter can still report WHICH DATA failed
		expect(getPreRoot(body)?.raw).toBeDefined();
		expect(getPreRoot(body)?.validated).toBeDefined();
	});

	it('pipe without the interceptor: constructs fine, feeds nothing', async () => {
		const collection = createTypesCollection();
		attachHooks(collection);

		let seenInCtor: PreRootData | undefined;
		const Lone = collection.define('LoneEntity', function (this: Record<string, unknown>, data: Record<string, unknown>) {
			seenInCtor = getPreRoot(data);
			Object.assign(this, data);
		});

		const pipe = MnemonicaValidationPipe.forType(Lone as never, ThunderDto);
		const result = await pipe.transform({ name: 'Bob', age: 40 }, { type: 'body' } as never);

		expect(result).toBeInstanceOf(Lone);
		expect(seenInCtor).toBeUndefined();
	});

	it('creationError keeps the payloads resolvable — that data is the forensics', async () => {
		const collection = createTypesCollection();
		attachHooks(collection);

		collection.define('FailingEntity', function (this: Record<string, unknown>) {
			throw new Error('ctor boom');
		});
		const Failing = collection.lookup('FailingEntity')!;

		const body = { name: 'Carol', age: 25 };
		runBoundary({ method: 'POST', url: '/fail', params: {}, query: {}, body });

		const pipe = MnemonicaValidationPipe.forType(Failing as never, ThunderDto);
		await expect(pipe.transform(body, { type: 'body' } as never)).rejects.toThrow('ctor boom');

		// raw + validated both survive the failure — that data is the forensics
		expect(getPreRoot(body)?.raw).toMatchObject({ method: 'POST', url: '/fail' });
		expect(getPreRoot(body)?.validated).toMatchObject({ name: 'Carol', age: 25 });
	});
});

describe('MnemonicaModule.forRoot({ thunderstruck: true })', () => {
	const findProvider = (dynamicModule: { providers?: unknown[] }, token: unknown) => {
		const provider = (dynamicModule.providers ?? []).find(
			(candidate) => typeof candidate === 'object' && candidate !== null
				&& (candidate as { provide?: unknown }).provide === token,
		);
		return provider as Record<string, unknown> | undefined;
	};

	it('registers the interceptor globally and attaches dive hooks', () => {
		const dynamicModule = MnemonicaModule.forRoot({ thunderstruck: true });

		const interceptorProvider = findProvider(dynamicModule, APP_INTERCEPTOR);
		expect(interceptorProvider?.useClass).toBe(MnemonicaThunderstruckInterceptor);

		// attachHooks(defaultTypes) happened: a root construction records a
		// 'create' edge on the instance's branch
		const Probe = defaultTypes.define('ThunderstruckModuleProbe', function (this: Record<string, unknown>) {
			this.ok = true;
		});
		const probe = new Probe();
		const flow = getFlow(probe);
		expect(
			flow.some((edge) => edge.kind === 'create' && edge.name === 'ThunderstruckModuleProbe'),
		).toBe(true);
	});

	it('forRoot({ thunderstruck: { storeRequest: true } }) passes the options via the DI token', () => {
		const dynamicModule = MnemonicaModule.forRoot({ thunderstruck: { storeRequest: true } });

		const interceptorProvider = findProvider(dynamicModule, APP_INTERCEPTOR);
		expect(interceptorProvider?.useClass).toBe(MnemonicaThunderstruckInterceptor);

		// the flag reaches the interceptor through MNEMONICA_THUNDERSTRUCK_OPTIONS —
		// never through a bare constructor parameter, which design:paramtypes
		// would surface as Object and break Nest's class-based instantiation
		const optionsProvider = findProvider(dynamicModule, MNEMONICA_THUNDERSTRUCK_OPTIONS);
		expect(optionsProvider?.useValue).toEqual({ storeRequest: true });
	});
});

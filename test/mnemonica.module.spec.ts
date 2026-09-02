import { describe, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { MnemonicaModule, InjectMnemonicaCollection, MNEMONICA_COLLECTION, DEFAULT_TRACE_LIMIT } from '../src/index.js';
import { defaultTypes, createTypesCollection } from 'mnemonica/module';
import type { TypesCollection } from 'mnemonica/module';
import { wrap, getFlow, setTraceLimit, clear } from '@mnemonica/dive';
import { Injectable } from '@nestjs/common';

@Injectable()
class TestService {
	constructor (
		@InjectMnemonicaCollection() public collection: TypesCollection,
	) {}
}

@Injectable()
class FeatureService {
	constructor (
		@InjectMnemonicaCollection('payments') public collection: TypesCollection,
	) {}
}

@Injectable()
class OrdersService {
	constructor (
		@InjectMnemonicaCollection('orders') public collection: TypesCollection,
	) {}
}

describe('MnemonicaModule', () => {
	it('forRoot registers default collection', async () => {
		const module = await Test.createTestingModule({
			imports : [MnemonicaModule.forRoot()],
			providers : [TestService],
		}).compile();

		const service = module.get(TestService);
		expect(service.collection).toBe(defaultTypes);
	});

	it('forRoot accepts custom collection', async () => {
		const custom = createTypesCollection();
		const module = await Test.createTestingModule({
			imports : [MnemonicaModule.forRoot({ collection: custom })],
			providers : [TestService],
		}).compile();

		const service = module.get(TestService);
		expect(service.collection).toBe(custom);
	});

	it('forFeature creates isolated collection', async () => {
		const module = await Test.createTestingModule({
			imports : [MnemonicaModule.forFeature('payments')],
			providers : [FeatureService],
		}).compile();

		const service = module.get(FeatureService);
		expect(service.collection === defaultTypes).toBe(false);
		expect(service.collection).toBeDefined();
	});

	it('forFeature passes config to createTypesCollection', async () => {
		const module = await Test.createTestingModule({
			imports : [MnemonicaModule.forFeature('orders', { strictChain: false })],
			providers : [OrdersService],
		}).compile();

		const service = module.get(OrdersService);
		expect(service.collection).toBeDefined();
		// Collection was created with the provided config
		expect(service.collection === defaultTypes).toBe(false);
	});

	it('forRoot({ traceLimit }) bounds the dive trace; the default is exported', async () => {
		clear();
		// Re-pinned 2026-09-02: dive's default went unbounded (GC-driven
		// retention via weak refs); 1024 was the pre-flip bound.
		expect(DEFAULT_TRACE_LIMIT).toBe(Number.MAX_SAFE_INTEGER);

		await Test.createTestingModule({
			imports : [MnemonicaModule.forRoot({ traceLimit: 3 })],
		}).compile();

		const ctx = { id: 'trace-limit-ctx' };
		const step = wrap(() => 1, ctx);
		for (let i = 0; i < 5; i++) {
			step();
		}

		// 5 invocations, ring of 3 — the branch is truncated at the bound
		expect(getFlow(ctx).length).toBe(3);

		// restore the default for the rest of the suite
		setTraceLimit(DEFAULT_TRACE_LIMIT);
		clear();
	});

	it('forRoot({ traceLimit: -1 }) fails loudly at bootstrap', () => {
		expect(() => MnemonicaModule.forRoot({ traceLimit: -1 })).toThrow();
	});
});

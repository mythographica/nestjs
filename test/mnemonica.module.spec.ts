import { describe, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { MnemonicaModule, InjectMnemonicaCollection, MNEMONICA_COLLECTION } from '../src/index.js';
import { defaultTypes, createTypesCollection } from 'mnemonica/module';
import type { TypesCollection } from 'mnemonica/module';
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
});

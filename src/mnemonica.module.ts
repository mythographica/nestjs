/**
 * NestJS module for mnemonica integration.
 *
 * forRoot()   — registers the global/default TypesCollection
 * forFeature() — creates an isolated TypesCollection per module
 *
 * Usage:
 *   @Module({
 *     imports: [MnemonicaModule.forRoot({ autoExtract: true })],
 *   })
 *   class AppModule {}
 *
 *   @Module({
 *     imports: [MnemonicaModule.forFeature('payments')],
 *   })
 *   class PaymentsModule {}
 */
import type { DynamicModule, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { Tracer } from '@opentelemetry/api';
import { defaultTypes, createTypesCollection } from 'mnemonica/module';
import type { TypesCollection, constructorOptions } from 'mnemonica/module';
import { MnemonicaSerializerInterceptor } from './interceptors/mnemonica-serializer.interceptor.js';
import { MNEMONICA_COLLECTION, getFeatureToken } from './tokens.js';
import { MnemonicaOtelProvider } from './providers/mnemonica-otel.provider.js';

export interface MnemonicaModuleOptions {
	/** Existing TypesCollection (default = mnemonica.defaultTypes) */
	collection?: TypesCollection;
	/** Auto-wire console telemetry hooks */
	telemetry?: boolean;
	/** Globally register MnemonicaSerializerInterceptor */
	autoExtract?: boolean;
	/** OpenTelemetry tracer — if provided, replaces console telemetry with OTel spans */
	tracer?: Tracer;
}

@Module({})
export class MnemonicaModule {
	static forRoot (options: MnemonicaModuleOptions = {}): DynamicModule {
		const collection = options.collection ?? defaultTypes;

		const providers: Provider[] = [
			{ provide: MNEMONICA_COLLECTION, useValue: collection },
		];

		if (options.autoExtract) {
			providers.push({
				provide : APP_INTERCEPTOR,
				useClass : MnemonicaSerializerInterceptor,
			});
		}

		if (options.tracer) {
			const otel = new MnemonicaOtelProvider(options.tracer);
			otel.attachHooks(collection);
			providers.push({
				provide : MnemonicaOtelProvider,
				useValue : otel,
			});
		} else if (options.telemetry) {
			this.registerTelemetryHooks(collection);
		}

		return {
			module  : MnemonicaModule,
			providers,
			exports : [MNEMONICA_COLLECTION],
			global  : true,
		};
	}

	static forFeature (name: string, config?: constructorOptions): DynamicModule {
		const collection = createTypesCollection(config);
		const token = getFeatureToken(name);

		return {
			module  : MnemonicaModule,
			providers : [
				{ provide: token, useValue: collection },
			],
			exports : [token],
			global  : false,
		};
	}

	private static registerTelemetryHooks (collection: TypesCollection): void {
		collection.registerHook('postCreation', ({ TypeName }) => {
			// eslint-disable-next-line no-console
			console.log('[mnemonica] created:', TypeName);
		});

		collection.registerHook('creationError', ({ TypeName }) => {
			// eslint-disable-next-line no-console
			console.error('[mnemonica] error:', TypeName);
		});
	}
}

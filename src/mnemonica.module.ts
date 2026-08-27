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
import type { TypesCollection } from 'mnemonica/module';
import { setTraceLimit } from '@mnemonica/dive';
import { attachHooks } from './hooks/attach-hooks.js';

type ConstructorOptions = {
	strictChain?: boolean;
	blockErrors?: boolean;
	submitStack?: boolean;
	awaitReturn?: boolean;
	asClass?: boolean;
};
import { MnemonicaSerializerInterceptor } from './interceptors/mnemonica-serializer.interceptor.js';
import {
	MnemonicaThunderstruckInterceptor,
	type ThunderstruckOptions,
} from './interceptors/mnemonica-thunderstruck.interceptor.js';
import { MNEMONICA_COLLECTION, MNEMONICA_THUNDERSTRUCK_OPTIONS, getFeatureToken } from './tokens.js';
import { MnemonicaOtelProvider } from './providers/mnemonica-otel.provider.js';
import { DiveOtelProvider } from './providers/dive-otel.provider.js';

export interface MnemonicaModuleOptions {
	/** Existing TypesCollection (default = mnemonica.defaultTypes) */
	collection?: TypesCollection;
	/** Auto-wire console telemetry hooks */
	telemetry?: boolean;
	/** Globally register MnemonicaSerializerInterceptor */
	autoExtract?: boolean;
	/** OpenTelemetry tracer — if provided, replaces console telemetry with OTel spans */
	tracer?: Tracer;
	/**
	 * Span EVERY dive-wrapped call (call / construct / method / recontext),
	 * not just constructions. Requires `tracer`. Spans are parented on dive's
	 * own trace parentage; at unwrapped boundaries they nest under the active
	 * OTel span (e.g. the HTTP request span from mtm).
	 */
	traceDiveCalls?: boolean;
	/**
	 * Dive ring-buffer size (edges kept in the trace). Applied only when
	 * explicitly provided, so a direct setTraceLimit() call from userland is
	 * never overridden. Dive's own default equals DEFAULT_TRACE_LIMIT.
	 */
	traceLimit?: number;
	/**
	 * Thunderstruck: attach dive hooks to the collection AND register the
	 * MnemonicaThunderstruckInterceptor globally — raw request payloads are
	 * fed into dive's pre-root collector ahead of every construction.
	 * Pass a ThunderstruckOptions object for the extras, e.g.
	 * { storeRequest: true }.
	 */
	thunderstruck?: boolean | ThunderstruckOptions;
}

/**
 * The dive trace's default ring-buffer size — re-exported so the tuning
 * knob is discoverable where the module is configured. Matches dive's own
 * internal default; the buffer size IS dive's memory bound.
 */
export const DEFAULT_TRACE_LIMIT = 1024;

@Module({})
export class MnemonicaModule {
	static forRoot (options: MnemonicaModuleOptions = {}): DynamicModule {
		const collection = options.collection ?? defaultTypes;

		// Dive-global knob: applied only when explicitly provided — a direct
		// setTraceLimit() from userland must never be silently overridden.
		if (options.traceLimit !== undefined) {
			setTraceLimit(options.traceLimit);
		}

		const providers: Provider[] = [
			{ provide: MNEMONICA_COLLECTION, useValue: collection },
		];

		if (options.autoExtract) {
			providers.push({
				provide : APP_INTERCEPTOR,
				useClass : MnemonicaSerializerInterceptor,
			});
		}

		if (options.thunderstruck) {
			// Dive hooks first (creation edges + method wrapping), then the
			// boundary interceptor that stamps pre-root payloads. The config
			// rides a DI token: a constructor parameter of an interface type
			// would surface in design:paramtypes as Object and break Nest's
			// class-based instantiation where the token is not registered.
			attachHooks(collection);
			providers.push({
				provide : MNEMONICA_THUNDERSTRUCK_OPTIONS,
				useValue : typeof options.thunderstruck === 'object'
					? options.thunderstruck
					: {},
			});
			providers.push({
				provide : APP_INTERCEPTOR,
				useClass : MnemonicaThunderstruckInterceptor,
			});
		}

		if (options.tracer) {
			const otel = new MnemonicaOtelProvider(options.tracer);
			otel.attachHooks(collection);
			providers.push({
				provide : MnemonicaOtelProvider,
				useValue : otel,
			});
			if (options.traceDiveCalls) {
				const diveOtel = new DiveOtelProvider(options.tracer);
				diveOtel.attach();
				providers.push({
					provide : DiveOtelProvider,
					useValue : diveOtel,
				});
			}
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

	static forFeature (name: string, config?: ConstructorOptions): DynamicModule {
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

/**
 * OpenTelemetry provider for mnemonica lifecycle hooks.
 *
 * Creates spans for preCreation / postCreation / creationError,
 * nests them according to the prototype chain, and propagates
 * context via AsyncLocalStorage.
 */
import { AsyncLocalStorage } from 'async_hooks';
import type { Tracer, Span } from '@opentelemetry/api';
import { trace, context as otelContext } from '@opentelemetry/api';
import type { hooksOpts, TypesCollection } from 'mnemonica/module';

const SymbolParentSpan = Symbol.for('mnemonica.span.parent');
const asyncStorage = new AsyncLocalStorage<Span>();

export class MnemonicaOtelProvider {
	private tracer: Tracer;

	constructor (tracer?: Tracer) {
		this.tracer = tracer ?? trace.getTracer('@mnemonica/nestjs');
	}

	getCurrentSpan (): Span | undefined {
		return asyncStorage.getStore();
	}

	runWithSpan<T> (span: Span, fn: () => T): T {
		return asyncStorage.run(span, fn);
	}

	attachHooks (collection: TypesCollection): void {
		collection.registerHook('preCreation', (hookData: hooksOpts) => {
			const parent = this.findParentSpan(hookData);
			const ctx = parent
				? otelContext.active()
				: otelContext.active();
			const span = parent
				? this.tracer.startSpan(
					`mnemonica.${hookData.TypeName}`,
					{},
					otelContext.setSpan(ctx, parent)
				)
				: this.tracer.startSpan(`mnemonica.${hookData.TypeName}`);

			span.setAttribute('mnemonica.type_name', hookData.TypeName);
			span.setAttribute('mnemonica.hook', 'preCreation');

			const instance = hookData.inheritedInstance;
			if (instance != null && typeof instance === 'object') {
				Object.defineProperty(instance, SymbolParentSpan, {
					value       : span,
					configurable: true,
					enumerable  : false,
					writable    : true,
				});
			}
		});

		collection.registerHook('postCreation', (hookData: hooksOpts) => {
			const instance = hookData.inheritedInstance;
			if (instance == null || typeof instance !== 'object') {
				return;
			}
			const span = (instance as Record<symbol, unknown>)[SymbolParentSpan] as Span | undefined;
			if (span) {
				span.setAttribute('mnemonica.hook', 'postCreation');
				span.end();
			}
		});

		collection.registerHook('creationError', (hookData: hooksOpts) => {
			const instance = hookData.inheritedInstance;
			if (instance == null || typeof instance !== 'object') {
				return;
			}
			const span = (instance as Record<symbol, unknown>)[SymbolParentSpan] as Span | undefined;
			if (span) {
				span.setAttribute('mnemonica.hook', 'creationError');
				span.setAttribute('error.type', 'Error');
				span.recordException(instance as Error);
				span.end();
			}
		});
	}

	private findParentSpan (hookData: hooksOpts): Span | undefined {
		const stored = asyncStorage.getStore();
		if (stored) {
			return stored;
		}

		const parent = hookData.existentInstance;
		if (parent == null || typeof parent !== 'object') {
			return undefined;
		}

		let current: object | null = parent;
		while (current) {
			const span = (current as Record<symbol, unknown>)[SymbolParentSpan] as Span | undefined;
			if (span) {
				return span;
			}
			current = Object.getPrototypeOf(current);
		}

		return undefined;
	}
}

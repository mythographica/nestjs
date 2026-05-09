/**
 * OpenTelemetry provider for mnemonica lifecycle hooks.
 *
 * Creates spans for preCreation / postCreation / creationError,
 * nests them according to the prototype chain, and propagates
 * context via AsyncLocalStorage.
 */
import { AsyncLocalStorage } from 'async_hooks';
import { trace, context as otelContext } from '@opentelemetry/api';
const SymbolParentSpan = Symbol.for('mnemonica.span.parent');
const asyncStorage = new AsyncLocalStorage();
export class MnemonicaOtelProvider {
    tracer;
    constructor(tracer) {
        this.tracer = tracer ?? trace.getTracer('@mnemonica/nestjs');
    }
    getCurrentSpan() {
        return asyncStorage.getStore();
    }
    runWithSpan(span, fn) {
        return asyncStorage.run(span, fn);
    }
    attachHooks(collection) {
        collection.registerHook('preCreation', (hookData) => {
            const parent = this.findParentSpan(hookData);
            const ctx = parent
                ? otelContext.active()
                : otelContext.active();
            const span = parent
                ? this.tracer.startSpan(`mnemonica.${hookData.TypeName}`, {}, otelContext.setSpan(ctx, parent))
                : this.tracer.startSpan(`mnemonica.${hookData.TypeName}`);
            span.setAttribute('mnemonica.type_name', hookData.TypeName);
            span.setAttribute('mnemonica.hook', 'preCreation');
            const instance = hookData.inheritedInstance;
            if (instance != null && typeof instance === 'object') {
                Object.defineProperty(instance, SymbolParentSpan, {
                    value: span,
                    configurable: true,
                    enumerable: false,
                    writable: true,
                });
            }
        });
        collection.registerHook('postCreation', (hookData) => {
            const instance = hookData.inheritedInstance;
            if (instance == null || typeof instance !== 'object') {
                return;
            }
            const span = instance[SymbolParentSpan];
            if (span) {
                span.setAttribute('mnemonica.hook', 'postCreation');
                span.end();
            }
        });
        collection.registerHook('creationError', (hookData) => {
            const instance = hookData.inheritedInstance;
            if (instance == null || typeof instance !== 'object') {
                return;
            }
            const span = instance[SymbolParentSpan];
            if (span) {
                span.setAttribute('mnemonica.hook', 'creationError');
                span.setAttribute('error.type', 'Error');
                span.recordException(instance);
                span.end();
            }
        });
    }
    findParentSpan(hookData) {
        const stored = asyncStorage.getStore();
        if (stored) {
            return stored;
        }
        const parent = hookData.existentInstance;
        if (parent == null || typeof parent !== 'object') {
            return undefined;
        }
        let current = parent;
        while (current) {
            const span = current[SymbolParentSpan];
            if (span) {
                return span;
            }
            current = Object.getPrototypeOf(current);
        }
        return undefined;
    }
}
//# sourceMappingURL=mnemonica-otel.provider.js.map
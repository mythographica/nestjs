"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaOtelProvider = void 0;
/**
 * OpenTelemetry provider for mnemonica lifecycle hooks.
 *
 * Creates spans for preCreation / postCreation / creationError,
 * nests them according to the prototype chain, and propagates
 * context via AsyncLocalStorage.
 */
const async_hooks_1 = require("async_hooks");
const api_1 = require("@opentelemetry/api");
const SymbolParentSpan = Symbol.for('mnemonica.span.parent');
const asyncStorage = new async_hooks_1.AsyncLocalStorage();
class MnemonicaOtelProvider {
    tracer;
    // spans of constructions in flight, keyed on the per-call args array
    // (the only value core guarantees identical between pre and post hooks)
    pendingSpans = new WeakMap();
    constructor(tracer) {
        this.tracer = tracer ?? api_1.trace.getTracer('@mnemonica/nestjs');
    }
    getCurrentSpan() {
        return asyncStorage.getStore();
    }
    runWithSpan(span, fn) {
        return asyncStorage.run(span, fn);
    }
    attachHooks(collection) {
        collection.registerHook('preCreation', (hookData) => {
            const parentSpan = this.findParentSpan(hookData);
            const ctx = parentSpan
                ? api_1.trace.setSpan(api_1.context.active(), parentSpan)
                : undefined;
            const span = parentSpan
                ? this.tracer.startSpan(`mnemonica.${hookData.TypeName}`, {}, ctx)
                : this.tracer.startSpan(`mnemonica.${hookData.TypeName}`);
            span.setAttribute('mnemonica.type_name', hookData.TypeName);
            span.setAttribute('mnemonica.hook', 'preCreation');
            // Store the pending span keyed on the construction's args array:
            // core passes the identical args reference to preCreation and to
            // postCreation/creationError, and it is unique per construction call.
            // Keying on the parent instance would collide when async constructions
            // of siblings interleave (preA, preB, postB, postA — the second
            // preCreation would overwrite the first).
            this.pendingSpans.set(hookData.args, span);
        });
        collection.registerHook('postCreation', (hookData) => {
            const newInstance = hookData.inheritedInstance;
            if (newInstance == null || typeof newInstance !== 'object') {
                return;
            }
            // Retrieve and remove the pending span for this construction
            let span = this.pendingSpans.get(hookData.args);
            this.pendingSpans.delete(hookData.args);
            if (!span) {
                // Fallback: create span here if preCreation didn't (shouldn't happen)
                span = this.tracer.startSpan(`mnemonica.${hookData.TypeName}`);
                span.setAttribute('mnemonica.type_name', hookData.TypeName);
            }
            span.setAttribute('mnemonica.hook', 'postCreation');
            span.end();
            // Store on new instance so its children can find the parent span
            Object.defineProperty(newInstance, SymbolParentSpan, {
                value: span,
                configurable: true,
                enumerable: false,
                writable: true,
            });
        });
        collection.registerHook('creationError', (hookData) => {
            const newInstance = hookData.inheritedInstance;
            if (newInstance == null || typeof newInstance !== 'object') {
                return;
            }
            // Retrieve and remove the pending span for this construction
            let span = this.pendingSpans.get(hookData.args);
            this.pendingSpans.delete(hookData.args);
            if (!span) {
                span = this.tracer.startSpan(`mnemonica.${hookData.TypeName}`);
                span.setAttribute('mnemonica.type_name', hookData.TypeName);
            }
            span.setAttribute('mnemonica.hook', 'creationError');
            span.setAttribute('error.type', 'Error');
            span.recordException(newInstance);
            span.end();
            // Store on error instance for chain tracing
            Object.defineProperty(newInstance, SymbolParentSpan, {
                value: span,
                configurable: true,
                enumerable: false,
                writable: true,
            });
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
exports.MnemonicaOtelProvider = MnemonicaOtelProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLW90ZWwucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJvdmlkZXJzL21uZW1vbmljYS1vdGVsLnByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7R0FNRztBQUNILDZDQUFnRDtBQUVoRCw0Q0FBbUU7QUFHbkUsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDN0QsTUFBTSxZQUFZLEdBQUcsSUFBSSwrQkFBaUIsRUFBUSxDQUFDO0FBRW5ELE1BQWEscUJBQXFCO0lBQ3pCLE1BQU0sQ0FBUztJQUN2QixxRUFBcUU7SUFDckUsd0VBQXdFO0lBQ2hFLFlBQVksR0FBRyxJQUFJLE9BQU8sRUFBZ0IsQ0FBQztJQUVuRCxZQUFhLE1BQWU7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksV0FBSyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxjQUFjO1FBQ2IsT0FBTyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELFdBQVcsQ0FBSyxJQUFVLEVBQUUsRUFBVztRQUN0QyxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxXQUFXLENBQUUsVUFBMkI7UUFDdkMsVUFBVSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFtQixFQUFFLEVBQUU7WUFDOUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRCxNQUFNLEdBQUcsR0FBRyxVQUFVO2dCQUNyQixDQUFDLENBQUMsV0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsVUFBVSxDQUFDO2dCQUNqRCxDQUFDLENBQUMsU0FBUyxD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O0FBNUhELHNEQTRIQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogT3BlblRlbGVtZXRyeSBwcm92aWRlciBmb3IgbW5lbW9uaWNhIGxpZmVjeWNsZSBob29rcy5cbiAqXG4gKiBDcmVhdGVzIHNwYW5zIGZvciBwcmVDcmVhdGlvbiAvIHBvc3RDcmVhdGlvbiAvIGNyZWF0aW9uRXJyb3IsXG4gKiBuZXN0cyB0aGVtIGFjY29yZGluZyB0byB0aGUgcHJvdG90eXBlIGNoYWluLCBhbmQgcHJvcGFnYXRlc1xuICogY29udGV4dCB2aWEgQXN5bmNMb2NhbFN0b3JhZ2UuXG4gKi9cbmltcG9ydCB7IEFzeW5jTG9jYWxTdG9yYWdlIH0gZnJvbSAnYXN5bmNfaG9va3MnO1xuaW1wb3J0IHR5cGUgeyBUcmFjZXIsIFNwYW4gfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHsgdHJhY2UsIGNvbnRleHQgYXMgb3RlbENvbnRleHQgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknO1xuaW1wb3J0IHR5cGUgeyBob29rc09wdHMsIFR5cGVzQ29sbGVjdGlvbiB9IGZyb20gJ21uZW1vbmljYS9tb2R1bGUnO1xuXG5jb25zdCBTeW1ib2xQYXJlbnRTcGFuID0gU3ltYm9sLmZvcignbW5lbW9uaWNhLnNwYW4ucGFyZW50Jyk7XG5jb25zdCBhc3luY1N0b3JhZ2UgPSBuZXcgQXN5bmNMb2NhbFN0b3JhZ2U8U3Bhbj4oKTtcblxuZXhwb3J0IGNsYXNzIE1uZW1vbmljYU90ZWxQcm92aWRlciB7XG5cdHByaXZhdGUgdHJhY2VyOiBUcmFjZXI7XG5cdC8vIHNwYW5zIG9mIGNvbnN0cnVjdGlvbnMgaW4gZmxpZ2h0LCBrZXllZCBvbiB0aGUgcGVyLWNhbGwgYXJncyBhcnJheVxuXHQvLyAodGhlIG9ubHkgdmFsdWUgY29yZSBndWFyYW50ZWVzIGlkZW50aWNhbCBiZXR3ZWVuIHByZSBhbmQgcG9zdCBob29rcylcblx0cHJpdmF0ZSBwZW5kaW5nU3BhbnMgPSBuZXcgV2Vha01hcDxvYmplY3QsIFNwYW4+KCk7XG5cblx0Y29uc3RydWN0b3IgKHRyYWNlcj86IFRyYWNlcikge1xuXHRcdHRoaXMudHJhY2VyID0gdHJhY2VyID8/IHRyYWNlLmdldFRyYWNlcignQG1uZW1vbmljYS9uZXN0anMnKTtcblx0fVxuXG5cdGdldEN1cnJlbnRTcGFuICgpOiBTcGFuIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gYXN5bmNTdG9yYWdlLmdldFN0b3JlKCk7XG5cdH1cblxuXHRydW5XaXRoU3BhbjxUPiAoc3BhbjogU3BhbiwgZm46ICgpID0+IFQpOiBUIHtcblx0XHRyZXR1cm4gYXN5bmNTdG9yYWdlLnJ1bihzcGFuLCBmbik7XG5cdH1cblxuXHRhdHRhY2hIb29rcyAoY29sbGVjdGlvbjogVHlwZXNDb2xsZWN0aW9uKTogdm9pZCB7XG5cdFx0Y29sbGVjdGlvbi5yZWdpc3Rlckhvb2soJ3ByZUNyZWF0aW9uJywgKGhvb2tEYXRhOiBob29rc09wdHMpID0+IHtcblx0XHRcdGNvbnN0IHBhcmVudFNwYW4gPSB0aGlzLmZpbmRQYXJlbnRTcGFuKGhvb2tEYXRhKTtcblx0XHRcdGNvbnN0IGN0eCA9IHBhcmVudFNwYW5cblx0XHRcdFx0PyB0cmFjZS5zZXRTcGFuKG90ZWxDb250ZXh0LmFjdGl2ZSgpLCBwYXJlbnRTcGFuKVxuXHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdGNvbnN0IHNwYW4gPSBwYXJlbnRTcGFuXG5cdFx0XHRcdD8gdGhpcy50cmFjZXIuc3RhcnRTcGFuKFxuXHRcdFx0XHRcdGBtbmVtb25pY2EuJHtob29rRGF0YS5UeXBlTmFtZX1gLFxuXHRcdFx0XHRcdHt9LFxuXHRcdFx0XHRcdGN0eFxuXHRcdFx0XHQpXG5cdFx0XHRcdDogdGhpcy50cmFjZXIuc3RhcnRTcGFuKGBtbmVtb25pY2EuJHtob29rRGF0YS5UeXBlTmFtZX1gKTtcblxuXHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ21uZW1vbmljYS50eXBlX25hbWUnLCBob29rRGF0YS5UeXBlTmFtZSk7XG5cdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnbW5lbW9uaWNhLmhvb2snLCAncHJlQ3JlYXRpb24nKTtcblxuXHRcdFx0Ly8gU3RvcmUgdGhlIHBlbmRpbmcgc3BhbiBrZXllZCBvbiB0aGUgY29uc3RydWN0aW9uJ3MgYXJncyBhcnJheTpcblx0XHRcdC8vIGNvcmUgcGFzc2VzIHRoZSBpZGVudGljYWwgYXJncyByZWZlcmVuY2UgdG8gcHJlQ3JlYXRpb24gYW5kIHRvXG5cdFx0XHQvLyBwb3N0Q3JlYXRpb24vY3JlYXRpb25FcnJvciwgYW5kIGl0IGlzIHVuaXF1ZSBwZXIgY29uc3RydWN0aW9uIGNhbGwuXG5cdFx0XHQvLyBLZXlpbmcgb24gdGhlIHBhcmVudCBpbnN0YW5jZSB3b3VsZCBjb2xsaWRlIHdoZW4gYXN5bmMgY29uc3RydWN0aW9uc1xuXHRcdFx0Ly8gb2Ygc2libGluZ3MgaW50ZXJsZWF2ZSAocHJlQSwgcHJlQiwgcG9zdEIsIHBvc3RBIOKAlCB0aGUgc2Vjb25kXG5cdFx0XHQvLyBwcmVDcmVhdGlvbiB3b3VsZCBvdmVyd3JpdGUgdGhlIGZpcnN0KS5cblx0XHRcdHRoaXMucGVuZGluZ1NwYW5zLnNldChob29rRGF0YS5hcmdzLCBzcGFuKTtcblx0XHR9KTtcblxuXHRcdGNvbGxlY3Rpb24ucmVnaXN0ZXJIb29rKCdwb3N0Q3JlYXRpb24nLCAoaG9va0RhdGE6IGhvb2tzT3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgbmV3SW5zdGFuY2UgPSBob29rRGF0YS5pbmhlcml0ZWRJbnN0YW5jZTtcblx0XHRcdGlmIChuZXdJbnN0YW5jZSA9PSBudWxsIHx8IHR5cGVvZiBuZXdJbnN0YW5jZSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXRyaWV2ZSBhbmQgcmVtb3ZlIHRoZSBwZW5kaW5nIHNwYW4gZm9yIHRoaXMgY29uc3RydWN0aW9uXG5cdFx0XHRsZXQgc3BhbiA9IHRoaXMucGVuZGluZ1NwYW5zLmdldChob29rRGF0YS5hcmdzKTtcblx0XHRcdHRoaXMucGVuZGluZ1NwYW5zLmRlbGV0ZShob29rRGF0YS5hcmdzKTtcblxuXHRcdFx0aWYgKCFzcGFuKSB7XG5cdFx0XHRcdC8vIEZhbGxiYWNrOiBjcmVhdGUgc3BhbiBoZXJlIGlmIHByZUNyZWF0aW9uIGRpZG4ndCAoc2hvdWxkbid0IGhhcHBlbilcblx0XHRcdFx0c3BhbiA9IHRoaXMudHJhY2VyLnN0YXJ0U3BhbihgbW5lbW9uaWNhLiR7aG9va0RhdGEuVHlwZU5hbWV9YCk7XG5cdFx0XHRcdHNwYW4uc2V0QXR0cmlidXRlKCdtbmVtb25pY2EudHlwZV9uYW1lJywgaG9va0RhdGEuVHlwZU5hbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnbW5lbW9uaWNhLmhvb2snLCAncG9zdENyZWF0aW9uJyk7XG5cdFx0XHRzcGFuLmVuZCgpO1xuXG5cdFx0XHQvLyBTdG9yZSBvbiBuZXcgaW5zdGFuY2Ugc28gaXRzIGNoaWxkcmVuIGNhbiBmaW5kIHRoZSBwYXJlbnQgc3BhblxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld0luc3RhbmNlLCBTeW1ib2xQYXJlbnRTcGFuLCB7XG5cdFx0XHRcdHZhbHVlICAgICAgIDogc3Bhbixcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRlbnVtZXJhYmxlICA6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZSAgICA6IHRydWUsXG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdGNvbGxlY3Rpb24ucmVnaXN0ZXJIb29rKCdjcmVhdGlvbkVycm9yJywgKGhvb2tEYXRhOiBob29rc09wdHMpID0+IHtcblx0XHRcdGNvbnN0IG5ld0luc3RhbmNlID0gaG9va0RhdGEuaW5oZXJpdGVkSW5zdGFuY2U7XG5cdFx0XHRpZiAobmV3SW5zdGFuY2UgPT0gbnVsbCB8fCB0eXBlb2YgbmV3SW5zdGFuY2UgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0cmlldmUgYW5kIHJlbW92ZSB0aGUgcGVuZGluZyBzcGFuIGZvciB0aGlzIGNvbnN0cnVjdGlvblxuXHRcdFx0bGV0IHNwYW4gPSB0aGlzLnBlbmRpbmdTcGFucy5nZXQoaG9va0RhdGEuYXJncyk7XG5cdFx0XHR0aGlzLnBlbmRpbmdTcGFucy5kZWxldGUoaG9va0RhdGEuYXJncyk7XG5cblx0XHRcdGlmICghc3Bhbikge1xuXHRcdFx0XHRzcGFuID0gdGhpcy50cmFjZXIuc3RhcnRTcGFuKGBtbmVtb25pY2EuJHtob29rRGF0YS5UeXBlTmFtZX1gKTtcblx0XHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ21uZW1vbmljYS50eXBlX25hbWUnLCBob29rRGF0YS5UeXBlTmFtZSk7XG5cdFx0XHR9XG5cblx0XHRcdHNwYW4uc2V0QXR0cmlidXRlKCdtbmVtb25pY2EuaG9vaycsICdjcmVhdGlvbkVycm9yJyk7XG5cdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnZXJyb3IudHlwZScsICdFcnJvcicpO1xuXHRcdFx0c3Bhbi5yZWNvcmRFeGNlcHRpb24obmV3SW5zdGFuY2UgYXMgRXJyb3IpO1xuXHRcdFx0c3Bhbi5lbmQoKTtcblxuXHRcdFx0Ly8gU3RvcmUgb24gZXJyb3IgaW5zdGFuY2UgZm9yIGNoYWluIHRyYWNpbmdcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdJbnN0YW5jZSwgU3ltYm9sUGFyZW50U3Bhbiwge1xuXHRcdFx0XHR2YWx1ZSAgICAgICA6IHNwYW4sXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0ZW51bWVyYWJsZSAgOiBmYWxzZSxcblx0XHRcdFx0d3JpdGFibGUgICAgOiB0cnVlLFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIGZpbmRQYXJlbnRTcGFuIChob29rRGF0YTogaG9va3NPcHRzKTogU3BhbiB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3Qgc3RvcmVkID0gYXN5bmNTdG9yYWdlLmdldFN0b3JlKCk7XG5cdFx0aWYgKHN0b3JlZCkge1xuXHRcdFx0cmV0dXJuIHN0b3JlZDtcblx0XHR9XG5cblx0XHRjb25zdCBwYXJlbnQgPSBob29rRGF0YS5leGlzdGVudEluc3RhbmNlO1xuXHRcdGlmIChwYXJlbnQgPT0gbnVsbCB8fCB0eXBlb2YgcGFyZW50ICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRsZXQgY3VycmVudDogb2JqZWN0IHwgbnVsbCA9IHBhcmVudDtcblx0XHR3aGlsZSAoY3VycmVudCkge1xuXHRcdFx0Y29uc3Qgc3BhbiA9IChjdXJyZW50IGFzIFJlY29yZDxzeW1ib2wsIHVua25vd24+KVtTeW1ib2xQYXJlbnRTcGFuXSBhcyBTcGFuIHwgdW5kZWZpbmVkO1xuXHRcdFx0aWYgKHNwYW4pIHtcblx0XHRcdFx0cmV0dXJuIHNwYW47XG5cdFx0XHR9XG5cdFx0XHRjdXJyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGN1cnJlbnQpO1xuXHRcdH1cblxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cbiJdfQ==
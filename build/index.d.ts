/**
 * @mnemonica/nestjs — NestJS adapter for mnemonica
 *
 * Provides:
 *   - MnemonicaModule.forRoot() / forFeature()
 *   - attachHooks() — dive lifecycle wiring for a TypesCollection
 *   - MnemonicaSerializerInterceptor
 *   - MnemonicaThunderstruckInterceptor + getPreRoot() (dive pre-root data)
 *   - MnemonicaValidationPipe
 *   - MnemonicaBody decorator
 *   - InjectMnemonicaCollection decorator
 *   - isMnemonicaInstance() type guard
 */
export { MnemonicaModule, type MnemonicaModuleOptions, DEFAULT_TRACE_LIMIT } from './mnemonica.module.js';
export { MnemonicaSerializerInterceptor } from './interceptors/mnemonica-serializer.interceptor.js';
export { MnemonicaThunderstruckInterceptor, type ThunderstruckOptions } from './interceptors/mnemonica-thunderstruck.interceptor.js';
export { MnemonicaValidationPipe } from './pipes/mnemonica-validation.pipe.js';
export { MnemonicaThunderstruckInterceptor as mti } from './interceptors/mnemonica-thunderstruck.interceptor.js';
export { MnemonicaValidationPipe as mvp } from './pipes/mnemonica-validation.pipe.js';
export { MnemonicaTraceMiddleware as mtm } from './middleware/mnemonica-trace.middleware.js';
export { MnemonicaBody } from './decorators/mnemonica-body.decorator.js';
export { InjectMnemonicaCollection, MNEMONICA_COLLECTION } from './tokens.js';
export { isMnemonicaInstance } from './utils/is-mnemonica-instance.js';
export { attachHooks } from './hooks/attach-hooks.js';
export { MnemonicaOtelProvider } from './providers/mnemonica-otel.provider.js';
export { MnemonicaTraceMiddleware } from './middleware/mnemonica-trace.middleware.js';
export { getPreRoot, type PreRootData, type RawPreRootPayload } from './thunderstruck/pre-root.js';
//# sourceMappingURL=index.d.ts.map
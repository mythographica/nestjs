/**
 * @mnemonica/nestjs — NestJS adapter for mnemonica
 *
 * Provides:
 *   - MnemonicaModule.forRoot() / forFeature()
 *   - MnemonicaSerializerInterceptor
 *   - MnemonicaValidationPipe
 *   - MnemonicaBody decorator
 *   - InjectMnemonicaCollection decorator
 *   - isMnemonicaInstance() type guard
 */
export { MnemonicaModule, type MnemonicaModuleOptions } from './mnemonica.module.js';
export { MnemonicaSerializerInterceptor } from './interceptors/mnemonica-serializer.interceptor.js';
export { MnemonicaValidationPipe } from './pipes/mnemonica-validation.pipe.js';
export { MnemonicaBody } from './decorators/mnemonica-body.decorator.js';
export { InjectMnemonicaCollection, MNEMONICA_COLLECTION } from './tokens.js';
export { isMnemonicaInstance } from './utils/is-mnemonica-instance.js';
export { MnemonicaOtelProvider } from './providers/mnemonica-otel.provider.js';
export { MnemonicaTraceMiddleware } from './middleware/mnemonica-trace.middleware.js';
//# sourceMappingURL=index.d.ts.map
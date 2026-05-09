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
import type { DynamicModule } from '@nestjs/common';
import type { Tracer } from '@opentelemetry/api';
import type { TypesCollection, constructorOptions } from 'mnemonica/module';
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
export declare class MnemonicaModule {
    static forRoot(options?: MnemonicaModuleOptions): DynamicModule;
    static forFeature(name: string, config?: constructorOptions): DynamicModule;
    private static registerTelemetryHooks;
}
//# sourceMappingURL=mnemonica.module.d.ts.map
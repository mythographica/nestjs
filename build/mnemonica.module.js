var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MnemonicaModule_1;
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { defaultTypes, createTypesCollection } from 'mnemonica/module';
import { MnemonicaSerializerInterceptor } from './interceptors/mnemonica-serializer.interceptor.js';
import { MNEMONICA_COLLECTION, getFeatureToken } from './tokens.js';
import { MnemonicaOtelProvider } from './providers/mnemonica-otel.provider.js';
let MnemonicaModule = MnemonicaModule_1 = class MnemonicaModule {
    static forRoot(options = {}) {
        const collection = options.collection ?? defaultTypes;
        const providers = [
            { provide: MNEMONICA_COLLECTION, useValue: collection },
        ];
        if (options.autoExtract) {
            providers.push({
                provide: APP_INTERCEPTOR,
                useClass: MnemonicaSerializerInterceptor,
            });
        }
        if (options.tracer) {
            const otel = new MnemonicaOtelProvider(options.tracer);
            otel.attachHooks(collection);
            providers.push({
                provide: MnemonicaOtelProvider,
                useValue: otel,
            });
        }
        else if (options.telemetry) {
            this.registerTelemetryHooks(collection);
        }
        return {
            module: MnemonicaModule_1,
            providers,
            exports: [MNEMONICA_COLLECTION],
            global: true,
        };
    }
    static forFeature(name, config) {
        const collection = createTypesCollection(config);
        const token = getFeatureToken(name);
        return {
            module: MnemonicaModule_1,
            providers: [
                { provide: token, useValue: collection },
            ],
            exports: [token],
            global: false,
        };
    }
    static registerTelemetryHooks(collection) {
        collection.registerHook('postCreation', ({ TypeName }) => {
            // eslint-disable-next-line no-console
            console.log('[mnemonica] created:', TypeName);
        });
        collection.registerHook('creationError', ({ TypeName }) => {
            // eslint-disable-next-line no-console
            console.error('[mnemonica] error:', TypeName);
        });
    }
};
MnemonicaModule = MnemonicaModule_1 = __decorate([
    Module({})
], MnemonicaModule);
export { MnemonicaModule };
//# sourceMappingURL=mnemonica.module.js.map
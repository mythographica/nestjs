export declare const MNEMONICA_COLLECTION: unique symbol;
/**
 * ThunderstruckOptions carrier — the thunderstruck interceptor receives its
 * config through DI, so a constructor parameter never breaks class-based
 * wiring (@UseInterceptors(mti), APP_INTERCEPTOR useClass) in contexts
 * where the token was never registered: @Optional() yields null there and
 * the defaults apply.
 */
export declare const MNEMONICA_THUNDERSTRUCK_OPTIONS: unique symbol;
export declare function getFeatureToken(name: string): symbol;
/**
 * Inject a mnemonica TypesCollection by feature name.
 * Use 'default' or omit for the root collection.
 */
export declare function InjectMnemonicaCollection(name?: string): ParameterDecorator;
//# sourceMappingURL=tokens.d.ts.map
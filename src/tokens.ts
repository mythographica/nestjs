/**
 * Injection tokens and decorator for mnemonica collections.
 */
import { Inject } from '@nestjs/common';

export const MNEMONICA_COLLECTION = Symbol.for('mnemonica.collection.default');

/**
 * ThunderstruckOptions carrier — the thunderstruck interceptor receives its
 * config through DI, so a constructor parameter never breaks class-based
 * wiring (@UseInterceptors(mti), APP_INTERCEPTOR useClass) in contexts
 * where the token was never registered: @Optional() yields null there and
 * the defaults apply.
 */
export const MNEMONICA_THUNDERSTRUCK_OPTIONS = Symbol.for('mnemonica.thunderstruck.options');

const featureTokens = new Map<string, symbol>();

export function getFeatureToken (name: string): symbol {
	if (!featureTokens.has(name)) {
		featureTokens.set(name, Symbol.for(`mnemonica.collection.feature.${name}`));
	}
	return featureTokens.get(name)!;
}

/**
 * Inject a mnemonica TypesCollection by feature name.
 * Use 'default' or omit for the root collection.
 */
export function InjectMnemonicaCollection (name = 'default'): ParameterDecorator {
	const token = name === 'default' ? MNEMONICA_COLLECTION : getFeatureToken(name);
	return Inject(token);
}

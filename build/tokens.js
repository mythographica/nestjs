/**
 * Injection tokens and decorator for mnemonica collections.
 */
import { Inject } from '@nestjs/common';
export const MNEMONICA_COLLECTION = Symbol.for('mnemonica.collection.default');
const featureTokens = new Map();
export function getFeatureToken(name) {
    if (!featureTokens.has(name)) {
        featureTokens.set(name, Symbol.for(`mnemonica.collection.feature.${name}`));
    }
    return featureTokens.get(name);
}
/**
 * Inject a mnemonica TypesCollection by feature name.
 * Use 'default' or omit for the root collection.
 */
export function InjectMnemonicaCollection(name = 'default') {
    const token = name === 'default' ? MNEMONICA_COLLECTION : getFeatureToken(name);
    return Inject(token);
}
//# sourceMappingURL=tokens.js.map
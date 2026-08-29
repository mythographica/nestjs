/**
 * CJS flavor smoke test.
 *
 * The package ships a dual build: build/ (ESM) and build-cjs/ (CommonJS,
 * exports["."].require). vitest itself runs ESM, so the require() check
 * happens in a spawned plain-node child — no loaders, no transpile.
 *
 * Asserts:
 *   1. require('@mnemonica/nestjs') loads (no ERR_REQUIRE_ASYNC_MODULE —
 *      the CJS build's require('mnemonica/module') must resolve to core's
 *      CJS build via the exports "require" condition, bypassing the TLA
 *      facade).
 *   2. Key exports exist on the CJS entry.
 *   3. Singleton identity: the adapter's `defaultTypes` comes from
 *      require('mnemonica/module') === require('mnemonica') — one
 *      registry, no split-brain between the module facade and CJS build.
 *
 * Requires `npm run build` to have produced build-cjs/ (CI builds first;
 * prepublishOnly builds before tests).
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

const script = `
	const adapter = require('./build-cjs/index.js');
	const viaModule = require('mnemonica/module');
	const viaRoot = require('mnemonica');
	const names = [
		'MnemonicaModule',
		'attachHooks',
		'formatFlow',
		'errorContext',
		'DiveOtelProvider',
		'isMnemonicaInstance',
	];
	const missing = names.filter((name) => adapter[name] === undefined);
	if (missing.length > 0) {
		throw new Error('missing CJS exports: ' + missing.join(', '));
	}
	if (viaModule !== viaRoot) {
		throw new Error('mnemonica/module require() is not the CJS singleton');
	}
	console.log('cjs-ok');
`;

describe('CJS build (build-cjs/)', () => {
	it('require()s cleanly and shares the mnemonica singleton', () => {
		const out = execFileSync(process.execPath, ['-e', script], {
			cwd      : root,
			encoding : 'utf8',
		});
		expect(out.trim()).toBe('cjs-ok');
	});
});

import { readFileSync, writeFileSync } from 'fs';

const buildPath = '../core/build/index.js';
let content = readFileSync(buildPath, 'utf-8');

const origDefine = `exports.define = function (TypeName, constructHandler, config) {
    const types = checkThis(this) ? exports.defaultTypes : this || exports.defaultTypes;
    return types
        .define(TypeName, constructHandler, config);
};`;

const patchedDefine = `exports.define = function (TypeName, constructHandler, config) {
    console.log('TRACE define: this=', typeof this, 'TypeName=', typeof TypeName);
    const types = checkThis(this) ? exports.defaultTypes : this || exports.defaultTypes;
    console.log('TRACE define: types=', typeof types, 'types===defaultTypes:', types === exports.defaultTypes, 'types.define===exports.define:', types.define === exports.define);
    return types
        .define(TypeName, constructHandler, config);
};`;

if (content.includes(origDefine)) {
	content = content.replace(origDefine, patchedDefine);
	writeFileSync(buildPath, content);
	console.log('Patched successfully');
} else {
	console.log('Could not find pattern');
}

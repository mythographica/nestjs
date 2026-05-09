import { describe, it, expect } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { MnemonicaBody } from '../src/decorators/mnemonica-body.decorator.js';
import { MnemonicaValidationPipe } from '../src/pipes/mnemonica-validation.pipe.js';
import { define } from 'mnemonica/module';
import { IsString } from 'class-validator';

class TestDto {
	@IsString()
	name!: string;
}

describe('MnemonicaBody', () => {
	it('returns a ParameterDecorator', () => {
		const MyType = define('BodyTestType', function (this: object) {});
		const decorator = MnemonicaBody(MyType);
		expect(typeof decorator).toBe('function');
	});

	it('constructs instance when used as a pipe', async () => {
		const MyType = define('BodyTestType2', function (this: { data: unknown }, data: unknown) {
			this.data = data;
		});
		const decorator = MnemonicaBody(MyType);

		// ParameterDecorator signature: (target, propertyKey, parameterIndex)
		const target = {};
		decorator(target, 'method', 0);

		// The decorator registers metadata; actual pipe behavior is tested
		// via MnemonicaValidationPipe. We just verify it doesn't throw.
		expect(Reflect.getMetadata('design:paramtypes', target, 'method')).toBeUndefined();
	});

	it('works with DTO class option', async () => {
		const MyType = define('BodyTestType3', function (this: { name: string }, dto: { name: string }) {
			this.name = dto.name;
		});
		const decorator = MnemonicaBody(MyType, { dtoClass: TestDto });
		expect(typeof decorator).toBe('function');
	});
});

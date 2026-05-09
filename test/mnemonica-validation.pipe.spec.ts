import { describe, it, expect } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { MnemonicaValidationPipe } from '../src/pipes/mnemonica-validation.pipe.js';
import { define } from 'mnemonica/module';
import { IsString, IsInt } from 'class-validator';

class TestDto {
	@IsString()
	name!: string;

	@IsInt()
	age!: number;
}

describe('MnemonicaValidationPipe', () => {
	it('constructs mnemonica instance without DTO class', async () => {
		const MyType = define('MyType', function (this: { data: unknown }, data: unknown) {
			this.data = data;
		});
		const pipe = MnemonicaValidationPipe.forType(MyType);
		const result = await pipe.transform({ hello: 'world' }, { type: 'body' } as any);

		expect(result).toBeInstanceOf(MyType);
		expect((result as Record<string, unknown>).data).toEqual({ hello: 'world' });
	});

	it('validates DTO then constructs instance', async () => {
		const ValidType = define('ValidType', function (this: { name: string; age: number }, dto: TestDto) {
			this.name = dto.name;
			this.age = dto.age;
		});
		const pipe = MnemonicaValidationPipe.forType(ValidType, TestDto);
		const result = await pipe.transform({ name: 'Alice', age: 30 }, { type: 'body' } as any);

		expect(result).toBeInstanceOf(ValidType);
		expect((result as Record<string, unknown>).name).toBe('Alice');
		expect((result as Record<string, unknown>).age).toBe(30);
	});

	it('throws BadRequestException on validation failure', async () => {
		const InvalidType = define('InvalidType', function (this: object) {});
		const pipe = MnemonicaValidationPipe.forType(InvalidType, TestDto);

		await expect(pipe.transform({ name: 123, age: 'not-a-number' }, { type: 'body' } as any))
			.rejects.toThrow(BadRequestException);
	});
});

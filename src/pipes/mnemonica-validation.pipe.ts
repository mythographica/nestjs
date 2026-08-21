/**
 * NestJS pipe that validates a plain DTO via class-validator,
 * then constructs a mnemonica instance from the validated data.
 *
 * Usage:
 *   @Body(MnemonicaValidationPipe.forType(PaymentEntity, CreatePaymentDto))
 *   payment: InstanceType<typeof PaymentEntity>
 */
import type { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import { feedValidatedPreRoot } from '../thunderstruck/pre-root.js';
// Mnemonica type constructor shape. `any[]` on purpose: tactica-typed
// constructors carry their specific data signature, and the pipe's job is
// precisely to construct from unknown wire data.
 type MnemonicaCtor = new (...args: any[]) => object;

@Injectable()
export class MnemonicaValidationPipe implements PipeTransform {
	constructor (
		private readonly TypeCtor: MnemonicaCtor,
		private readonly plainDtoClass?: new () => object,
	) {}

	async transform (value: unknown, _metadata: ArgumentMetadata): Promise<object> {
		// Step 1: Validate plain DTO via class-validator (if provided)
		if (this.plainDtoClass) {
			const dto = plainToInstance(this.plainDtoClass, value);
			const errors = await validate(dto);
			if (errors.length > 0) {
				throw new BadRequestException(this.formatErrors(errors));
			}
			// Thunderstruck: feed the validated DTO, correlated to the raw
			// boundary payload by object identity (same reference the
			// interceptor stamped). No-op when the interceptor is not active.
			feedValidatedPreRoot(value, dto);
		}

		// Step 2: Construct mnemonica instance
		return new this.TypeCtor(value);
	}

	static forType (TypeCtor: MnemonicaCtor, plainDtoClass?: new () => object): MnemonicaValidationPipe {
		return new MnemonicaValidationPipe(TypeCtor, plainDtoClass);
	}

	private formatErrors (errors: ValidationError[]): string {
		return errors
			.map((e) => {
				const constraints = e.constraints
					? Object.values(e.constraints).join(', ')
					: 'invalid value';
				return `${e.property}: ${constraints}`;
			})
			.join('; ');
	}
}

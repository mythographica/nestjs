/**
 * Convenience decorator that combines @Body() with MnemonicaValidationPipe.
 *
 * Usage:
 *   @Post()
 *   async create(@MnemonicaBody(PaymentEntity, { dtoClass: CreatePaymentDto }) payment: InstanceType<typeof PaymentEntity>) { ... }
 *
 * Equivalent to:
 *   @Body(MnemonicaValidationPipe.forType(PaymentEntity, CreatePaymentDto))
 */
import { Body } from '@nestjs/common';
// Mnemonica type constructor shape
 type MnemonicaCtor = new (...args: unknown[]) => object;
import { MnemonicaValidationPipe } from '../pipes/mnemonica-validation.pipe.js';

interface MnemonicaBodyOptions {
	dtoClass?: new () => object;
}

export function MnemonicaBody (TypeCtor: MnemonicaCtor, options?: MnemonicaBodyOptions): ParameterDecorator {
	return Body(MnemonicaValidationPipe.forType(TypeCtor, options?.dtoClass));
}

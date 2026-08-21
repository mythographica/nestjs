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
// Mnemonica type constructor shape (see the pipe for why `any[]`)
 type MnemonicaCtor = new (...args: any[]) => object;
import { MnemonicaValidationPipe } from '../pipes/mnemonica-validation.pipe.js';

interface MnemonicaBodyOptions {
	dtoClass?: new () => object;
}

export function MnemonicaBody (TypeCtor: MnemonicaCtor, options?: MnemonicaBodyOptions): ParameterDecorator {
	return Body(MnemonicaValidationPipe.forType(TypeCtor, options?.dtoClass));
}

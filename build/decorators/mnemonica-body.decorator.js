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
import { MnemonicaValidationPipe } from '../pipes/mnemonica-validation.pipe.js';
export function MnemonicaBody(TypeCtor, options) {
    return Body(MnemonicaValidationPipe.forType(TypeCtor, options?.dtoClass));
}
//# sourceMappingURL=mnemonica-body.decorator.js.map
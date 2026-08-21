/**
 * NestJS pipe that validates a plain DTO via class-validator,
 * then constructs a mnemonica instance from the validated data.
 *
 * Usage:
 *   @Body(MnemonicaValidationPipe.forType(PaymentEntity, CreatePaymentDto))
 *   payment: InstanceType<typeof PaymentEntity>
 */
import type { PipeTransform, ArgumentMetadata } from '@nestjs/common';
type MnemonicaCtor = new (...args: any[]) => object;
export declare class MnemonicaValidationPipe implements PipeTransform {
    private readonly TypeCtor;
    private readonly plainDtoClass?;
    constructor(TypeCtor: MnemonicaCtor, plainDtoClass?: (new () => object) | undefined);
    transform(value: unknown, _metadata: ArgumentMetadata): Promise<object>;
    static forType(TypeCtor: MnemonicaCtor, plainDtoClass?: new () => object): MnemonicaValidationPipe;
    private formatErrors;
}
export {};
//# sourceMappingURL=mnemonica-validation.pipe.d.ts.map
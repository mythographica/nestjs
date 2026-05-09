var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MnemonicaValidationPipe_1;
import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
let MnemonicaValidationPipe = MnemonicaValidationPipe_1 = class MnemonicaValidationPipe {
    TypeCtor;
    plainDtoClass;
    constructor(TypeCtor, plainDtoClass) {
        this.TypeCtor = TypeCtor;
        this.plainDtoClass = plainDtoClass;
    }
    async transform(value, _metadata) {
        // Step 1: Validate plain DTO via class-validator (if provided)
        if (this.plainDtoClass) {
            const dto = plainToInstance(this.plainDtoClass, value);
            const errors = await validate(dto);
            if (errors.length > 0) {
                throw new BadRequestException(this.formatErrors(errors));
            }
        }
        // Step 2: Construct mnemonica instance
        return new this.TypeCtor(value);
    }
    static forType(TypeCtor, plainDtoClass) {
        return new MnemonicaValidationPipe_1(TypeCtor, plainDtoClass);
    }
    formatErrors(errors) {
        return errors
            .map((e) => {
            const constraints = e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'invalid value';
            return `${e.property}: ${constraints}`;
        })
            .join('; ');
    }
};
MnemonicaValidationPipe = MnemonicaValidationPipe_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object, Function])
], MnemonicaValidationPipe);
export { MnemonicaValidationPipe };
//# sourceMappingURL=mnemonica-validation.pipe.js.map
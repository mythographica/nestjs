"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pre_root_js_1 = require("../thunderstruck/pre-root.js");
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
            const dto = (0, class_transformer_1.plainToInstance)(this.plainDtoClass, value);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new common_1.BadRequestException(this.formatErrors(errors));
            }
            // Thunderstruck: feed the validated DTO, correlated to the raw
            // boundary payload by object identity (same reference the
            // interceptor stamped). No-op when the interceptor is not active.
            (0, pre_root_js_1.feedValidatedPreRoot)(value, dto);
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
exports.MnemonicaValidationPipe = MnemonicaValidationPipe;
exports.MnemonicaValidationPipe = MnemonicaValidationPipe = MnemonicaValidationPipe_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Function])
], MnemonicaValidationPipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXZhbGlkYXRpb24ucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlcy9tbmVtb25pY2EtdmFsaWRhdGlvbi5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFTQSwyQ0FBaUU7QUFDakUseURBQW9EO0FBQ3BELHFEQUFpRTtBQUNqRSw4REFBb0U7QUFPN0QsSUFBTSx1QkFBdUIsK0JBQTdCLE1BQU0sdUJBQXVCO0lBRWpCO0lBQ0E7SUFGbEIsWUFDa0IsUUFBdUIsRUFDdkIsYUFBZ0M7UUFEaEMsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUN2QixrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7SUFDL0MsQ0FBQztJQUVKLEtBQUssQ0FBQyxTQUFTLENBQUUsS0FBYyxFQUFFLFNBQTJCO1FBQzNELCtEQUErRDtRQUMvRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFBLG1DQUFlLEVBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2RCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsMEJBQVEsRUFBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sSUFBSSw0QkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUQsQ0FBQztZQUNELCtEQUErRDtZQUMvRCwwREFBMEQ7WUFDMUQsa0VBQWtFO1lBQ2xFLElBQUEsa0NBQW9CLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCx1Q0FBdUM7UUFDdkMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUUsUUFBdUIsRUFBRSxhQUFnQztRQUN4RSxPQUFPLElBQUkseUJBQXVCLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxZQUFZLENBQUUsTUFBeUI7UUFDOUMsT0FBTyxNQUFNO2FBQ1gsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDVixNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsV0FBVztnQkFDaEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3pDLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDbkIsT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2QsQ0FBQztDQUNELENBQUE7QUF0Q1ksMERBQXVCO2tDQUF2Qix1QkFBdUI7SUFEbkMsSUFBQSxtQkFBVSxHQUFFOztHQUNBLHVCQUF1QixDQXNDbkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5lc3RKUyBwaXBlIHRoYXQgdmFsaWRhdGVzIGEgcGxhaW4gRFRPIHZpYSBjbGFzcy12YWxpZGF0b3IsXG4gKiB0aGVuIGNvbnN0cnVjdHMgYSBtbmVtb25pY2EgaW5zdGFuY2UgZnJvbSB0aGUgdmFsaWRhdGVkIGRhdGEuXG4gKlxuICogVXNhZ2U6XG4gKiAgIEBCb2R5KE1uZW1vbmljYVZhbGlkYXRpb25QaXBlLmZvclR5cGUoUGF5bWVudEVudGl0eSwgQ3JlYXRlUGF5bWVudER0bykpXG4gKiAgIHBheW1lbnQ6IEluc3RhbmNlVHlwZTx0eXBlb2YgUGF5bWVudEVudGl0eT5cbiAqL1xuaW1wb3J0IHR5cGUgeyBQaXBlVHJhbnNmb3JtLCBBcmd1bWVudE1ldGFkYXRhIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgQmFkUmVxdWVzdEV4Y2VwdGlvbiB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IHBsYWluVG9JbnN0YW5jZSB9IGZyb20gJ2NsYXNzLXRyYW5zZm9ybWVyJztcbmltcG9ydCB7IHZhbGlkYXRlLCB0eXBlIFZhbGlkYXRpb25FcnJvciB9IGZyb20gJ2NsYXNzLXZhbGlkYXRvcic7XG5pbXBvcnQgeyBmZWVkVmFsaWRhdGVkUHJlUm9vdCB9IGZyb20gJy4uL3RodW5kZXJzdHJ1Y2svcHJlLXJvb3QuanMnO1xuLy8gTW5lbW9uaWNhIHR5cGUgY29uc3RydWN0b3Igc2hhcGUuIGBhbnlbXWAgb24gcHVycG9zZTogdGFjdGljYS10eXBlZFxuLy8gY29uc3RydWN0b3JzIGNhcnJ5IHRoZWlyIHNwZWNpZmljIGRhdGEgc2lnbmF0dXJlLCBhbmQgdGhlIHBpcGUncyBqb2IgaXNcbi8vIHByZWNpc2VseSB0byBjb25zdHJ1Y3QgZnJvbSB1bmtub3duIHdpcmUgZGF0YS5cbiB0eXBlIE1uZW1vbmljYUN0b3IgPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBvYmplY3Q7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNbmVtb25pY2FWYWxpZGF0aW9uUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXHRjb25zdHJ1Y3RvciAoXG5cdFx0cHJpdmF0ZSByZWFkb25seSBUeXBlQ3RvcjogTW5lbW9uaWNhQ3Rvcixcblx0XHRwcml2YXRlIHJlYWRvbmx5IHBsYWluRHRvQ2xhc3M/OiBuZXcgKCkgPT4gb2JqZWN0LFxuXHQpIHt9XG5cblx0YXN5bmMgdHJhbnNmb3JtICh2YWx1ZTogdW5rbm93biwgX21ldGFkYXRhOiBBcmd1bWVudE1ldGFkYXRhKTogUHJvbWlzZTxvYmplY3Q+IHtcblx0XHQvLyBTdGVwIDE6IFZhbGlkYXRlIHBsYWluIERUTyB2aWEgY2xhc3MtdmFsaWRhdG9yIChpZiBwcm92aWRlZClcblx0XHRpZiAodGhpcy5wbGFpbkR0b0NsYXNzKSB7XG5cdFx0XHRjb25zdCBkdG8gPSBwbGFpblRvSW5zdGFuY2UodGhpcy5wbGFpbkR0b0NsYXNzLCB2YWx1ZSk7XG5cdFx0XHRjb25zdCBlcnJvcnMgPSBhd2FpdCB2YWxpZGF0ZShkdG8pO1xuXHRcdFx0aWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBCYWRSZXF1ZXN0RXhjZXB0aW9uKHRoaXMuZm9ybWF0RXJyb3JzKGVycm9ycykpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVGh1bmRlcnN0cnVjazogZmVlZCB0aGUgdmFsaWRhdGVkIERUTywgY29ycmVsYXRlZCB0byB0aGUgcmF3XG5cdFx0XHQvLyBib3VuZGFyeSBwYXlsb2FkIGJ5IG9iamVjdCBpZGVudGl0eSAoc2FtZSByZWZlcmVuY2UgdGhlXG5cdFx0XHQvLyBpbnRlcmNlcHRvciBzdGFtcGVkKS4gTm8tb3Agd2hlbiB0aGUgaW50ZXJjZXB0b3IgaXMgbm90IGFjdGl2ZS5cblx0XHRcdGZlZWRWYWxpZGF0ZWRQcmVSb290KHZhbHVlLCBkdG8pO1xuXHRcdH1cblxuXHRcdC8vIFN0ZXAgMjogQ29uc3RydWN0IG1uZW1vbmljYSBpbnN0YW5jZVxuXHRcdHJldHVybiBuZXcgdGhpcy5UeXBlQ3Rvcih2YWx1ZSk7XG5cdH1cblxuXHRzdGF0aWMgZm9yVHlwZSAoVHlwZUN0b3I6IE1uZW1vbmljYUN0b3IsIHBsYWluRHRvQ2xhc3M/OiBuZXcgKCkgPT4gb2JqZWN0KTogTW5lbW9uaWNhVmFsaWRhdGlvblBpcGUge1xuXHRcdHJldHVybiBuZXcgTW5lbW9uaWNhVmFsaWRhdGlvblBpcGUoVHlwZUN0b3IsIHBsYWluRHRvQ2xhc3MpO1xuXHR9XG5cblx0cHJpdmF0ZSBmb3JtYXRFcnJvcnMgKGVycm9yczogVmFsaWRhdGlvbkVycm9yW10pOiBzdHJpbmcge1xuXHRcdHJldHVybiBlcnJvcnNcblx0XHRcdC5tYXAoKGUpID0+IHtcblx0XHRcdFx0Y29uc3QgY29uc3RyYWludHMgPSBlLmNvbnN0cmFpbnRzXG5cdFx0XHRcdFx0PyBPYmplY3QudmFsdWVzKGUuY29uc3RyYWludHMpLmpvaW4oJywgJylcblx0XHRcdFx0XHQ6ICdpbnZhbGlkIHZhbHVlJztcblx0XHRcdFx0cmV0dXJuIGAke2UucHJvcGVydHl9OiAke2NvbnN0cmFpbnRzfWA7XG5cdFx0XHR9KVxuXHRcdFx0LmpvaW4oJzsgJyk7XG5cdH1cbn1cbiJdfQ==
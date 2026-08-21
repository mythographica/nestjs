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
import { feedValidatedPreRoot } from '../thunderstruck/pre-root.js';
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
            // Thunderstruck: feed the validated DTO, correlated to the raw
            // boundary payload by object identity (same reference the
            // interceptor stamped). No-op when the interceptor is not active.
            feedValidatedPreRoot(value, dto);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXZhbGlkYXRpb24ucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlcy9tbmVtb25pY2EtdmFsaWRhdGlvbi5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxRQUFRLEVBQXdCLE1BQU0saUJBQWlCLENBQUM7QUFDakUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFPN0QsSUFBTSx1QkFBdUIsK0JBQTdCLE1BQU0sdUJBQXVCO0lBRWpCO0lBQ0E7SUFGbEIsWUFDa0IsUUFBdUIsRUFDdkIsYUFBZ0M7UUFEaEMsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUN2QixrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7SUFDL0MsQ0FBQztJQUVKLEtBQUssQ0FBQyxTQUFTLENBQUUsS0FBYyxFQUFFLFNBQTJCO1FBQzNELCtEQUErRDtRQUMvRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2RCxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUQsQ0FBQztZQUNELCtEQUErRDtZQUMvRCwwREFBMEQ7WUFDMUQsa0VBQWtFO1lBQ2xFLG9CQUFvQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsdUNBQXVDO1FBQ3ZDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFFLFFBQXVCLEVBQUUsYUFBZ0M7UUFDeEUsT0FBTyxJQUFJLHlCQUF1QixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sWUFBWSxDQUFFLE1BQXlCO1FBQzlDLE9BQU8sTUFBTTthQUNYLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ1YsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFdBQVc7Z0JBQ2hDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN6QyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ25CLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxLQUFLLFdBQVcsRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNkLENBQUM7Q0FDRCxDQUFBO0FBdENZLHVCQUF1QjtJQURuQyxVQUFVLEVBQUU7O0dBQ0EsdUJBQXVCLENBc0NuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTmVzdEpTIHBpcGUgdGhhdCB2YWxpZGF0ZXMgYSBwbGFpbiBEVE8gdmlhIGNsYXNzLXZhbGlkYXRvcixcbiAqIHRoZW4gY29uc3RydWN0cyBhIG1uZW1vbmljYSBpbnN0YW5jZSBmcm9tIHRoZSB2YWxpZGF0ZWQgZGF0YS5cbiAqXG4gKiBVc2FnZTpcbiAqICAgQEJvZHkoTW5lbW9uaWNhVmFsaWRhdGlvblBpcGUuZm9yVHlwZShQYXltZW50RW50aXR5LCBDcmVhdGVQYXltZW50RHRvKSlcbiAqICAgcGF5bWVudDogSW5zdGFuY2VUeXBlPHR5cGVvZiBQYXltZW50RW50aXR5PlxuICovXG5pbXBvcnQgdHlwZSB7IFBpcGVUcmFuc2Zvcm0sIEFyZ3VtZW50TWV0YWRhdGEgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBCYWRSZXF1ZXN0RXhjZXB0aW9uIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgcGxhaW5Ub0luc3RhbmNlIH0gZnJvbSAnY2xhc3MtdHJhbnNmb3JtZXInO1xuaW1wb3J0IHsgdmFsaWRhdGUsIHR5cGUgVmFsaWRhdGlvbkVycm9yIH0gZnJvbSAnY2xhc3MtdmFsaWRhdG9yJztcbmltcG9ydCB7IGZlZWRWYWxpZGF0ZWRQcmVSb290IH0gZnJvbSAnLi4vdGh1bmRlcnN0cnVjay9wcmUtcm9vdC5qcyc7XG4vLyBNbmVtb25pY2EgdHlwZSBjb25zdHJ1Y3RvciBzaGFwZS4gYGFueVtdYCBvbiBwdXJwb3NlOiB0YWN0aWNhLXR5cGVkXG4vLyBjb25zdHJ1Y3RvcnMgY2FycnkgdGhlaXIgc3BlY2lmaWMgZGF0YSBzaWduYXR1cmUsIGFuZCB0aGUgcGlwZSdzIGpvYiBpc1xuLy8gcHJlY2lzZWx5IHRvIGNvbnN0cnVjdCBmcm9tIHVua25vd24gd2lyZSBkYXRhLlxuIHR5cGUgTW5lbW9uaWNhQ3RvciA9IG5ldyAoLi4uYXJnczogYW55W10pID0+IG9iamVjdDtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1uZW1vbmljYVZhbGlkYXRpb25QaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cdGNvbnN0cnVjdG9yIChcblx0XHRwcml2YXRlIHJlYWRvbmx5IFR5cGVDdG9yOiBNbmVtb25pY2FDdG9yLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgcGxhaW5EdG9DbGFzcz86IG5ldyAoKSA9PiBvYmplY3QsXG5cdCkge31cblxuXHRhc3luYyB0cmFuc2Zvcm0gKHZhbHVlOiB1bmtub3duLCBfbWV0YWRhdGE6IEFyZ3VtZW50TWV0YWRhdGEpOiBQcm9taXNlPG9iamVjdD4ge1xuXHRcdC8vIFN0ZXAgMTogVmFsaWRhdGUgcGxhaW4gRFRPIHZpYSBjbGFzcy12YWxpZGF0b3IgKGlmIHByb3ZpZGVkKVxuXHRcdGlmICh0aGlzLnBsYWluRHRvQ2xhc3MpIHtcblx0XHRcdGNvbnN0IGR0byA9IHBsYWluVG9JbnN0YW5jZSh0aGlzLnBsYWluRHRvQ2xhc3MsIHZhbHVlKTtcblx0XHRcdGNvbnN0IGVycm9ycyA9IGF3YWl0IHZhbGlkYXRlKGR0byk7XG5cdFx0XHRpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEJhZFJlcXVlc3RFeGNlcHRpb24odGhpcy5mb3JtYXRFcnJvcnMoZXJyb3JzKSk7XG5cdFx0XHR9XG5cdFx0XHQvLyBUaHVuZGVyc3RydWNrOiBmZWVkIHRoZSB2YWxpZGF0ZWQgRFRPLCBjb3JyZWxhdGVkIHRvIHRoZSByYXdcblx0XHRcdC8vIGJvdW5kYXJ5IHBheWxvYWQgYnkgb2JqZWN0IGlkZW50aXR5IChzYW1lIHJlZmVyZW5jZSB0aGVcblx0XHRcdC8vIGludGVyY2VwdG9yIHN0YW1wZWQpLiBOby1vcCB3aGVuIHRoZSBpbnRlcmNlcHRvciBpcyBub3QgYWN0aXZlLlxuXHRcdFx0ZmVlZFZhbGlkYXRlZFByZVJvb3QodmFsdWUsIGR0byk7XG5cdFx0fVxuXG5cdFx0Ly8gU3RlcCAyOiBDb25zdHJ1Y3QgbW5lbW9uaWNhIGluc3RhbmNlXG5cdFx0cmV0dXJuIG5ldyB0aGlzLlR5cGVDdG9yKHZhbHVlKTtcblx0fVxuXG5cdHN0YXRpYyBmb3JUeXBlIChUeXBlQ3RvcjogTW5lbW9uaWNhQ3RvciwgcGxhaW5EdG9DbGFzcz86IG5ldyAoKSA9PiBvYmplY3QpOiBNbmVtb25pY2FWYWxpZGF0aW9uUGlwZSB7XG5cdFx0cmV0dXJuIG5ldyBNbmVtb25pY2FWYWxpZGF0aW9uUGlwZShUeXBlQ3RvciwgcGxhaW5EdG9DbGFzcyk7XG5cdH1cblxuXHRwcml2YXRlIGZvcm1hdEVycm9ycyAoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JbXSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIGVycm9yc1xuXHRcdFx0Lm1hcCgoZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBjb25zdHJhaW50cyA9IGUuY29uc3RyYWludHNcblx0XHRcdFx0XHQ/IE9iamVjdC52YWx1ZXMoZS5jb25zdHJhaW50cykuam9pbignLCAnKVxuXHRcdFx0XHRcdDogJ2ludmFsaWQgdmFsdWUnO1xuXHRcdFx0XHRyZXR1cm4gYCR7ZS5wcm9wZXJ0eX06ICR7Y29uc3RyYWludHN9YDtcblx0XHRcdH0pXG5cdFx0XHQuam9pbignOyAnKTtcblx0fVxufVxuIl19
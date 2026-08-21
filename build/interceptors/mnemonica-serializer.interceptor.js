var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { isMnemonicaInstance } from '../utils/is-mnemonica-instance.js';
let MnemonicaSerializerInterceptor = class MnemonicaSerializerInterceptor {
    intercept(_context, next) {
        return next.handle().pipe(map((value) => {
            if (isMnemonicaInstance(value) && typeof value.extract === 'function') {
                return value.extract();
            }
            return value;
        }));
    }
};
MnemonicaSerializerInterceptor = __decorate([
    Injectable()
], MnemonicaSerializerInterceptor);
export { MnemonicaSerializerInterceptor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXNlcmlhbGl6ZXIuaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJjZXB0b3JzL21uZW1vbmljYS1zZXJpYWxpemVyLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHakUsSUFBTSw4QkFBOEIsR0FBcEMsTUFBTSw4QkFBOEI7SUFDMUMsU0FBUyxDQUFFLFFBQTBCLEVBQUUsSUFBaUI7UUFDdkQsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUN4QixHQUFHLENBQUMsQ0FBQyxLQUFjLEVBQUUsRUFBRTtZQUN0QixJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDdkUsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDeEIsQ0FBQztZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQ0YsQ0FBQztJQUNILENBQUM7Q0FDRCxDQUFBO0FBWFksOEJBQThCO0lBRDFDLFVBQVUsRUFBRTtHQUNBLDhCQUE4QixDQVcxQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTmVzdEpTIGludGVyY2VwdG9yIHRoYXQgYXV0by1jYWxscyAuZXh0cmFjdCgpIG9uIG1uZW1vbmljYSBpbnN0YW5jZXNcbiAqIGJlZm9yZSBKU09OIHNlcmlhbGl6YXRpb24uIENvbnRyb2xsZXJzIGNhbiByZXR1cm4gdHlwZWQgaW5zdGFuY2VzXG4gKiBkaXJlY3RseSB3aXRob3V0IG1hbnVhbCBmbGF0dGVuaW5nLlxuICovXG5pbXBvcnQgdHlwZSB7IE5lc3RJbnRlcmNlcHRvciwgRXhlY3V0aW9uQ29udGV4dCwgQ2FsbEhhbmRsZXIgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaXNNbmVtb25pY2FJbnN0YW5jZSB9IGZyb20gJy4uL3V0aWxzL2lzLW1uZW1vbmljYS1pbnN0YW5jZS5qcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNbmVtb25pY2FTZXJpYWxpemVySW50ZXJjZXB0b3IgaW1wbGVtZW50cyBOZXN0SW50ZXJjZXB0b3Ige1xuXHRpbnRlcmNlcHQgKF9jb250ZXh0OiBFeGVjdXRpb25Db250ZXh0LCBuZXh0OiBDYWxsSGFuZGxlcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuXHRcdHJldHVybiBuZXh0LmhhbmRsZSgpLnBpcGUoXG5cdFx0XHRtYXAoKHZhbHVlOiB1bmtub3duKSA9PiB7XG5cdFx0XHRcdGlmIChpc01uZW1vbmljYUluc3RhbmNlKHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUuZXh0cmFjdCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZS5leHRyYWN0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fSksXG5cdFx0KTtcblx0fVxufVxuIl19
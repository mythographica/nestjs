"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaSerializerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const is_mnemonica_instance_js_1 = require("../utils/is-mnemonica-instance.js");
let MnemonicaSerializerInterceptor = class MnemonicaSerializerInterceptor {
    intercept(_context, next) {
        return next.handle().pipe((0, operators_1.map)((value) => {
            if ((0, is_mnemonica_instance_js_1.isMnemonicaInstance)(value) && typeof value.extract === 'function') {
                return value.extract();
            }
            return value;
        }));
    }
};
exports.MnemonicaSerializerInterceptor = MnemonicaSerializerInterceptor;
exports.MnemonicaSerializerInterceptor = MnemonicaSerializerInterceptor = __decorate([
    (0, common_1.Injectable)()
], MnemonicaSerializerInterceptor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXNlcmlhbGl6ZXIuaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJjZXB0b3JzL21uZW1vbmljYS1zZXJpYWxpemVyLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1BLDJDQUE0QztBQUU1Qyw4Q0FBcUM7QUFDckMsZ0ZBQXdFO0FBR2pFLElBQU0sOEJBQThCLEdBQXBDLE1BQU0sOEJBQThCO0lBQzFDLFNBQVMsQ0FBRSxRQUEwQixFQUFFLElBQWlCO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FDeEIsSUFBQSxlQUFHLEVBQUMsQ0FBQyxLQUFjLEVBQUUsRUFBRTtZQUN0QixJQUFJLElBQUEsOENBQW1CLEVBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxLQUFLLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRSxDQUFDO2dCQUN2RSxPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN4QixDQUFDO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FDRixDQUFDO0lBQ0gsQ0FBQztDQUNELENBQUE7QUFYWSx3RUFBOEI7eUNBQTlCLDhCQUE4QjtJQUQxQyxJQUFBLG1CQUFVLEdBQUU7R0FDQSw4QkFBOEIsQ0FXMUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5lc3RKUyBpbnRlcmNlcHRvciB0aGF0IGF1dG8tY2FsbHMgLmV4dHJhY3QoKSBvbiBtbmVtb25pY2EgaW5zdGFuY2VzXG4gKiBiZWZvcmUgSlNPTiBzZXJpYWxpemF0aW9uLiBDb250cm9sbGVycyBjYW4gcmV0dXJuIHR5cGVkIGluc3RhbmNlc1xuICogZGlyZWN0bHkgd2l0aG91dCBtYW51YWwgZmxhdHRlbmluZy5cbiAqL1xuaW1wb3J0IHR5cGUgeyBOZXN0SW50ZXJjZXB0b3IsIEV4ZWN1dGlvbkNvbnRleHQsIENhbGxIYW5kbGVyIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzTW5lbW9uaWNhSW5zdGFuY2UgfSBmcm9tICcuLi91dGlscy9pcy1tbmVtb25pY2EtaW5zdGFuY2UuanMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW5lbW9uaWNhU2VyaWFsaXplckludGVyY2VwdG9yIGltcGxlbWVudHMgTmVzdEludGVyY2VwdG9yIHtcblx0aW50ZXJjZXB0IChfY29udGV4dDogRXhlY3V0aW9uQ29udGV4dCwgbmV4dDogQ2FsbEhhbmRsZXIpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcblx0XHRyZXR1cm4gbmV4dC5oYW5kbGUoKS5waXBlKFxuXHRcdFx0bWFwKCh2YWx1ZTogdW5rbm93bikgPT4ge1xuXHRcdFx0XHRpZiAoaXNNbmVtb25pY2FJbnN0YW5jZSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlLmV4dHJhY3QgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWUuZXh0cmFjdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH0pLFxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==
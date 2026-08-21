var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Optional, Inject } from '@nestjs/common';
import { feedPreRoot } from '../thunderstruck/pre-root.js';
import { MNEMONICA_THUNDERSTRUCK_OPTIONS } from '../tokens.js';
let MnemonicaThunderstruckInterceptor = class MnemonicaThunderstruckInterceptor {
    storeRequest;
    constructor(options) {
        this.storeRequest = options?.storeRequest === true;
    }
    intercept(context, next) {
        if (context.getType() === 'http') {
            const req = context.switchToHttp().getRequest();
            const raw = {
                method: req.method,
                url: req.url,
                params: req.params,
                query: req.query,
                body: req.body,
                headers: req.headers,
            };
            if (this.storeRequest) {
                raw.request = req;
            }
            feedPreRoot(raw);
        }
        return next.handle();
    }
};
MnemonicaThunderstruckInterceptor = __decorate([
    Injectable(),
    __param(0, Optional()),
    __param(0, Inject(MNEMONICA_THUNDERSTRUCK_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], MnemonicaThunderstruckInterceptor);
export { MnemonicaThunderstruckInterceptor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXRodW5kZXJzdHJ1Y2suaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJjZXB0b3JzL21uZW1vbmljYS10aHVuZGVyc3RydWNrLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5RCxPQUFPLEVBQUUsV0FBVyxFQUEwQixNQUFNLDhCQUE4QixDQUFDO0FBQ25GLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQWF4RCxJQUFNLGlDQUFpQyxHQUF2QyxNQUFNLGlDQUFpQztJQUM1QixZQUFZLENBQVU7SUFFdkMsWUFDc0QsT0FBcUM7UUFFMUYsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLEVBQUUsWUFBWSxLQUFLLElBQUksQ0FBQztJQUNwRCxDQUFDO0lBRUQsU0FBUyxDQUFFLE9BQXlCLEVBQUUsSUFBaUI7UUFDdEQsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDbEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2hELE1BQU0sR0FBRyxHQUFzQjtnQkFDOUIsTUFBTSxFQUFJLEdBQUcsQ0FBQyxNQUFNO2dCQUNwQixHQUFHLEVBQU8sR0FBRyxDQUFDLEdBQUc7Z0JBQ2pCLE1BQU0sRUFBSSxHQUFHLENBQUMsTUFBTTtnQkFDcEIsS0FBSyxFQUFLLEdBQUcsQ0FBQyxLQUFLO2dCQUNuQixJQUFJLEVBQU0sR0FBRyxDQUFDLElBQUk7Z0JBQ2xCLE9BQU8sRUFBRyxHQUFHLENBQUMsT0FBTzthQUNyQixDQUFDO1lBQ0YsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3ZCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ25CLENBQUM7WUFDRCxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3RCLENBQUM7Q0FDRCxDQUFBO0FBM0JZLGlDQUFpQztJQUQ3QyxVQUFVLEVBQUU7SUFLVixXQUFBLFFBQVEsRUFBRSxDQUFBO0lBQUUsV0FBQSxNQUFNLENBQUMsK0JBQStCLENBQUMsQ0FBQTs7R0FKekMsaUNBQWlDLENBMkI3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTmVzdEpTIGludGVyY2VwdG9yIHRoYXQgZmVlZHMgdGhlIHJhdyBIVFRQIGJvdW5kYXJ5IHBheWxvYWQgaW50byBkaXZlJ3NcbiAqIFRodW5kZXJzdHJ1Y2sgY29sbGVjdG9yIEJFRk9SRSBhbnkgbW5lbW9uaWNhIGNvbnN0cnVjdGlvbiBoYXBwZW5zLlxuICpcbiAqIFBlciByZXF1ZXN0IGl0IHN0b3JlcyBgeyBtZXRob2QsIHVybCwgcGFyYW1zLCBxdWVyeSwgYm9keSwgaGVhZGVycyB9YCBhbmRcbiAqIHN0YW1wcyB0aGUgcGFyYW1zIC8gcXVlcnkgLyBib2R5IC8gaGVhZGVycyBvYmplY3RzIHNvIHBpcGVzIGFuZCBjb25zdHJ1Y3RcbiAqIGhhbmRsZXJzIGNvcnJlbGF0ZSB0aGUgcGF5bG9hZCBieSBvYmplY3QgaWRlbnRpdHkgKHNlZVxuICogdGh1bmRlcnN0cnVjay9wcmUtcm9vdC50cykuIEhlYWRlcnMgYXJlIGZlZCBvbiBwdXJwb3NlOiB0aGV5IGNhcnJ5IHRoZVxuICogY29ycmVsYXRpb24gaWRzICh0cmFjZXBhcmVudCwgeC1yZXF1ZXN0LWlkLCDigKYpIHRoYXQgc3RpdGNoIHByZS1yb290XG4gKiBmb3JlbnNpY3MgdG8gdXBzdHJlYW0gdHJhY2VzLiBUaGUgcmVjb3JkIG1pcnJvcnMgdGhlIHJlcXVlc3Qg4oCUIGRldGFpbFxuICogcmVkdWN0aW9uIC8gcmVkYWN0aW9uIGlzIGEgc2VwYXJhdGUgY29uY2Vybi5cbiAqXG4gKiBXaXRoIGBzdG9yZVJlcXVlc3RgIHRoZSByYXcgcmVxdWVzdCBvYmplY3QgaXRzZWxmIGlzIGxpbmtlZCBpbnRvIHRoZVxuICogcmVjb3JkIChgcmF3LnJlcXVlc3RgKSBhbmQgc3RhbXBlZCBhcyBhIGNvcnJlbGF0aW9uIGtleSwgc28gY29kZSBob2xkaW5nXG4gKiBvbmx5IHRoZSByZXF1ZXN0IOKAlCBhbiBleGNlcHRpb24gZmlsdGVyLCBzYXkg4oCUIHJlc29sdmVzIGdldFByZVJvb3QocmVxKS5cbiAqIFJldGVudGlvbiBpcyB1bmNoYW5nZWQ6IHRoZSByZWNvcmQgc3RpbGwgZGllcyB3aXRoIHRoZSByZXF1ZXN0IG9iamVjdHMuXG4gKlxuICogVGhlIGNvbmZpZyBhcnJpdmVzIHRocm91Z2ggREkgKE1ORU1PTklDQV9USFVOREVSU1RSVUNLX09QVElPTlMpLCBuZXZlclxuICogdGhyb3VnaCBhIHBsYWluIGNvbnN0cnVjdG9yIHBhcmFtZXRlcjogZGVzaWduOnBhcmFtdHlwZXMgd291bGQgbWFrZSBOZXN0XG4gKiB0cnkgdG8gcmVzb2x2ZSBpdCBhcyBhIHByb3ZpZGVyIGFuZCBicmVhayBjbGFzcy1iYXNlZCB3aXJpbmcgaW4gY29udGV4dHNcbiAqIHdoZXJlIHRoZSB0b2tlbiB3YXMgbmV2ZXIgcmVnaXN0ZXJlZC4gQE9wdGlvbmFsKCkga2VlcHMgdGhlIGRlZmF1bHRzXG4gKiB0aGVyZSDigJQgZS5nLiBwZXItY29udHJvbGxlciBAVXNlSW50ZXJjZXB0b3JzKG10aSkgcnVucyB3aXRob3V0IHRoZVxuICogcmVxdWVzdCBsaW5rOyB0aGUgZmxhZyBpcyBhIGZvclJvb3Qgb3B0aW9uLlxuICovXG5pbXBvcnQgdHlwZSB7IE5lc3RJbnRlcmNlcHRvciwgRXhlY3V0aW9uQ29udGV4dCwgQ2FsbEhhbmRsZXIgfSBmcm9tICdAbmVzdGpzL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCwgSW5qZWN0IH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHR5cGUgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmZWVkUHJlUm9vdCwgdHlwZSBSYXdQcmVSb290UGF5bG9hZCB9IGZyb20gJy4uL3RodW5kZXJzdHJ1Y2svcHJlLXJvb3QuanMnO1xuaW1wb3J0IHsgTU5FTU9OSUNBX1RIVU5ERVJTVFJVQ0tfT1BUSU9OUyB9IGZyb20gJy4uL3Rva2Vucy5qcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGh1bmRlcnN0cnVja09wdGlvbnMge1xuXHQvKipcblx0ICogTGluayB0aGUgcmF3IHJlcXVlc3Qgb2JqZWN0IGludG8gdGhlIHByZS1yb290IHJlY29yZCAoYHJhdy5yZXF1ZXN0YClcblx0ICogQU5EIHN0YW1wIGl0IGFzIGEgY29ycmVsYXRpb24ga2V5LCBzbyBnZXRQcmVSb290KHJlcSkgcmVzb2x2ZXMgZnJvbVxuXHQgKiBhbnl3aGVyZSB0aGUgcmVxdWVzdCBpcyByZWFjaGFibGUg4oCUIGUuZy4gYW4gZXhjZXB0aW9uIGZpbHRlciBob2xkaW5nXG5cdCAqIG9ubHkgQFJlcSgpLiBSZXRlbnRpb24gaXMgdW5jaGFuZ2VkOiB0aGUgcmVjb3JkIGRpZXMgd2l0aCB0aGUgcmVxdWVzdC5cblx0ICovXG5cdHN0b3JlUmVxdWVzdD86IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNbmVtb25pY2FUaHVuZGVyc3RydWNrSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBOZXN0SW50ZXJjZXB0b3Ige1xuXHRwcml2YXRlIHJlYWRvbmx5IHN0b3JlUmVxdWVzdDogYm9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvciAoXG5cdFx0QE9wdGlvbmFsKCkgQEluamVjdChNTkVNT05JQ0FfVEhVTkRFUlNUUlVDS19PUFRJT05TKSBvcHRpb25zPzogVGh1bmRlcnN0cnVja09wdGlvbnMgfCBudWxsLFxuXHQpIHtcblx0XHR0aGlzLnN0b3JlUmVxdWVzdCA9IG9wdGlvbnM/LnN0b3JlUmVxdWVzdCA9PT0gdHJ1ZTtcblx0fVxuXG5cdGludGVyY2VwdCAoY29udGV4dDogRXhlY3V0aW9uQ29udGV4dCwgbmV4dDogQ2FsbEhhbmRsZXIpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcblx0XHRpZiAoY29udGV4dC5nZXRUeXBlKCkgPT09ICdodHRwJykge1xuXHRcdFx0Y29uc3QgcmVxID0gY29udGV4dC5zd2l0Y2hUb0h0dHAoKS5nZXRSZXF1ZXN0KCk7XG5cdFx0XHRjb25zdCByYXc6IFJhd1ByZVJvb3RQYXlsb2FkID0ge1xuXHRcdFx0XHRtZXRob2QgIDogcmVxLm1ldGhvZCxcblx0XHRcdFx0dXJsICAgICA6IHJlcS51cmwsXG5cdFx0XHRcdHBhcmFtcyAgOiByZXEucGFyYW1zLFxuXHRcdFx0XHRxdWVyeSAgIDogcmVxLnF1ZXJ5LFxuXHRcdFx0XHRib2R5ICAgIDogcmVxLmJvZHksXG5cdFx0XHRcdGhlYWRlcnMgOiByZXEuaGVhZGVycyxcblx0XHRcdH07XG5cdFx0XHRpZiAodGhpcy5zdG9yZVJlcXVlc3QpIHtcblx0XHRcdFx0cmF3LnJlcXVlc3QgPSByZXE7XG5cdFx0XHR9XG5cdFx0XHRmZWVkUHJlUm9vdChyYXcpO1xuXHRcdH1cblx0XHRyZXR1cm4gbmV4dC5oYW5kbGUoKTtcblx0fVxufVxuIl19
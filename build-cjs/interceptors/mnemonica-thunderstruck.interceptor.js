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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicaThunderstruckInterceptor = void 0;
const common_1 = require("@nestjs/common");
const pre_root_js_1 = require("../thunderstruck/pre-root.js");
const tokens_js_1 = require("../tokens.js");
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
            (0, pre_root_js_1.feedPreRoot)(raw);
        }
        return next.handle();
    }
};
exports.MnemonicaThunderstruckInterceptor = MnemonicaThunderstruckInterceptor;
exports.MnemonicaThunderstruckInterceptor = MnemonicaThunderstruckInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(tokens_js_1.MNEMONICA_THUNDERSTRUCK_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], MnemonicaThunderstruckInterceptor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWNhLXRodW5kZXJzdHJ1Y2suaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW50ZXJjZXB0b3JzL21uZW1vbmljYS10aHVuZGVyc3RydWNrLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSwyQ0FBOEQ7QUFFOUQsOERBQW1GO0FBQ25GLDRDQUErRDtBQWF4RCxJQUFNLGlDQUFpQyxHQUF2QyxNQUFNLGlDQUFpQztJQUM1QixZQUFZLENBQVU7SUFFdkMsWUFDc0QsT0FBcUM7UUFFMUYsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLEVBQUUsWUFBWSxLQUFLLElBQUksQ0FBQztJQUNwRCxDQUFDO0lBRUQsU0FBUyxDQUFFLE9BQXlCLEVBQUUsSUFBaUI7UUFDdEQsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDbEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2hELE1BQU0sR0FBRyxHQUFzQjtnQkFDOUIsTUFBTSxFQUFJLEdBQUcsQ0FBQyxNQUFNO2dCQUNwQixHQUFHLEVBQU8sR0FBRyxDQUFDLEdBQUc7Z0JBQ2pCLE1BQU0sRUFBSSxHQUFHLENBQUMsTUFBTTtnQkFDcEIsS0FBSyxFQUFLLEdBQUcsQ0FBQyxLQUFLO2dCQUNuQixJQUFJLEVBQU0sR0FBRyxDQUFDLElBQUk7Z0JBQ2xCLE9BQU8sRUFBRyxHQUFHLENBQUMsT0FBTzthQUNyQixDQUFDO1lBQ0YsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3ZCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ25CLENBQUM7WUFDRCxJQUFBLHlCQUFXLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3RCLENBQUM7Q0FDRCxDQUFBO0FBM0JZLDhFQUFpQzs0Q0FBakMsaUNBQWlDO0lBRDdDLElBQUEsbUJBQVUsR0FBRTtJQUtWLFdBQUEsSUFBQSxpQkFBUSxHQUFFLENBQUE7SUFBRSxXQUFBLElBQUEsZUFBTSxFQUFDLDJDQUErQixDQUFDLENBQUE7O0dBSnpDLGlDQUFpQyxDQTJCN0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5lc3RKUyBpbnRlcmNlcHRvciB0aGF0IGZlZWRzIHRoZSByYXcgSFRUUCBib3VuZGFyeSBwYXlsb2FkIGludG8gZGl2ZSdzXG4gKiBUaHVuZGVyc3RydWNrIGNvbGxlY3RvciBCRUZPUkUgYW55IG1uZW1vbmljYSBjb25zdHJ1Y3Rpb24gaGFwcGVucy5cbiAqXG4gKiBQZXIgcmVxdWVzdCBpdCBzdG9yZXMgYHsgbWV0aG9kLCB1cmwsIHBhcmFtcywgcXVlcnksIGJvZHksIGhlYWRlcnMgfWAgYW5kXG4gKiBzdGFtcHMgdGhlIHBhcmFtcyAvIHF1ZXJ5IC8gYm9keSAvIGhlYWRlcnMgb2JqZWN0cyBzbyBwaXBlcyBhbmQgY29uc3RydWN0XG4gKiBoYW5kbGVycyBjb3JyZWxhdGUgdGhlIHBheWxvYWQgYnkgb2JqZWN0IGlkZW50aXR5IChzZWVcbiAqIHRodW5kZXJzdHJ1Y2svcHJlLXJvb3QudHMpLiBIZWFkZXJzIGFyZSBmZWQgb24gcHVycG9zZTogdGhleSBjYXJyeSB0aGVcbiAqIGNvcnJlbGF0aW9uIGlkcyAodHJhY2VwYXJlbnQsIHgtcmVxdWVzdC1pZCwg4oCmKSB0aGF0IHN0aXRjaCBwcmUtcm9vdFxuICogZm9yZW5zaWNzIHRvIHVwc3RyZWFtIHRyYWNlcy4gVGhlIHJlY29yZCBtaXJyb3JzIHRoZSByZXF1ZXN0IOKAlCBkZXRhaWxcbiAqIHJlZHVjdGlvbiAvIHJlZGFjdGlvbiBpcyBhIHNlcGFyYXRlIGNvbmNlcm4uXG4gKlxuICogV2l0aCBgc3RvcmVSZXF1ZXN0YCB0aGUgcmF3IHJlcXVlc3Qgb2JqZWN0IGl0c2VsZiBpcyBsaW5rZWQgaW50byB0aGVcbiAqIHJlY29yZCAoYHJhdy5yZXF1ZXN0YCkgYW5kIHN0YW1wZWQgYXMgYSBjb3JyZWxhdGlvbiBrZXksIHNvIGNvZGUgaG9sZGluZ1xuICogb25seSB0aGUgcmVxdWVzdCDigJQgYW4gZXhjZXB0aW9uIGZpbHRlciwgc2F5IOKAlCByZXNvbHZlcyBnZXRQcmVSb290KHJlcSkuXG4gKiBSZXRlbnRpb24gaXMgdW5jaGFuZ2VkOiB0aGUgcmVjb3JkIHN0aWxsIGRpZXMgd2l0aCB0aGUgcmVxdWVzdCBvYmplY3RzLlxuICpcbiAqIFRoZSBjb25maWcgYXJyaXZlcyB0aHJvdWdoIERJIChNTkVNT05JQ0FfVEhVTkRFUlNUUlVDS19PUFRJT05TKSwgbmV2ZXJcbiAqIHRocm91Z2ggYSBwbGFpbiBjb25zdHJ1Y3RvciBwYXJhbWV0ZXI6IGRlc2lnbjpwYXJhbXR5cGVzIHdvdWxkIG1ha2UgTmVzdFxuICogdHJ5IHRvIHJlc29sdmUgaXQgYXMgYSBwcm92aWRlciBhbmQgYnJlYWsgY2xhc3MtYmFzZWQgd2lyaW5nIGluIGNvbnRleHRzXG4gKiB3aGVyZSB0aGUgdG9rZW4gd2FzIG5ldmVyIHJlZ2lzdGVyZWQuIEBPcHRpb25hbCgpIGtlZXBzIHRoZSBkZWZhdWx0c1xuICogdGhlcmUg4oCUIGUuZy4gcGVyLWNvbnRyb2xsZXIgQFVzZUludGVyY2VwdG9ycyhtdGkpIHJ1bnMgd2l0aG91dCB0aGVcbiAqIHJlcXVlc3QgbGluazsgdGhlIGZsYWcgaXMgYSBmb3JSb290IG9wdGlvbi5cbiAqL1xuaW1wb3J0IHR5cGUgeyBOZXN0SW50ZXJjZXB0b3IsIEV4ZWN1dGlvbkNvbnRleHQsIENhbGxIYW5kbGVyIH0gZnJvbSAnQG5lc3Rqcy9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwsIEluamVjdCB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcbmltcG9ydCB0eXBlIHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmVlZFByZVJvb3QsIHR5cGUgUmF3UHJlUm9vdFBheWxvYWQgfSBmcm9tICcuLi90aHVuZGVyc3RydWNrL3ByZS1yb290LmpzJztcbmltcG9ydCB7IE1ORU1PTklDQV9USFVOREVSU1RSVUNLX09QVElPTlMgfSBmcm9tICcuLi90b2tlbnMuanMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRodW5kZXJzdHJ1Y2tPcHRpb25zIHtcblx0LyoqXG5cdCAqIExpbmsgdGhlIHJhdyByZXF1ZXN0IG9iamVjdCBpbnRvIHRoZSBwcmUtcm9vdCByZWNvcmQgKGByYXcucmVxdWVzdGApXG5cdCAqIEFORCBzdGFtcCBpdCBhcyBhIGNvcnJlbGF0aW9uIGtleSwgc28gZ2V0UHJlUm9vdChyZXEpIHJlc29sdmVzIGZyb21cblx0ICogYW55d2hlcmUgdGhlIHJlcXVlc3QgaXMgcmVhY2hhYmxlIOKAlCBlLmcuIGFuIGV4Y2VwdGlvbiBmaWx0ZXIgaG9sZGluZ1xuXHQgKiBvbmx5IEBSZXEoKS4gUmV0ZW50aW9uIGlzIHVuY2hhbmdlZDogdGhlIHJlY29yZCBkaWVzIHdpdGggdGhlIHJlcXVlc3QuXG5cdCAqL1xuXHRzdG9yZVJlcXVlc3Q/OiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW5lbW9uaWNhVGh1bmRlcnN0cnVja0ludGVyY2VwdG9yIGltcGxlbWVudHMgTmVzdEludGVyY2VwdG9yIHtcblx0cHJpdmF0ZSByZWFkb25seSBzdG9yZVJlcXVlc3Q6IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3IgKFxuXHRcdEBPcHRpb25hbCgpIEBJbmplY3QoTU5FTU9OSUNBX1RIVU5ERVJTVFJVQ0tfT1BUSU9OUykgb3B0aW9ucz86IFRodW5kZXJzdHJ1Y2tPcHRpb25zIHwgbnVsbCxcblx0KSB7XG5cdFx0dGhpcy5zdG9yZVJlcXVlc3QgPSBvcHRpb25zPy5zdG9yZVJlcXVlc3QgPT09IHRydWU7XG5cdH1cblxuXHRpbnRlcmNlcHQgKGNvbnRleHQ6IEV4ZWN1dGlvbkNvbnRleHQsIG5leHQ6IENhbGxIYW5kbGVyKTogT2JzZXJ2YWJsZTx1bmtub3duPiB7XG5cdFx0aWYgKGNvbnRleHQuZ2V0VHlwZSgpID09PSAnaHR0cCcpIHtcblx0XHRcdGNvbnN0IHJlcSA9IGNvbnRleHQuc3dpdGNoVG9IdHRwKCkuZ2V0UmVxdWVzdCgpO1xuXHRcdFx0Y29uc3QgcmF3OiBSYXdQcmVSb290UGF5bG9hZCA9IHtcblx0XHRcdFx0bWV0aG9kICA6IHJlcS5tZXRob2QsXG5cdFx0XHRcdHVybCAgICAgOiByZXEudXJsLFxuXHRcdFx0XHRwYXJhbXMgIDogcmVxLnBhcmFtcyxcblx0XHRcdFx0cXVlcnkgICA6IHJlcS5xdWVyeSxcblx0XHRcdFx0Ym9keSAgICA6IHJlcS5ib2R5LFxuXHRcdFx0XHRoZWFkZXJzIDogcmVxLmhlYWRlcnMsXG5cdFx0XHR9O1xuXHRcdFx0aWYgKHRoaXMuc3RvcmVSZXF1ZXN0KSB7XG5cdFx0XHRcdHJhdy5yZXF1ZXN0ID0gcmVxO1xuXHRcdFx0fVxuXHRcdFx0ZmVlZFByZVJvb3QocmF3KTtcblx0XHR9XG5cdFx0cmV0dXJuIG5leHQuaGFuZGxlKCk7XG5cdH1cbn1cbiJdfQ==
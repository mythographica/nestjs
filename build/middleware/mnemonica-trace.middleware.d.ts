/**
 * NestJS middleware that creates an OpenTelemetry span per HTTP request
 * and stores it in AsyncLocalStorage so mnemonica hooks can nest under it.
 */
import type { NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import type { Tracer } from '@opentelemetry/api';
import { MnemonicaOtelProvider } from '../providers/mnemonica-otel.provider.js';
import { AsyncFlowProvider } from '../providers/async-flow.provider.js';
export declare class MnemonicaTraceMiddleware implements NestMiddleware {
    private readonly tracer;
    private readonly otel;
    private readonly asyncFlow?;
    constructor(tracer: Tracer, otel: MnemonicaOtelProvider, asyncFlow?: AsyncFlowProvider | undefined);
    use(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=mnemonica-trace.middleware.d.ts.map
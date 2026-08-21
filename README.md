# @mnemonica/nestjs

A NestJS adapter for the mnemonica stack — written by someone who got tired
of losing the data when a request failed.

Here is the story this package tells. A request arrives as a plain JSON
payload. You validate it, you construct your domain object from it, and
somewhere six calls later something throws — and the error tells you
*what* broke but not *which data* walked in the door and caused it. The
payload is gone, the context is gone, and you are left archeologizing
through logs.

The mnemonica stack exists to end that. Three layers, three packages:

- [`mnemonica`](https://www.npmjs.com/package/mnemonica) — instance
  inheritance: types defined via `define()`, constructed from parent
  instances, lineage carried in the prototype chain. Your objects remember
  where they came from.
- [`@mnemonica/dive`](https://www.npmjs.com/package/@mnemonica/dive) —
  execution-flow tracing: context pinned to instances, errors that carry
  their data, a bounded flight-recorder trace. Framework-agnostic.
- **this package** — the wiring: hooks, pipe, interceptors, middleware, and
  DI tokens that connect both into the NestJS request lifecycle.

The payoff: when something fails in production, the error object itself
carries the instance that failed and the flow that produced it. No
correlation-id scavenger hunt. The data *is* the forensics.

## Install

```bash
npm install @mnemonica/nestjs mnemonica @mnemonica/dive \
  class-validator class-transformer
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `reflect-metadata`
(and `@opentelemetry/api` only if you use the tracer options).

## Step by step: a request becomes a traceable instance

**Step 1 — define the type.** This is plain mnemonica, no NestJS involved:

```typescript
import { define } from 'mnemonica';
import { getPreRoot } from '@mnemonica/nestjs';

export const PaymentEntity = define(
  'PaymentEntity',
  function (this: PaymentEntityInstance, data: CreatePaymentDto) {
    // getPreRoot resolves THIS request's raw payloads (see step 2)
    const preRoot = getPreRoot(data);
    if (preRoot?.raw) {
      this.preRoot = preRoot.raw;
    }
    Object.assign(this, data);
  },
);
```

**Step 2 — wire the module.** `thunderstruck: true` attaches the dive
lifecycle hooks to the collection and registers the pre-root interceptor
globally:

```typescript
import { Module } from '@nestjs/common';
import { MnemonicaModule } from '@mnemonica/nestjs';

@Module({
  imports: [
    MnemonicaModule.forRoot({
      autoExtract   : true,  // auto-extract returned instances
      thunderstruck : true,  // dive hooks + pre-root payloads
      traceLimit    : 1024,  // dive ring size = its memory bound
    }),
  ],
})
export class AppModule {}
```

**Step 3 — validate the wire, then construct.** The pipe validates a plain
DTO with class-validator, then constructs the mnemonica instance:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { mvp } from '@mnemonica/nestjs';

@Controller('payments')
export class PaymentsController {
  @Post()
  create (
    @Body(mvp.forType(PaymentEntity, CreatePaymentDto))
    payment: InstanceType<typeof PaymentEntity>,
  ) {
    return payment; // a real mnemonica instance, lineage and all
  }
}
```

> **Why not `@decorate()` the DTO class itself?** Because Nest /
> class-transformer instantiate DTOs with a zero-arg `new` and assign
> properties afterwards — the mnemonica instance would be created with
> empty `__args__`, and the constructor arguments *are* the data flow.
> The two-step pipe is not a workaround: the DTO stays the wire's
> validation schema, the mnemonica instance is where lineage begins.

**Step 4 — return instances directly.** With `autoExtract`, the global
serializer interceptor calls `.extract()` on any mnemonica instance a
controller returns, before JSON serialization. No manual mapping.

**Step 5 — when it fails, the error carries the data.** Dive pins the
failed instance and its execution branch onto the error object itself, so
an exception filter (or a process-level handler) can report *which data*
caused the failure:

```typescript
import { getErrorInstance, getFlow } from '@mnemonica/dive';

catch (err: unknown) {
  if (err instanceof Error) {
    const instance = getErrorInstance(err); // the data that failed
    const branch = getFlow(err);            // the flow that produced it
    // ... log / report / feed your APM
  }
}
```

## `MnemonicaModule.forRoot(options?)`

Registers the global/default `TypesCollection`.

| Option          | Type                              | Default        | Description |
|-----------------|-----------------------------------|----------------|-------------|
| `collection`    | `TypesCollection`                 | `defaultTypes` | Use a custom types collection |
| `autoExtract`   | `boolean`                         | `false`        | Globally register `MnemonicaSerializerInterceptor` |
| `telemetry`     | `boolean`                         | `false`        | Wire console telemetry hooks |
| `tracer`        | `Tracer`                          | `undefined`    | OTel tracer — spans per construction, nested along the prototype chain |
| `traceLimit`    | `number`                          | `1024`         | Dive ring-buffer size; applied only when provided, never overrides a direct `setTraceLimit()` |
| `thunderstruck` | `boolean \| ThunderstruckOptions` | `false`        | Dive hooks + global `MnemonicaThunderstruckInterceptor`; `{ storeRequest: true }` also links the raw request into the record |

The default trace limit is exported as `DEFAULT_TRACE_LIMIT` so the knob
is discoverable where the module is configured:

```typescript
import { DEFAULT_TRACE_LIMIT } from '@mnemonica/nestjs';
```

## `MnemonicaModule.forFeature(name, config?)`

Creates an isolated `TypesCollection` per module. Pass mnemonica
`constructorOptions` as the second argument:

```typescript
@Module({
  imports: [
    MnemonicaModule.forFeature('payments', { strictChain: false }),
  ],
})
export class PaymentsModule {}
```

| Parameter | Type                 | Description |
|-----------|----------------------|-------------|
| `name`    | `string`             | Feature identifier for the injection token |
| `config`  | `constructorOptions` | Optional: `strictChain`, `blockErrors`, etc. |

## Shortcuts: `mti` / `mvp` / `mtm`

The long names are for reading; the short aliases are for typing. They
enable **per-controller** wiring instead of the global
`forRoot({ thunderstruck: true })`:

```typescript
import { mti, mvp } from '@mnemonica/nestjs';

@Controller('bundle')
@UseInterceptors(mti) // pre-root feed on THESE routes only
export class BundleController {
  @Post('invoice')
  createInvoice (
    @Body(mvp.forType(InvoiceEntity, CreateInvoiceDto))
    invoice: InstanceType<typeof InvoiceEntity>,
  ) {
    return invoice;
  }
}
```

| Alias | Full name                      | Kind |
|-------|--------------------------------|------|
| `mti` | `MnemonicaThunderstruckInterceptor` | pre-root payload feed, per-controller |
| `mvp` | `MnemonicaValidationPipe`           | validate DTO → construct instance |
| `mtm` | `MnemonicaTraceMiddleware`          | one OTel span per HTTP request, nested hooks |

`mtm` needs a `Tracer` and the `MnemonicaOtelProvider` in DI (it nests
construction spans under the request span):

```typescript
import type { NestModule, MiddlewareConsumer } from '@nestjs/common';

export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer.apply(mtm).forRoutes('*');
  }
}
```

## Thunderstruck — pre-root request data

With `thunderstruck: true` (or `@UseInterceptors(mti)` per controller),
the interceptor stashes `{ method, url, params, query, body, headers }`
before any construction happens — headers included on purpose: they carry
the correlation ids (`traceparent`, `x-request-id`, …) that stitch the
forensics to upstream traces. `mvp` then attaches the validated DTO
alongside it.

Correlation is by **object identity**: the body / query / params / headers
object the interceptor stamped is the same reference pipes and construct
handlers receive — so a construct handler resolves its request's payloads
with `getPreRoot(data)`. No ALS, no cross-request races.

Lifetime is the request's own: payloads live in a `WeakMap` keyed on the
request objects — no store to drain, no release step. When the request
objects are garbage-collected, the payloads go with them. The record
stays resolvable after construction for as long as the request object
lives, so an exception filter can still report WHICH data caused a
failure — that data is the forensics.

`storeRequest` — `forRoot({ thunderstruck: { storeRequest: true } })` —
links the raw request object itself into the record (`raw.request`) and
stamps it as a correlation key too, so code holding only the request — an
exception filter with `@Req()`, say — resolves `getPreRoot(req)` directly.
Retention is unchanged: the `WeakMap`'s ephemeron semantics keep the
record→request cycle collectable — the record still dies with the request.
Standalone feeders get the same by passing `request` in the payload they
hand to `feedPreRoot`.

## Standalone usage (no NestJS)

Everything dive-related works without the framework. `attachHooks` wires
any mnemonica collection to dive's lifecycle tracing; the pre-root store
is plain functions you can feed from your own boundary:

```typescript
import {
  attachHooks, feedPreRoot, getPreRoot,
} from '@mnemonica/nestjs';
import { defaultTypes } from 'mnemonica/module';

attachHooks(defaultTypes); // create edges + wrapped instance methods

// your own HTTP boundary (raw node, fastify, whatever):
function onRequest (method: string, url: string, body: unknown) {
  feedPreRoot({ method, url, body });
}

// inside any construct handler:
const preRoot = getPreRoot(data); // { raw, validated } of THIS request
```

## Usage without mnemonica

If you don't use mnemonica, you don't need this adapter — use
[`@mnemonica/dive`](https://www.npmjs.com/package/@mnemonica/dive)
directly. Its primitives work on plain objects and classes:

```typescript
import { wrap, getErrorInstance, getFlow } from '@mnemonica/dive';

const processOrder = wrap(async (order) => {
  // ... your code
}, order); // context = the data itself

try {
  await processOrder(order);
} catch (err) {
  getErrorInstance(err); // → order
  getFlow(err);          // → the branch that produced the error
}
```

What you keep: `wrap`, `current`, `getFlow`, `getErrorInstance`,
`setTraceLimit` — the whole engine. What you lose without mnemonica: the
lifecycle wiring (`create` edges, automatic method wrapping via
`attachHooks`), and everything this adapter adds on top (pipe, serializer,
pre-root store, OTel spans).

## Corners and caveats

- **DTOs stay DTOs.** Nest/class-transformer instantiate DTOs with a
  zero-arg `new` and assign properties after — see step 3 for why the
  pipe is two-step by design.
- **`file:`-symlink development caveat.** When the adapter is consumed
  through a `file:` link (monorepo local dev), each linked package
  carries its own `class-transformer` copy, and `@Type(() => NestedDto)`
  metadata is stored per-copy — nested DTO validation then silently
  degrades (nested objects stay plain and fail as `unknownValue`). Keep
  DTOs **flat** in that topology, or install with a single shared
  `class-transformer`. Real npm consumers are unaffected: semver dedupe
  leaves one copy. `class-validator` itself is immune — its metadata
  storage is `globalThis`-shared.
- **Primitive request bodies are not identity-correlatable.** A
  string/number body can't key a `WeakMap`; it is still inside the raw
  pre-root payload, just not resolvable via `getPreRoot`.
- **Headers are fed, all of them.** The record mirrors the request —
  including `authorization` if present — because headers carry the
  correlation ids (`traceparent`, `x-request-id`) that stitch forensics
  to upstream traces, and bodies carry credentials just as often. Detail
  reduction / redaction is a separate, planned task; until then treat
  pre-root payloads in reports the way you treat request logs.
- **Async constructors** (mnemonica async types): consume them with
  `const instance = await new MyAsyncType(data)`. Fire-and-forget
  construction makes failures surface as real process-level
  `unhandledRejection` — sometimes the demo you want, never the default.
- **`traceLimit` is dive's memory bound.** The ring holds at most N
  edges, and edges strongly reference their instances until evicted.
  Keep raw third-party buffers OFF your instances (store an id/hash);
  shrink the limit under payload-heavy load.
- **Global vs per-controller thunderstruck.** `forRoot({ thunderstruck })`
  feeds every route; `@UseInterceptors(mti)` feeds only the routes you
  choose. Prefer per-controller when only some flows need forensics. The
  `storeRequest` flag is a `forRoot` option — per-controller wiring never
  registers the options token, so the interceptor keeps the default (no
  request link).

## Other exports

### `MnemonicaBody` — convenience decorator

Combines `@Body()` with the validation pipe:

```typescript
@Post()
async create (
  @MnemonicaBody(PaymentEntity, { dtoClass: CreatePaymentDto })
  payment: InstanceType<typeof PaymentEntity>,
) {
  return payment;
}
```

### `isMnemonicaInstance(value)`

Runtime type guard using `getProps()` — works across realms, no
`instanceof` hacks:

```typescript
import { isMnemonicaInstance } from '@mnemonica/nestjs';

if (isMnemonicaInstance(value)) {
  console.log(value.extract());
}
```

### `InjectMnemonicaCollection(name?)`

Inject a `TypesCollection` by feature name. Omit or use `'default'` for
the root collection:

```typescript
@Injectable()
export class PaymentsService {
  constructor (
    @InjectMnemonicaCollection() private collection: TypesCollection,
  ) {}
}
```

## Type safety with `lookup()`

Use `lookup()` from `mnemonica` for fully type-safe type retrieval when
your `TypeRegistry` is augmented (e.g. via
[`@mnemonica/tactica`](https://www.npmjs.com/package/@mnemonica/tactica)):

```typescript
import { lookup } from 'mnemonica';

const PaymentEntity = lookup('PaymentEntity');
const payment = new PaymentEntity({ amount: 100 });
```

## For AI agents

This package is deliberately agent-friendly. If you are an AI assistant
working in a codebase that uses `@mnemonica/nestjs`, here is the map:

- **The mental model is small.** Requests become instances at the
  validation pipe (`mvp`); instances remember their request via the
  pre-root store (`getPreRoot`); errors carry their instance via dive
  (`getErrorInstance`). Everything else is wiring.
- **Do not flatten the two-step pipe.** If you see
  `@Body(mvp.forType(Type, Dto))`, the DTO validates the wire and the
  mnemonica constructor receives the validated data. Collapsing these
  into a decorated DTO class breaks construction — see step 3.
- **`getPreRoot(data)` only resolves by object identity.** It works
  inside construct handlers that receive the exact request payload
  object. It will not resolve a re-parsed copy, a primitive body, or
  data from a different request.
- **Prefer per-controller wiring** (`@UseInterceptors(mti)`) over the
  global `thunderstruck: true` when only some routes need forensics.
- **The full contributor contract** — architecture, invariants, and the
  testing gate — lives in [`AGENTS.md`](./AGENTS.md).

## License

MIT

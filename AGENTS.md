# AGENTS.md — @mnemonica/nestjs

Guidance for AI agents modifying this package. If you are *using* the
adapter in your own project, start with [`README.md`](./README.md).

## What this is

The NestJS wiring layer for the mnemonica stack. It connects two engines
into the NestJS request lifecycle:

- **mnemonica** — instance inheritance (`define()`, lineage in the
  prototype chain)
- **@mnemonica/dive** — execution-flow tracing (context pinned to
  instances, errors carrying their data)

This package adds no new semantics of its own; it moves data across the
boundary: HTTP request → validated DTO → mnemonica instance → traceable
failure.

## File map

| Path | Role |
|---|---|
| `src/mnemonica.module.ts` | `MnemonicaModule.forRoot()` / `forFeature()`; owns global interceptor registration and `DEFAULT_TRACE_LIMIT` |
| `src/pipes/mnemonica-validation.pipe.ts` | `mvp` — validate DTO with class-validator, then construct the mnemonica instance |
| `src/interceptors/mnemonica-thunderstruck.interceptor.ts` | `mti` — feeds pre-root request payloads before construction |
| `src/interceptors/mnemonica-serializer.interceptor.ts` | calls `.extract()` on returned mnemonica instances (`autoExtract`) |
| `src/middleware/mnemonica-trace.middleware.ts` | `mtm` — one OTel span per HTTP request, nested hooks |
| `src/thunderstruck/pre-root.ts` | the pre-root store: `feedPreRoot` / `getPreRoot`, WeakMap-keyed on request payload objects |
| `src/hooks/attach-hooks.ts` | wires a TypesCollection to dive's lifecycle tracing |
| `src/providers/mnemonica-otel.provider.ts` | OTel tracer provider for nested construction spans |
| `src/decorators/mnemonica-body.decorator.ts` | `MnemonicaBody` — `@Body()` + validation pipe in one |
| `src/tokens.ts` | DI tokens, `InjectMnemonicaCollection` |
| `src/utils/is-mnemonica-instance.ts` | realm-safe type guard via `getProps()` |

## Invariants (do not break these)

1. **The pipe is two-step by design.** class-validator validates the plain
   DTO; the mnemonica constructor receives the validated data. Never
   collapse this into a decorated DTO — Nest/class-transformer instantiate
   DTOs with a zero-arg `new`, which would give the instance empty
   `__args__`. The constructor arguments ARE the data flow.
2. **Pre-root correlation is by object identity.** The pre-root store is a
   `WeakMap` keyed on the exact request payload objects (body, query,
   params, headers). Re-parsed copies, primitives, and cross-request
   objects must not resolve. No ALS anywhere.
3. **Retention is the request's lifetime.** There is no store-draining or
   release step by design; the ephemeron semantics are the feature. Do not
   add manual cleanup APIs.
4. **Headers are fed whole, on purpose** (correlation ids). Redaction is a
   planned separate task — do not silently strip fields.

## Build & test

```bash
npm run build   # tsc → build/
npm test        # vitest run (36 tests)
```

Both must be green before a change is done. `prepublishOnly` runs build +
tests automatically.

**vitest config caveat:** `vitest.config.ts` aliases `mnemonica` to
`../core/module/index.js` when that sibling checkout exists (local dev
against live core source), guarded by `fs.existsSync`. On CI and fresh
clones the alias drops out and the registry `mnemonica` from node_modules
is used. Do not remove the guard — unguarded, this exact alias once failed
every spec on CI with `ERR_MODULE_NOT_FOUND`.

## Ecosystem position

This is the small public seam between `mnemonica` + `@mnemonica/dive` and
NestJS apps (the finecut pilots are the reference consumers). Changes to
mnemonica's construction semantics or dive's trace record shape ripple
here; check `README.md` examples still run when those packages bump.

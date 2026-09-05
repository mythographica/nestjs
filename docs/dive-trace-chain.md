# The Dive trace chain — how a construction becomes a span

This document describes the four-link chain that carries one mnemonica
construction all the way to Jaeger, and how mnemographica's combined
Dive layer (the `dive ◯` 3D toggle) corresponds to it. It is a logic
map, not a user guide — the README covers usage.

Terminology (canonical, Viktor 2026-09-04):

- **EDS** — dive's runtime ring storage: the recorded edges + their
  holders. (tactica's `eds.json` is the AoT *prediction* of that ring,
  named after it.)
- **Fiber** — one context segment of the ring: a wrap boundary, the
  constructions inside it, the nested wraps below.
- **Trace** — the bigger linear-order chain the Adapter constructs at
  runtime: it holds context across the framework boundary, pins errors,
  exports spans. **Trace (Adapter) ⊃ Fiber ⊃ EDS (dive ring).**

Line numbers cite the source as of 2026-09-04; symbols are the stable
anchor, lines drift.

## Link 1 — mnemonica fires the lifecycle hooks

`registerHook(hookType, cb)` (`core/src/api/hooks/registerHook.ts:19`)
registers a callback on a type or on a whole collection. During
construction `InstanceCreator` fires them:

- `invokePreHooks` (`core/src/api/types/InstanceCreator.ts:51`) runs at
  `:468`, BEFORE the construct handler. hookData carries
  `{ type, TypeName, existentInstance, args, InstanceModificator }` —
  `existentInstance` is the parent instance the subtype is being
  constructed from, `args` is the live constructor argument array
  (mutable — hooks may replace entries). Collection hooks fire first,
  then type hooks.
- `invokePostHooks` (`:90`) runs after construction. It picks the hook
  type by outcome: `inheritedInstance instanceof Error` →
  `'creationError'` (`:97`), otherwise `'postCreation'`. hookData adds
  `inheritedInstance` and `creator`; `existentInstance`/`args` are read
  back from the instance's props. Here the TYPE hook fires first, then
  the collection's.

A construction therefore emits exactly one of `postCreation` /
`creationError`, always preceded by `preCreation`.

## Link 2 — the adapter subscribes: `attachHooks`

`src/hooks/attach-hooks.ts` is the only place that knows mnemonica's
hook contract. It wires a whole TypesCollection in three registrations:

- **preCreation** — `enterContext(parent)` switches dive's current
  context to the parent instance BEFORE the constructor runs, so sync
  work inside the handler is attributed under the parent. Then every
  function argument is replaced by `wrapConstructorArg(arg, parent)`
  (guarded by `isWrappedFunction` — no double-wrap): callbacks handed to
  the constructor carry that context into whatever calls them later.
- **postCreation** — `upgradeConstructorArg(arg, instance)` re-parents
  the already-wrapped args onto the built instance; `recordCreation(
  TypeName, instance, parent)` writes the instance's `create` edge;
  `wrapInstanceMethods(instance)` wraps the instance's methods so the
  fiber continues through method calls.
- **creationError** — `recordCreationError(TypeName, error, parent)`
  writes the FAILED `create` edge under the surviving parent and pins
  the error to it.

This is the wiring the 3D graph draws as the **attachHooks hub** with
one **graft curve per really-constructed type** — a graft is this
hook set firing for that type's constructions.

## Link 3 — dive records into the ring

dive is engine-only; it knows nothing about mnemonica. The primitives
the adapter calls (`dive/src/index.ts`):

- `recordCreation` (`:1097`) — parents the new `create` edge on the
  **data-flow parent**: the parent instance's own `latestEdge`
  (`:1100`), falling back to the execution cursor only when truly
  nested (`activeDepth > 0`). The edge is settled immediately
  (`status: 'ok'`, `duration: 0` — the hook moment IS the completion)
  and marked `instanceSource: 'explicit'` (the instance arrived as an
  argument, never ambient). Then `emitCreate` (`:1119`) and
  `enterContext(instance)` (`:1121`) — the built instance becomes the
  current context.
- `recordCreationError` (`:1130`) — same parentage, but `pinError`
  runs BEFORE `emitCreate` (`:1153`), so subscribers already see the
  failure pinned when the event arrives.
- `enterContext` (`:503`) only moves the "newest-wins" pointer behind
  `current()` — deliberately NOT used for trace parentage, so
  concurrent flows cannot corrupt the trace through it.
- The wrap path around it: `recordEdge` at call time, `emitEnter`
  (`:257`) before the wrapped fn, `emitLeave` (`:266`) after a sync
  return, `emitSettle` (`:275`) when a promise resolves/rejects,
  `emitRecontext` (`:284`) when the context switches under a running
  edge.
- **Dispatch is contained** (`dispatchHook`, `:247`): every subscriber
  runs inside its own `try`, so a throwing hook degrades its own
  observability and never corrupts the edge, the result, or user code.

The ring, the `latestEdge` WeakMap, and the running-edges store ARE the
EDS — what the 3D graph draws as the **EDS ring encircling the
collection marker**: dive records everything the collection constructs.

## Link 4 — the adapter subscribes BACK to dive events

The same adapter that feeds the ring also consumes it — the terminal
zone where fiber data leaves the trace system (the 3D **sinks**):

- **`AsyncFlowProvider`** (`src/providers/async-flow.provider.ts`) —
  subscribes `enter`/`leave`/`create`. One `AsyncLocalStorage` carries
  a linked list of `FlowFrame`s: enter pushes, leave restores, and
  unwrapped async hops inherit the parental frame via ALS propagation.
  The adapter is the Node boundary where ALS is free — dive itself must
  stay engine-only and cannot touch `async_hooks`.
- **`DiveOtelProvider`** (`src/providers/dive-otel.provider.ts`) —
  subscribes `enter`/`leave`/`settle`/`recontext` and (dive ≥ 0.8.0)
  `create`. Every wrapped call becomes an OTEL span parented on dive's
  trace, carrying `code.filepath/line/column` (callsite parsed from the
  edge name) and `dive.root_edge_id`; edgeId→traceId pairs publish onto
  the bounded `globalThis.__mnemonicaDiveTraceIds` for the strategy
  push channel.
- **`MnemonicaExceptionFilter`** (`src/filters/mnemonica-exception.filter.ts`)
  — the read-back at Nest's error boundary: `getFlow(error)` (`:99`)
  recovers the dive branch off the error object itself (the pin from
  link 3), answers 500 with branch + errored construction + attempted
  args, and records its own error span.

Spans leave the process to **Jaeger over HTTP** — the only true
terminal outside the system.

## The graph-side correspondence

mnemographica's combined Dive layer (`dive ◯`) is this same chain,
drawn:

| 3D element | Chain meaning |
|---|---|
| amber bagel (torus) | one `dive.wrap` call site from `eds.json` |
| solid amber arrow (via) | the wrap's declared parent wrap (`via` chain) |
| dashed light-amber arrow (ctor) | construction-mediated ancestry: the source wrap's `createsTypes` holds T, the target runs in a T context — at runtime its first edge parents on T's `create` edge (link 3 parentage) |
| EDS ring at the origin | dive's ring storage (link 3) |
| attachHooks octahedron | link 2, the bootstrap wiring |
| graft curve hub → sphere | attachHooks firing for that type's constructions — drawn only for types `usages.json` proves are constructed |
| dimmed sphere (0.35) | never-created type: hooks never fire, no graft |
| path-hit line (0.5 / dim 0.12) | a wrap's `createsTypes` guarantee; dim = never taken (the EdsProbe diagnostic — a probe whose wrap creates `UserEntity` while EdsProbe itself is never constructed) |
| violet sink boxes | the three link-4 consumers |
| gold cone | Jaeger — outside the system |
| slate arrows | the export path, directed as data flows: ring → providers/filter (`getFlow / getErrorInstance`) → Jaeger |

Edge direction is data flow everywhere: a fiber is born at a bagel,
lands in the ring, and leaves through a sink.

# @mnemonica/nestjs

NestJS adapter for [mnemonica](https://github.com/mnemonica) — instance inheritance, data lineage, nominal typing, and hook-based observability.

## Install

```bash
npm install @mnemonica/nestjs mnemonica class-validator class-transformer
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `reflect-metadata`.

## Quick Start

```typescript
import { Module } from '@nestjs/common';
import { MnemonicaModule } from '@mnemonica/nestjs';

@Module({
  imports: [
    MnemonicaModule.forRoot({
      autoExtract: true,   // auto-call .extract() on returned instances
      telemetry: true,     // console logging for postCreation / creationError
    }),
  ],
})
export class AppModule {}
```

## API

### `MnemonicaModule.forRoot(options?)`

Registers the global/default `TypesCollection`.

| Option        | Type              | Default         | Description                                      |
|---------------|-------------------|-----------------|--------------------------------------------------|
| `collection`  | `TypesCollection` | `defaultTypes`  | Use a custom types collection                    |
| `autoExtract` | `boolean`         | `false`         | Globally register `MnemonicaSerializerInterceptor` |
| `telemetry`   | `boolean`         | `false`         | Wire console telemetry hooks                     |

### `MnemonicaModule.forFeature(name, config?)`

Creates an isolated `TypesCollection` per module. Pass mnemonica `constructorOptions` as the second argument:

```typescript
@Module({
  imports: [MnemonicaModule.forFeature('payments', { strictChain: false })],
})
export class PaymentsModule {}
```

| Parameter | Type                | Description                              |
|-----------|---------------------|------------------------------------------|
| `name`    | `string`            | Feature identifier for injection token   |
| `config`  | `constructorOptions`| Optional: `strictChain`, `blockErrors`, etc. |

### `MnemonicaSerializerInterceptor`

Auto-calls `.extract()` on mnemonica instances returned from controllers before JSON serialization. Return typed instances directly:

```typescript
@Controller('payments')
export class PaymentsController {
  @Get()
  findAll () {
    return new PaymentEntity({ amount: 100 }); // serialized via .extract()
  }
}
```

### `MnemonicaValidationPipe`

Validates a plain DTO via `class-validator`, then constructs a mnemonica instance:

```typescript
@Post()
async create (
  @Body(MnemonicaValidationPipe.forType(PaymentEntity, CreatePaymentDto))
  payment: InstanceType<typeof PaymentEntity>,
) {
  return payment;
}
```

### `@MnemonicaBody()`

Convenience decorator combining `@Body()` with `MnemonicaValidationPipe`:

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

Runtime type guard using `getProps()` — works across realms, no `instanceof` hacks:

```typescript
import { isMnemonicaInstance } from '@mnemonica/nestjs';

if (isMnemonicaInstance(value)) {
  console.log(value.extract());
}
```

### `InjectMnemonicaCollection(name?)`

Inject a `TypesCollection` by feature name. Omit or use `'default'` for the root collection:

```typescript
@Injectable()
export class PaymentsService {
  constructor (
    @InjectMnemonicaCollection() private collection: TypesCollection,
  ) {}
}
```

## Type Safety with `lookupTyped()`

Use `lookupTyped()` from `mnemonica` for fully type-safe type retrieval when your `TypeRegistry` is augmented (e.g., via tactica):

```typescript
import { lookupTyped } from 'mnemonica';

const PaymentEntity = lookupTyped('PaymentEntity');
const payment = new PaymentEntity({ amount: 100 });
```

## License

MIT

# @letspay-dev/payments

Universal TypeScript SDK for interacting with the LetsPay Hedera proxy.

## Branches

- **main** — released npm tags and stable docs.
- **staging** — integration branch for SDK utilities and API previews before a release.

Feature work is developed on short-lived branches from `staging`, then merged back for release prep.

## Utilities

### Retry

Use `retryWithBackoff` when wrapping RPC or HTTP calls that may fail transiently:

```ts
import { retryWithBackoff } from '@letspay-dev/payments';

const credit = await retryWithBackoff(
  () => sdk.creditOf('0x…'),
  { maxRetries: 4, initialDelayMs: 250, maxDelayMs: 5000 },
);
```

## Install

```bash
pnpm add @letspay-dev/payments viem
```

## Quickstart (Browser)

```ts
import { LetsPayPayments } from '@letspay-dev/payments';

const sdk = await LetsPayPayments.fromBrowser({
  proxyAddress: '0x...',
  kyc: {
    url: 'https://kyc.example/verify',
    method: 'GET',
    mapResponse: (res, address) => Boolean(res?.ok),
    cacheTtlMs: 60_000,
  },
});

await sdk.signup();
```

## Quickstart (Node)

```ts
import { LetsPayPayments } from '@letspay-dev/payments';

const sdk = LetsPayPayments.fromNode({
  proxyAddress: '0x...',
  rpcUrl: 'https://hedera-json-rpc.testnet',
  privateKey: process.env.PRIVATE_KEY!,
  kyc: {
    url: 'https://kyc.example/verify',
    method: 'POST',
    headers: { 'x-api-key': process.env.KYC_KEY! },
    mapResponse: (res, address) => Boolean(res?.ok),
  },
});

await sdk.fundContract({ value: 100000000n });
```

## API

See `src/client.ts` for full list of methods.



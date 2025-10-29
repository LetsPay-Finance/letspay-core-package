# @letspay-dev/payments

Universal TypeScript SDK for interacting with the LetsPay Hedera proxy.

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



import type { PublicClient, TransactionReceipt } from 'viem';
import type { Hex } from 'viem';
import type { TransactionReceiptWaitOptions } from './types';

/**
 * Waits until the given transaction hash is included with the requested confirmations.
 */
export async function waitForProxyReceipt(
  publicClient: PublicClient,
  hash: Hex,
  opts?: TransactionReceiptWaitOptions,
): Promise<TransactionReceipt> {
  return publicClient.waitForTransactionReceipt({
    hash,
    confirmations: opts?.confirmations ?? 1,
    pollingInterval: opts?.pollingInterval ?? 4_000,
    timeout: opts?.timeoutMs ?? 120_000,
  });
}

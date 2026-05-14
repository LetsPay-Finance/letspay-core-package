import { describe, expect, it, vi } from 'vitest';
import { waitForProxyReceipt } from './tx-receipt';

describe('waitForProxyReceipt', () => {
  it('delegates to publicClient.waitForTransactionReceipt with defaults', async () => {
    const receipt = { status: 'success' } as any;
    const waitForTransactionReceipt = vi.fn().mockResolvedValue(receipt);
    const publicClient = { waitForTransactionReceipt } as any;
    const hash = '0xabc' as `0x${string}`;

    const out = await waitForProxyReceipt(publicClient, hash);

    expect(out).toBe(receipt);
    expect(waitForTransactionReceipt).toHaveBeenCalledWith({
      hash,
      confirmations: 1,
      pollingInterval: 4_000,
      timeout: 120_000,
    });
  });

  it('forwards custom polling and timeout options', async () => {
    const waitForTransactionReceipt = vi.fn().mockResolvedValue({});
    const publicClient = { waitForTransactionReceipt } as any;
    await waitForProxyReceipt(publicClient, '0x1' as `0x${string}`, {
      confirmations: 2,
      pollingInterval: 2_000,
      timeoutMs: 60_000,
    });
    expect(waitForTransactionReceipt).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmations: 2,
        pollingInterval: 2_000,
        timeout: 60_000,
      }),
    );
  });
});

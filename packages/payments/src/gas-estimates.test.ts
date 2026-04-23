import { describe, expect, it, vi } from 'vitest';
import { estimateSignupGasUnits } from '../gas-estimates';

describe('estimateSignupGasUnits', () => {
  it('forwards proxy address and bound account to viem', async () => {
    const estimateContractGas = vi.fn().mockResolvedValue(21_000n);
    const publicClient = { estimateContractGas } as any;
    const walletClient = { account: { address: '0xabc' } } as any;

    const gas = await estimateSignupGasUnits(publicClient, walletClient, '0xProxy' as `0x${string}`);

    expect(gas).toBe(21_000n);
    expect(estimateContractGas).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0xProxy',
        functionName: 'signup',
      }),
    );
  });
});

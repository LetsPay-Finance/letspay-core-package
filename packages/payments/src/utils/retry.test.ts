import { describe, expect, it, vi } from 'vitest';
import { retryWithBackoff } from './retry';

describe('retryWithBackoff', () => {
  it('returns the resolved value on first success', async () => {
    const fn = vi.fn().mockResolvedValueOnce(42);
    await expect(retryWithBackoff(fn, { maxRetries: 2, initialDelayMs: 1 })).resolves.toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries until success', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('rpc')).mockResolvedValueOnce('ok');
    await expect(retryWithBackoff(fn, { maxRetries: 2, initialDelayMs: 1 })).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws the last error when retries are exhausted', async () => {
    const err = new Error('fatal');
    const fn = vi.fn().mockRejectedValue(err);
    await expect(retryWithBackoff(fn, { maxRetries: 1, initialDelayMs: 1 })).rejects.toThrow('fatal');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

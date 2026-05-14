import { describe, expect, it } from 'vitest';
import { formatTxExplorerUrl } from './explorer';

describe('formatTxExplorerUrl', () => {
  it('replaces the hash token', () => {
    const url = formatTxExplorerUrl(
      { label: 'testnet', txUrlTemplate: 'https://example.com/tx/{hash}' },
      '0xdeadbeef' as `0x${string}`,
    );
    expect(url).toBe('https://example.com/tx/0xdeadbeef');
  });

  it('throws when template is missing placeholder', () => {
    expect(() =>
      formatTxExplorerUrl({ label: 'bad', txUrlTemplate: 'https://example.com/tx/' }, '0x1' as `0x${string}`),
    ).toThrow(/placeholder/);
  });
});

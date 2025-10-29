const TINYBAR_DECIMALS = 8n;
const TEN = 10n;

export function formatTinybar(value: bigint): string {
  const factor = TEN ** TINYBAR_DECIMALS;
  const whole = value / factor;
  const frac = value % factor;
  const fracStr = frac.toString().padStart(Number(TINYBAR_DECIMALS), '0').replace(/0+$/, '');
  return fracStr ? `${whole}.${fracStr}` : whole.toString();
}

export function parseTinybar(input: string): bigint {
  if (!/^\d+(?:\.\d+)?$/.test(input)) {
    throw new Error('Invalid amount format');
  }
  const [wholeStr, fracStr = ''] = input.split('.');
  const fracPadded = (fracStr + '0'.repeat(Number(TINYBAR_DECIMALS))).slice(0, Number(TINYBAR_DECIMALS));
  return BigInt(wholeStr) * (TEN ** TINYBAR_DECIMALS) + BigInt(fracPadded);
}



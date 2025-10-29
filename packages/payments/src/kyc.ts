import { KycError, type HexAddress, type KycConfig } from './types';

type CacheEntry = { ok: boolean; expiresAt: number };

export class KycCache {
  private readonly ttlMs: number;
  private readonly entries = new Map<HexAddress, CacheEntry>();
  constructor(ttlMs: number) {
    this.ttlMs = ttlMs;
  }
  get(address: HexAddress): boolean | undefined {
    const hit = this.entries.get(address);
    if (!hit) return undefined;
    if (Date.now() > hit.expiresAt) {
      this.entries.delete(address);
      return undefined;
    }
    return hit.ok;
  }
  set(address: HexAddress, ok: boolean): void {
    this.entries.set(address, { ok, expiresAt: Date.now() + this.ttlMs });
  }
}

export async function fetchKycBoolean(address: HexAddress, cfg: KycConfig): Promise<boolean> {
  const method = cfg.method ?? 'GET';
  const url = cfg.url;
  const init: RequestInit = { method, headers: cfg.headers };
  if (method === 'POST') {
    init.headers = { 'content-type': 'application/json', ...(cfg.headers ?? {}) };
    init.body = JSON.stringify({ address });
  }
  const res = await fetch(method === 'GET' ? `${url}${url.includes('?') ? '&' : '?'}address=${address}` : url, init);
  const data = await res.json().catch(() => ({}));
  return cfg.mapResponse(data, address);
}

export async function ensureKyc(address: HexAddress, cfg: KycConfig, cache: KycCache, refresh?: boolean): Promise<void> {
  let ok = !refresh ? cache.get(address) : undefined;
  if (ok === undefined) {
    ok = await fetchKycBoolean(address, cfg);
    cache.set(address, ok);
  }
  if (!ok) {
    cfg.onKycFail?.(address);
    throw new KycError(address);
  }
}



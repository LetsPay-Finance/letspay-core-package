export type RetryOptions = {
  maxRetries: number;
  initialDelayMs: number;
  /** Upper bound for exponential delay between attempts */
  maxDelayMs?: number;
};

/**
 * Runs `fn` until it succeeds or `maxRetries` is exhausted, with exponential backoff.
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, opts: RetryOptions): Promise<T> {
  let delay = opts.initialDelayMs;
  const maxDelay = opts.maxDelayMs ?? 30_000;
  let lastError: unknown;
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (attempt === opts.maxRetries) break;
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * 2, maxDelay);
    }
  }
  throw lastError;
}

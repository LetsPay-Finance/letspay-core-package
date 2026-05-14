import type { Hex } from 'viem';
import type { ExplorerChainConfig } from '../types';

export function formatTxExplorerUrl(cfg: ExplorerChainConfig, hash: Hex): string {
  if (!cfg.txUrlTemplate.includes('{hash}')) {
    throw new Error('ExplorerChainConfig.txUrlTemplate must include a {hash} placeholder');
  }
  return cfg.txUrlTemplate.replace('{hash}', hash);
}

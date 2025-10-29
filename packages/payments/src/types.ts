export type HexAddress = `0x${string}`;

export interface KycConfig {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  mapResponse: (res: unknown, address: HexAddress) => boolean;
  cacheTtlMs?: number;
  onKycFail?: (address: HexAddress) => void;
}

export interface BaseConfig {
  rpcUrl?: string;
  chainId?: number;
  proxyAddress: HexAddress;
  kyc: KycConfig;
}

export interface BrowserConfig extends BaseConfig {
  provider?: unknown; // EIP-1193 provider
}

export interface NodeConfig extends BaseConfig {
  privateKey: string;
}

export class KycError extends Error {
  address: HexAddress;
  constructor(address: HexAddress, message = 'KYC check failed') {
    super(message);
    this.name = 'KycError';
    this.address = address;
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class TxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TxError';
  }
}



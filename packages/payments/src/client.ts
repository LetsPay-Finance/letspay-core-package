import type { PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { abi } from './abi/letsPayV1';
import {
  estimateAcceptGasUnits,
  estimateCancelEscrowGasUnits,
  estimateCreateEscrowGasUnits,
  estimateFundContractGasUnits,
  estimateRepayCreditGasUnits,
  estimateSignupGasUnits,
} from './gas-estimates';
import { ensureKyc, KycCache } from './kyc';
import type { BrowserConfig, HexAddress, NodeConfig } from './types';

type ReadParams = { requireKyc?: boolean };

export class LetsPayPayments {
  private publicClient: PublicClient;
  private walletClient: WalletClient;
  private proxyAddress: HexAddress;
  private kycCache: KycCache;
  private kycCfg;

  private constructor(args: {
    publicClient: PublicClient;
    walletClient: WalletClient;
    proxyAddress: HexAddress;
    kycCache: KycCache;
    kycCfg: any;
  }) {
    this.publicClient = args.publicClient;
    this.walletClient = args.walletClient;
    this.proxyAddress = args.proxyAddress;
    this.kycCache = args.kycCache;
    this.kycCfg = args.kycCfg;
  }

  static async fromBrowser(cfg: BrowserConfig) {
    const provider = (cfg.provider ?? (globalThis as any)?.ethereum) as any;
    const transport = custom(provider);
    const publicClient = createPublicClient({ transport });
    const [address] = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
    const walletClient = createWalletClient({ transport, account: address as HexAddress });
    return new LetsPayPayments({
      publicClient,
      walletClient,
      proxyAddress: cfg.proxyAddress,
      kycCache: new KycCache(cfg.kyc.cacheTtlMs ?? 60_000),
      kycCfg: cfg.kyc,
    });
  }

  static fromNode(cfg: NodeConfig) {
    const account = privateKeyToAccount((cfg.privateKey.startsWith('0x') ? cfg.privateKey : `0x${cfg.privateKey}`) as HexAddress);
    const transport = http(cfg.rpcUrl);
    const publicClient = createPublicClient({ transport });
    const walletClient = createWalletClient({ transport, account });
    return new LetsPayPayments({
      publicClient,
      walletClient,
      proxyAddress: cfg.proxyAddress,
      kycCache: new KycCache(cfg.kyc.cacheTtlMs ?? 60_000),
      kycCfg: cfg.kyc,
    });
  }

  async getAddress(): Promise<HexAddress> {
    const acct = this.walletClient.account;
    return acct?.address as HexAddress;
  }

  // Reads
  async creditOf(address: HexAddress, opts?: ReadParams) {
    if (opts?.requireKyc) await ensureKyc(address, this.kycCfg, this.kycCache);
    return this.publicClient.readContract({ address: this.proxyAddress, abi, functionName: 'credit', args: [address] });
  }
  async signedUp(address: HexAddress, opts?: ReadParams) {
    if (opts?.requireKyc) await ensureKyc(address, this.kycCfg, this.kycCache);
    return this.publicClient.readContract({ address: this.proxyAddress, abi, functionName: 'signedUp', args: [address] });
  }
  async getPendingEscrowsFor(address: HexAddress, opts?: ReadParams) {
    if (opts?.requireKyc) await ensureKyc(address, this.kycCfg, this.kycCache);
    return this.publicClient.readContract({ address: this.proxyAddress, abi, functionName: 'getPendingEscrowsFor', args: [address] });
  }
  async escrowDetails(escrowId: bigint, opts?: ReadParams) {
    const addr = await this.getAddress();
    if (opts?.requireKyc) await ensureKyc(addr, this.kycCfg, this.kycCache);
    return this.publicClient.readContract({ address: this.proxyAddress, abi, functionName: 'escrowDetails', args: [escrowId] });
  }
  async getUserHistory(address: HexAddress, opts?: ReadParams) {
    if (opts?.requireKyc) await ensureKyc(address, this.kycCfg, this.kycCache);
    return this.publicClient.readContract({ address: this.proxyAddress, abi, functionName: 'getUserHistory', args: [address] });
  }
  async balance(): Promise<bigint> {
    return this.publicClient.getBalance({ address: this.proxyAddress });
  }

  // Gas previews (no on-chain submission; uses viem `estimateContractGas`)
  async estimateSignupGas(): Promise<bigint> {
    return estimateSignupGasUnits(this.publicClient, this.walletClient, this.proxyAddress);
  }

  async estimateFundContractGas(params: { value: bigint }): Promise<bigint> {
    return estimateFundContractGasUnits(this.publicClient, this.walletClient, this.proxyAddress, params.value);
  }

  async estimateRepayCreditGas(params: { value: bigint }): Promise<bigint> {
    return estimateRepayCreditGasUnits(this.publicClient, this.walletClient, this.proxyAddress, params.value);
  }

  async estimateCreateEscrowGas(params: {
    merchant: HexAddress;
    otherParticipants: HexAddress[];
    otherShares: bigint[];
    total: bigint;
  }): Promise<bigint> {
    return estimateCreateEscrowGasUnits(this.publicClient, this.walletClient, this.proxyAddress, params);
  }

  async estimateAcceptGas(params: { escrowId: bigint }): Promise<bigint> {
    return estimateAcceptGasUnits(this.publicClient, this.walletClient, this.proxyAddress, params.escrowId);
  }

  async estimateCancelEscrowGas(params: { escrowId: bigint }): Promise<bigint> {
    return estimateCancelEscrowGasUnits(this.publicClient, this.walletClient, this.proxyAddress, params.escrowId);
  }

  // Writes (KYC enforced)
  private async guardedWrite<T>(invoke: () => Promise<T>): Promise<T> {
    const addr = await this.getAddress();
    await ensureKyc(addr, this.kycCfg, this.kycCache);
    return invoke();
  }

  async signup() {
    return this.guardedWrite(() =>
      this.walletClient.writeContract({ address: this.proxyAddress, abi, functionName: 'signup', args: [] })
    );
  }

  async fundContract(params: { value: bigint }) {
    return this.guardedWrite(() =>
      this.walletClient.writeContract({ address: this.proxyAddress, abi, functionName: 'fundContract', args: [], value: params.value })
    );
  }

  async createEscrow(params: { merchant: HexAddress; otherParticipants: HexAddress[]; otherShares: bigint[]; total: bigint }) {
    return this.guardedWrite(() =>
      this.walletClient.writeContract({
        address: this.proxyAddress,
        abi,
        functionName: 'createEscrow',
        args: [params.merchant, params.otherParticipants, params.otherShares, params.total],
      })
    );
  }

  async accept(params: { escrowId: bigint }) {
    return this.guardedWrite(() =>
      this.walletClient.writeContract({ address: this.proxyAddress, abi, functionName: 'accept', args: [params.escrowId] })
    );
  }

  async cancelEscrow(params: { escrowId: bigint }) {
    return this.guardedWrite(() =>
      this.walletClient.writeContract({ address: this.proxyAddress, abi, functionName: 'cancelEscrow', args: [params.escrowId] })
    );
  }

  async repayCredit(params: { value: bigint }) {
    return this.guardedWrite(() =>
      this.walletClient.writeContract({ address: this.proxyAddress, abi, functionName: 'repayCredit', args: [], value: params.value })
    );
  }

  // KYC util
  async isKycPassed(address?: HexAddress, opts?: { refresh?: boolean }): Promise<boolean> {
    const addr = address ?? (await this.getAddress());
    try {
      await ensureKyc(addr, this.kycCfg, this.kycCache, opts?.refresh);
      return true;
    } catch {
      return false;
    }
  }
}



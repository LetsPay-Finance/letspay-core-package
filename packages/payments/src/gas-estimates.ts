import type { PublicClient, WalletClient } from 'viem';
import { abi } from './abi/letsPayV1';
import { ConfigError, type HexAddress } from './types';

async function requireAccount(walletClient: WalletClient) {
  const account = walletClient.account;
  if (!account) throw new ConfigError('Wallet client has no account bound');
  return account;
}

/** Low-level gas estimators used by `LetsPayPayments` preview helpers. */
export async function estimateSignupGasUnits(
  publicClient: PublicClient,
  walletClient: WalletClient,
  proxyAddress: HexAddress,
): Promise<bigint> {
  const account = await requireAccount(walletClient);
  return publicClient.estimateContractGas({
    address: proxyAddress,
    abi,
    functionName: 'signup',
    args: [],
    account,
  });
}

export async function estimateFundContractGasUnits(
  publicClient: PublicClient,
  walletClient: WalletClient,
  proxyAddress: HexAddress,
  value: bigint,
): Promise<bigint> {
  const account = await requireAccount(walletClient);
  return publicClient.estimateContractGas({
    address: proxyAddress,
    abi,
    functionName: 'fundContract',
    args: [],
    account,
    value,
  });
}

export async function estimateRepayCreditGasUnits(
  publicClient: PublicClient,
  walletClient: WalletClient,
  proxyAddress: HexAddress,
  value: bigint,
): Promise<bigint> {
  const account = await requireAccount(walletClient);
  return publicClient.estimateContractGas({
    address: proxyAddress,
    abi,
    functionName: 'repayCredit',
    args: [],
    account,
    value,
  });
}

export async function estimateCreateEscrowGasUnits(
  publicClient: PublicClient,
  walletClient: WalletClient,
  proxyAddress: HexAddress,
  params: { merchant: HexAddress; otherParticipants: HexAddress[]; otherShares: bigint[]; total: bigint },
): Promise<bigint> {
  const account = await requireAccount(walletClient);
  return publicClient.estimateContractGas({
    address: proxyAddress,
    abi,
    functionName: 'createEscrow',
    args: [params.merchant, params.otherParticipants, params.otherShares, params.total],
    account,
  });
}

export async function estimateAcceptGasUnits(
  publicClient: PublicClient,
  walletClient: WalletClient,
  proxyAddress: HexAddress,
  escrowId: bigint,
): Promise<bigint> {
  const account = await requireAccount(walletClient);
  return publicClient.estimateContractGas({
    address: proxyAddress,
    abi,
    functionName: 'accept',
    args: [escrowId],
    account,
  });
}

export async function estimateCancelEscrowGasUnits(
  publicClient: PublicClient,
  walletClient: WalletClient,
  proxyAddress: HexAddress,
  escrowId: bigint,
): Promise<bigint> {
  const account = await requireAccount(walletClient);
  return publicClient.estimateContractGas({
    address: proxyAddress,
    abi,
    functionName: 'cancelEscrow',
    args: [escrowId],
    account,
  });
}

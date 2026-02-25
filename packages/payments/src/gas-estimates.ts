import type { PublicClient, WalletClient } from 'viem';
import { abi } from './abi/letsPayV1';
import type { HexAddress } from './types';

async function requireAccount(walletClient: WalletClient) {
  const account = walletClient.account;
  if (!account) throw new Error('Wallet client has no account bound');
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

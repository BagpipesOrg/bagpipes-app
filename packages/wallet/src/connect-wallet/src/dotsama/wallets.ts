import { BaseDotSamaWallet } from './BaseDotSamaWallet';
import { PREDEFINED_WALLETS } from './predefinedWallet';
import { Wallet, WalletInfo } from '../types';

const walletList: Wallet[] = [];

// Add more wallet, please sure you call this method before any getWallets or getWalletBySource
export function addWallet (data: WalletInfo) {
  const wallet = (new BaseDotSamaWallet(data)) as Wallet;

  walletList.push(wallet);
}

// Implement predefined wallets
PREDEFINED_WALLETS.forEach((walletInfo) => {
  console.log('walletInfo:', walletInfo);
  addWallet(walletInfo);
});

// Get all wallet
export function getWallets (): Wallet[] {
  console.log('getWallets walletList:', walletList);
  return walletList;
}

export function getWalletBySource (source: string | unknown): Wallet | undefined {
  const getTheWallet = getWallets().find((wallet) => {
    console.log('getWalletBySource wallet:', wallet);
    return wallet.extensionName === source;
  });

  return getTheWallet;
}

export function isWalletInstalled (source: string | unknown): boolean {
  console.log('isWalletInstalled source:', source);
  const wallet = getWalletBySource(source);
  console.log('isWalletInstalled wallet:', wallet);

  return wallet?.installed as boolean;
}
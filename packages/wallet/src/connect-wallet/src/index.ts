// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EvmWalletInfo } from './types';

// @ts-ignore
import MetaMaskLogo from './logo/MetaMaskLogo.svg';
// @ts-ignore
import SubWalletLogo from './logo/SubWalletLogo.svg';
// @ts-ignore
import NovaWalletLogo from './logo/NovaWalletLogo.svg';
// @ts-ignore
import TalismanWalletLogo from './logo/TalismanLogo.svg';
// @ts-ignore
import WalletConnectLogo from './logo/WalletConnectLogo.svg';


export const PREDEFINED_EVM_WALLETS: EvmWalletInfo[] = [
  {
    extensionName: 'SubWallet',
    title: 'SubWallet (EVM)',
    installUrl: 'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    logo: {
      src: SubWalletLogo as string,
      alt: 'SubWallet (EVM)'
    },
    isSetGlobalString: 'isSubWallet',
    initEvent: 'subwallet#initialized'
  },
  {
    extensionName: 'talisman',
    title: 'Talisman',
    installUrl: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    logo: {
      src: TalismanWalletLogo as string,
      alt: 'Talisman'
    },
    isSetGlobalString: 'isTalisman',
    initEvent: 'talisman#initialized'
  },
    {
    extensionName: 'WalletConnect',
    title: 'Wallet Connect',
    logo: {
      src: WalletConnectLogo as string,
      alt: 'Wallet Connect'
    },
    isSetGlobalString: 'isWalletConnect',
    initEvent: 'walletconnect#initialized'
  },
  {
    extensionName: 'ethereum',
    title: 'MetaMask',
    installUrl: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    logo: {
      src: MetaMaskLogo as string,
      alt: 'MetaMask Extension'
    },
    isSetGlobalString: 'isMetaMask',
    initEvent: 'metamask#initialized'
  },
  {
    extensionName: 'ethereum',
    title: 'Nova Wallet (EVM)',
    installUrl: 'https://novawallet.io',
    logo: {
      src: NovaWalletLogo as string,
      alt: 'NovaWallet (EVM)'
    },
    isSetGlobalString: 'isNovaWallet',
    initEvent: 'ethereum#initialized'
  }
];


// Export utility functions



// Export predefined wallets and classes from dotsama
export * from './dotsama/BaseDotSamaWallet';
export * from './dotsama/wallets';
export * from './dotsama/predefinedWallet'; 

// Export predefined wallets and classes from evm
export * from './evm/BaseEvmWallet';
export * from './evm/evmWallets';
export * from './evm/predefinedWallet';

// Export types and package information
export * from './types';

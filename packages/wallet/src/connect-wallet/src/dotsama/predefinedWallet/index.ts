import { WalletInfo } from '../../types';

// @ts-ignore
import FearlessWalletLogo from './FearlessWalletLogo.svg';
// @ts-ignore
import PolkadotJsLogo from './PolkadotLogo.svg';
// @ts-ignore
import SubWalletLogo from './SubWalletLogo.svg';
// @ts-ignore
import TalismanLogo from './TalismanLogo.svg';
// @ts-ignore
import NovaWalletLogo from './NovaWalletLogo.svg';
// @ts-ignore
import WalletConnectLogo from './WalletConnectLogo.svg';

export const PREDEFINED_WALLETS: WalletInfo[] = [
  // {
  //   extensionName: 'beetl',
  //   title: 'beetl',
  //   installUrl: '~/blinks/polkadot-extension/packages/extension/build',
  //   logo: {
  //     src: WalletConnectLogo as string,
  //     alt: 'Beetle Exoskeleton (extension)'
  //   }
  // },
  {
    extensionName: 'polkadot-js',
    title: 'Polkadot{.js}',
    installUrl: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    logo: {
      src: PolkadotJsLogo as string,
      alt: 'Polkadot{.js} Extension'
    }
  },
  {
    extensionName: 'talisman',
    title: 'Talisman',
    installUrl: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    logo: {
      src: TalismanLogo as string,
      alt: 'Talisman'
    }
  },
  // {
  //   extensionName: 'nova',
  //   title: 'Nova Wallet',
  //   installUrl: 'https://novawallet.io',
  //   logo: {
  //     src: NovaWalletLogo as string,
  //     alt: 'Nova Wallet'
  //   }
  // },
  {
    extensionName: 'subwallet-js',
    title: 'SubWallet',
    installUrl: 'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    logo: {
      src: SubWalletLogo as string,
      alt: 'SubWallet'
    }
  },
  {
    extensionName: 'fearless-wallet',
    title: 'Fearless Wallet',
    installUrl: 'https://chrome.google.com/webstore/detail/fearless-wallet/nhlnehondigmgckngjomcpcefcdplmgc',
    logo: {
      src: FearlessWalletLogo as string,
      alt: 'Fearless Wallet Extension'
    }
  },
  {
    extensionName: 'nova-wallet',
    title: 'Nova Wallet',
    installUrl: 'https://novawallet.io',
    logo: {
      src: NovaWalletLogo as string,
      alt: 'Nova Wallet'
    }
  },
  {
    extensionName: 'wallet-connect',
    title: 'Wallet Connect',
    logo: {
      src: WalletConnectLogo as string,
      alt: 'Wallet Connect'
    }
  }
];
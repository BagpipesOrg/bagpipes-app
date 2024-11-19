// src/connect-wallet/src/dotsama/NovaWallet.ts

import { BaseDotSamaWallet } from './BaseDotSamaWallet';
import { WalletInfo } from '../types';
import { InjectedExtension } from '@polkadot/extension-inject/types';

const DAPP_NAME = 'Bagpipes';

export class NovaWallet extends BaseDotSamaWallet {
  constructor(walletInfo: WalletInfo) {
    super(walletInfo);
  }

  get installed() {
    const injectedWindow = window as any;
    return injectedWindow.walletExtension?.isNovaWallet === true;
  }

  get rawExtension() {
    const injectedWindow = window as any;
    return injectedWindow?.walletExtension;
  }

  enable = async () => {
    if (!this.installed) {
      return;
    }

    try {
      const injectedExtension = this.rawExtension;

      if (!injectedExtension || !injectedExtension.enable) {
        return;
      }

      const rawExtension = await injectedExtension.enable(DAPP_NAME);

      if (!rawExtension) {
        return;
      }

      const extension: InjectedExtension = {
        ...rawExtension,
        name: this.extensionName,
        version: injectedExtension.version || 'unknown',
      };

      this._extension = extension;
      this._signer = extension?.signer;
      this._metadata = extension?.metadata;
      this._provider = extension?.provider;
    } catch (err) {
      console.error('Error enabling Nova Wallet:', err);
    }
  };
}

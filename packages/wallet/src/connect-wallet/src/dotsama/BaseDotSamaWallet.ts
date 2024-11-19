// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0
//@ts-nocheck

// This file is get idea from https://github.com/TalismanSociety/talisman-connect/blob/master/libs/wallets/src/lib/base-dotsama-wallet/index.ts

import { SubscriptionFn, Wallet, WalletAccount, WalletInfo, WalletLogoProps } from '../types';
import { logger } from '../logger';

  
import { InjectedAccount, InjectedExtension, InjectedMetadata, InjectedProvider, InjectedWindow } from '@polkadot/extension-inject/types';


import { Signer } from '@polkadot/types/types';

const DAPP_NAME = 'Bagpipes';

export class BaseDotSamaWallet implements Wallet {
  extensionName: string;  
  title: string;
  installUrl?: string;
  logo: WalletLogoProps;

  _extension: InjectedExtension | undefined;
  _signer: Signer | undefined;
  _metadata: InjectedMetadata | undefined;
  _provider: InjectedProvider | undefined;

  constructor ({ extensionName, installUrl, logo, title }: WalletInfo) {
    this.extensionName = extensionName;
    this.title = title;
    this.installUrl = installUrl;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.logo = logo;

    return this;  
  
  }

  //   this.initializeWallet();
  // }

  //   initializeWallet = () => {
  //   // Retry mechanism to check if the extension is available
  //   const checkInjectedExtension = () => {
  //     const injectedWindow = window as Window & InjectedWindow;
  //     const injectedExtension = injectedWindow?.injectedWeb3?.[this.extensionName];
  //     console.log(`injectedExtension for ${this.extensionName}:`, injectedExtension);

  //     if (injectedExtension) {
  //       this._extension = injectedExtension;
  //       this._signer = injectedExtension.signer;
  //       console.log(`${this.extensionName} extension detected and initialized.`);
  //     } else {
  //       console.warn(`${this.extensionName} extension not found, retrying...`);
  //       setTimeout(checkInjectedExtension, 500); // Retry every 500ms
  //     }
  //   };

  //   checkInjectedExtension();
  // }

  
  // API docs: https://polkadot.js.org/docs/extension/
  get extension () {
    return this._extension;
  }

  // API docs: https://polkadot.js.org/docs/extension/
  get signer () {
    return this._signer;
  }

  get metadata () {
    return this._metadata;
  }

  get provider () {
    return this._provider;
  }

  get installed() {
    const injectedWindow = window as any;
  
    if (this.extensionName === 'nova-wallet') {
      return injectedWindow.walletExtension?.isNovaWallet === true;
    } else {
      return !!injectedWindow?.injectedWeb3?.[this.extensionName];
    }
  }

  private waitForExtension = (retries = 10, interval = 500): Promise<boolean> => {
    return new Promise((resolve) => {
      const checkExtension = () => {
        if (this.installed) {
          resolve(true);
        } else if (retries > 0) {
          setTimeout(() => {
            retries--;
            checkExtension();
          }, interval);
        } else {
          resolve(false);
        }
      };
      checkExtension();
    });
  };


  get rawExtension() {
    const injectedWindow = window as any;

    if (this.extensionName === 'nova-wallet') {
      return injectedWindow?.walletExtension;
    } else {
      return injectedWindow?.injectedWeb3?.[this.extensionName];
    }
  }
  enable = async () => {
    logger.log(`Attempting to enable ${this.extensionName}`);

    const isExtensionAvailable = await this.waitForExtension();
  
    if (!isExtensionAvailable) {
      logger.log(`${this.extensionName} is not available after waiting`);
      return;
    }
  
    try {
      const injectedExtension = this.rawExtension;
  
      if (!injectedExtension || !injectedExtension.enable) {
        logger.log(`${this.extensionName} does not have an enable method`);
        return;
      }
  
      const rawExtension = await injectedExtension.enable(DAPP_NAME);
  
      if (!rawExtension) {
        logger.log(`Failed to enable ${this.extensionName}`);
        return;
      }
  
      const extension: InjectedExtension = {
        ...rawExtension,
        name: this.extensionName,
        version: injectedExtension.version || 'unknown',
      };
  
      this._extension = extension;
      this._signer = extension.signer;
      this._metadata = extension.metadata;
      this._provider = extension.provider;

      logger.log(`${this.extensionName} enabled successfully`);

    } catch (err) {
      logger.log(`Error enabling ${this.extensionName}: ${err}`);
    }
  };
  
  

  private generateWalletAccount = (account: InjectedAccount): WalletAccount => {
    return {
      ...account,
      source: this._extension?.name as string,
      // Added extra fields here for convenience
      wallet: this,
      signer: this._extension?.signer
    } as WalletAccount;
  };

  subscribeAccounts = async (callback: SubscriptionFn) => {
    if (!this._extension) {
      await this?.enable();
    }

    if (!this._extension) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      callback(undefined);

      return null;
    }

    return this._extension.accounts.subscribe(
      (accounts: InjectedAccount[]) => {
        const accountsWithWallet = accounts.map(this.generateWalletAccount);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        callback(accountsWithWallet);
      }
    );
  };

  getAccounts = async () => {
    logger.log(`Attempting to get accounts from ${this.extensionName}`);

    if (!this._extension) {
      logger.log(`Extension ${this.extensionName} is not enabled`);

      await this?.enable();
    }

    if (!this._extension) {
      logger.log(`Extension ${this.extensionName} is still not available after enable`);

      return null;
    }

    try {
      const accounts = await this._extension.accounts.get();
      logger.log(`Accounts retrieved from ${this.extensionName}: ${JSON.stringify(accounts)}`);
  
      return accounts.map(this.generateWalletAccount);
    } catch (err) {
      logger.log(`Error getting accounts from ${this.extensionName}: ${err}`);
      return null;
    }
  }
}
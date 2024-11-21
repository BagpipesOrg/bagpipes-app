// @ts-nocheck

// Copyright 2019-2022 @subwallet authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';

import { getWallets } from '../connect-wallet/src/dotsama/wallets';
import { getEvmWallets } from '../connect-wallet/src/evm/evmWallets';
import { EvmWallet, Wallet } from '../connect-wallet/src/types';
import '../styles/SelectWallet.scss';
import ThemeContext from '../contexts/ThemeContext';

interface Props {
  onSelectWallet: (walletKey: string, walletType?: 'substrate' | 'evm') => void,

}

function SelectWallet ({ onSelectWallet }: Props): React.ReactElement<Props> {
  const dotsamaWallets = getWallets();
  const evmWallets = getEvmWallets();
  const { theme } = React.useContext(ThemeContext);
  console.log('ThemeContext:', ThemeContext);

  // const onClickDotsamaWallet = useCallback(
  //   (wallet: Wallet ) => {
  //     return () => {
  //       if (wallet.installed) {
  //         onSelectWallet(wallet.extensionName);
  //       }
  //     };
  //   },
  //   [onSelectWallet]
  // );

  const onClickDotsamaWallet = useCallback(
    (wallet: Wallet) => {
      return () => {
        onSelectWallet(wallet.extensionName);
      };
    },
    [onSelectWallet]
  );

  const onClickEvmWallet = useCallback(
    (wallet: Wallet ) => {
      return () => {
        if (wallet.installed) {
          onSelectWallet(wallet.extensionName, 'evm');
        }
      };
    },
    [onSelectWallet]
  );

  const walletItem: (wallet: Wallet, onSelect: (wallet: Wallet | EvmWallet) => () => void) => React.ReactElement = (wallet, onSelect) => (
    <div
      className={'wallet-item'}
      key={wallet.extensionName}
      onClick={onSelect(wallet)}
    >
      <div>
        <img
          alt={wallet.logo?.alt}
          className={'wallet-logo'}
          src={wallet.logo?.src}
        />
      </div>
      <div className={'wallet-title'}>
        {wallet.title}
      </div>
      <div className={'wallet-install'}>
        {wallet.title === 'Nova Wallet' || wallet.installed ? (
          ''
        ) : (
          <a href={wallet.installUrl} rel='noreferrer' target='_blank'>
            Reload or Install
          </a>
        )}
      </div>

    </div>
  );

  return <div className={'select-wallet-wrapper'}>
    <div className={'select-wallet-content'}>
      <div className='dotsama-wallet-list'>
        <div className='wallet-cat-title'>
          Polkadot Wallets
        </div>
        {dotsamaWallets.map((wallet) => (walletItem(wallet, onClickDotsamaWallet)))}
      </div>
      <div className='evm-wallet-list'>
        <div className='wallet-cat-title'>
          EVM Wallets
        </div>
        {evmWallets.map((wallet) => (walletItem(wallet, onClickEvmWallet)))}
      </div>
    </div>
  </div>;
}

export default SelectWallet;

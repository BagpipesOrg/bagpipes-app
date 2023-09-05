import { getWallets } from '@subwallet/wallet-connect/dotsama/wallets';
import { getEvmWallets } from '@subwallet/wallet-connect/evm/evmWallets';
import { EvmWallet, Wallet } from '@subwallet/wallet-connect/types';
import React, { useCallback, useContext } from 'react';
import { WalletAccount } from '@subwallet/wallet-connect/src/types';
import { Button } from 'antd';

export const OpenSelectWallet = React.createContext<OpenSelectWalletInterface>({
    isOpen: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    open: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: () => {}
  });
  
  export const WalletContext = React.createContext<WalletContextInterface>({
    accounts: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setWallet: (wallet, walletType) => {},
    walletType: 'substrate'
  });
  
  
  interface Props {
    visible?: boolean
  }


export interface WalletContextInterface {
    wallet?: Wallet,
    evmWallet?: EvmWallet,
    accounts: WalletAccount[],
    setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate'|'evm') => void
    walletType: 'substrate'|'evm';
  }

export function WalletHeader ({ visible }: Props): React.ReactElement<Props> {
  const selectWallet = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const wallet = walletContext.wallet || walletContext.evmWallet;


  return (<header className={'wallet-header-wrapper'}>
  <div className={'boxed-container'}>
    <div className={'wallet-header-content'}>
      <div>
        <img
          alt={wallet?.logo?.alt}
          className={'wallet-logo'}
          src={wallet?.logo?.src}
        />
      </div>
      <div className={'wallet-title'}>
        {wallet?.title}
      </div>
      <div className='spacer' />
      <Button
        className='sub-wallet-btn sub-wallet-btn-small-size'
        onClick={selectWallet.open}
        type={'primary'}
      >Select Wallet</Button>
    </div>
  </div>
</header>);
}


export default WalletHeader;

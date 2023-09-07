// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


import { OpenSelectWallet, WalletContext } from '../contexts';

import'./styles/WalletHeader.scss';

interface Props {
  visible?: boolean;
  theme: string;

}



function WalletHeader ({ visible, theme }: Props): React.ReactElement<Props> {
  const navigate = useNavigate();  // Add this line to get the navigate function
  const walletContext = useContext(WalletContext);
  const selectWallet = useContext(OpenSelectWallet);

  const wallet = walletContext.wallet || walletContext.evmWallet;
  const logoSrc = theme === 'dark' ? '/logo-white.svg' : '/logo.svg';

  if (!visible) {
    return (<></>);
  }

    // Function to navigate to /builder
    const goToBuilder = () => {
      navigate('/builder');
    };
       // Function to navigate to /builder
       const goToBagpipes = () => {
        navigate('/bagpipes') ;
      };
  

  return (<header className={'wallet-header-wrapper'}>
    <div className={'boxed-container'}>
      <div className={'wallet-header-content'}>
        <div>
          <img 
            src={logoSrc} 
            className='bagpipe-logo' 
          />
        </div>
      <div className='spacer' />
        <Button
          className='xcm-send-btn xcm-send-btn-small-size'
          onClick={goToBuilder}  
          type={'primary'}
        >Builder</Button>
        <div className='spacer' />
        {/* <Button
          className='xcm-send-btn xcm-send-btn-small-size'
          onClick={goToBagpipes}  
          type={'primary'}
        >Bagpipes</Button>
        <div className='spacer' />
         */}
  

        <div className='spacer' />
        <Button
          className='xcm-send-btn-wallet xcm-send-btn-small-size'
          onClick={selectWallet.open}
          type={'primary'}
        >Select Wallet</Button>
      </div>
      
    </div>
  </header>);
}

export default WalletHeader;

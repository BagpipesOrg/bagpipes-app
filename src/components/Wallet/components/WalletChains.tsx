// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-floating-promises */
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { InjectedMetadataKnown, MetadataDef } from '@polkadot/extension-inject/types';

import { WalletContext } from '../contexts';

import { list_chains, ChainInfo } from '../../Chains/chain_info';

import './styles/WalletMetadata.scss' ;


const ChainInfoComponent = ({ ChainInfo }) => {
  return (
<div class="metadata-item">

    <div class="metadata-item-info">
    <span class="metadata-item__title">Name:</span>
    <span class="metadata-item__content">{ChainInfo.name}</span>
    </div>
    
    <div class="metadata-item-info">
      <span class="metadata-item__title">ParaID:</span>
      <span class="metadata-item__content">{ChainInfo.paraid}</span>
    </div>
    
    <p>Ws: {ChainInfo.ws_endpoint}</p>


</div>

);
}

const ChainList = ({ chainList }) => {
  const tokenInfoList = Object.values(chainList);

  return (
    <div>
      <h1>Chain List</h1>
      <ul>
        {tokenInfoList.map((ChainInfo, index) => (
          <li key={index}>
            <ChainInfoComponent ChainInfo={ChainInfo} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const WalletChains: React.FC = () => {
  const chain_list: Record<number, ChainInfo> =   list_chains();;

  const ChainInfoList = Object.values(chain_list);

  return (
    <div>
          {ChainInfoList.map((ChainInfo, index) => (
          
            <ChainInfoComponent ChainInfo={ChainInfo} />
          
        ))}

    </div>
  );
};



export default WalletChains;
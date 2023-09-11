import { ChainInfo, AssetInfo } from './../../../Chains/chain_info';
import React, { useContext } from 'react';
import { list_chains } from './../../../Chains/chain_info';
import { list_assethub_assets } from './../../../Chains/draft_tx';

function get_assethub_asset_list() {
    const assethub_assets = list_assethub_assets();

}

function listmychains() {
    const chain_list =  list_chains();
    const ChainInfoList = Object.values(chain_list);
        return (
            <div>
    {ChainInfoList.map((ChainInfo, index) => (
        <option key={ChainInfo.name} value={ChainInfo.paraid}>
                    {ChainInfo.name}
          </option>))}

</div>);

}


export default listmychains;
import { getApiInstance } from "../api/connect";
import { ApiPromise } from "@polkadot/api";
import { listMoobeamAssets, listInterlayAssets, listBifrostAssets } from "./listAssetsForChain";
import {  formatToFourDecimals, toUnit } from "../utils/utils";
import { getRawAddress } from "../utils/getRawAddress";
import { ChainKey } from "../ChainsInfo/metadata";
import { chainConfigs } from './chainConfigs';
import { BaseBalance, AssetResponseBalance, AssetHubAssetBalance, AssetBalanceInfo, AssetResponseObject } from "./types";



function isAssetResponseObject(obj: any): obj is AssetResponseObject {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "nonce" in obj &&
    "consumers" in obj &&
    "providers" in obj &&
    "sufficients" in obj &&
    "data" in obj
  );
}

export async function getAssetDecimals(chain: string, assetid: number, signal?: AbortSignal) {
    console.log(`getAssetDecimals assetid`, assetid);
    const api = await getApiInstance(chain as ChainKey, signal);
    const resp = (await api.query.assetRegistry.assets(assetid)).toHuman();
    return resp;
  }

  function processBalances(
    baseBalance: BaseBalance,
    assetDecimals: number
  ): BaseBalance {
    const free = toUnit(baseBalance.free, assetDecimals);
    const reserved = toUnit(baseBalance.reserved, assetDecimals);
    const total = (parseFloat(free) + parseFloat(reserved)).toString();
    return { free, reserved, total };
  }
  

async function getAssetBalanceGeneric(
    chain: ChainKey,
    accountId: string,
    assetId: any,
    signal?: AbortSignal
  ): Promise<AssetBalanceInfo> {
    const chainConfig = chainConfigs[chain];
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chain}`);
    }
    const api = await chainConfig.getApiInstance(signal);
    console.log('getAssetBalanceGeneric getting balanceData...')

    const balanceData = await chainConfig.getBalance(api, accountId, assetId);
    console.log('getAssetBalanceGeneric got balanceData...', balanceData)
    console.log('getAssetBalanceGeneric getting asset decimals...', assetId)

    const assetDecimals = await chainConfig.getAssetDecimals(api, assetId);


    const baseBalance = chainConfig.parseBalance(balanceData);
    console.log(`getAssetBalanceGeneric baseBalance`, balanceData.toHuman(), balanceData?.free, balanceData, baseBalance);
    const processedBalances = processBalances(baseBalance, assetDecimals);
  
    return {
      ...processedBalances,
      chain,
      accountId,
      assetId: assetId || 0,
      assetDecimals,
      status: "",
    };
  }


  export async function getAssetBalanceForChain(
    chain: ChainKey,
    accountId: string,
    assetId?: number,
    signal?: AbortSignal
  ): Promise<AssetBalanceInfo> {
    console.log(`getAssetBalanceForChain chain:`, chain, accountId, assetId, signal);
    return getAssetBalanceGeneric(chain, accountId, assetId, signal);
  }


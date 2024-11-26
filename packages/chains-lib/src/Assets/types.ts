import { ChainKey } from "../ChainsInfo/metadata";
import { ApiPromise } from "@polkadot/api";

export interface BaseBalance {
    free: string;
    reserved: string;
    total?: string;
    frozen?: string;
  }
  
 export interface AssetResponseBalance extends BaseBalance {
    miscFrozen: string;
    feeFrozen: string;
  }

 export interface AssetBalanceInfo extends BaseBalance {
    chain: ChainKey;
    accountId: string;
    assetId: number;
    assetDecimals?: number;
    status: string;
    reason?: string;
    extra?: string;
  }
  
  
 export interface AssetResponseObject {
    nonce: string;
    consumers: string;
    providers: string;
    sufficients: string;
    data: {
      free: string;
      reserved: string;
      miscFrozen: string;
      feeFrozen: string;
      total: string;
    };
  }

  /// convert assethub's asset balance response
  export interface AssetHubAssetBalance {
    balance: string;
    status: string;
    reason: string;
    extra: string;
    decimals?: number;
  }
   

 export interface OrmlTokensAccountData {
    free: string;
    reserved: string;
    frozen: string;
  }



  export interface ChainConfig {
    getApiInstance: (signal?: AbortSignal) => Promise<ApiPromise>;
    getBalance: (api: ApiPromise, accountId: string, assetId: any) => Promise<any>;
    getAssetDecimals: (api: ApiPromise, assetId: any) => Promise<number>;
    parseBalance: (balanceData: any) => BaseBalance;
  }
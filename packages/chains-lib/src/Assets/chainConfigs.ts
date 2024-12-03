import { ApiPromise } from "@polkadot/api";
import { getApiInstance } from "../api/connect";
import { ChainKey } from "../ChainsInfo/metadata";
import { baseChainConfig, getTokenDecimalsByChainName } from "./assetutils";
import { listMoobeamAssets, listInterlayAssets, listBifrostAssets } from "../Assets/listAssetsForChain";
import { BaseBalance } from "./types"; 

export interface ChainConfig {
    getApiInstance: (signal?: AbortSignal) => Promise<ApiPromise>;
    getBalance: (api: ApiPromise, accountId: string, assetId: any) => Promise<any>;
    getAssetDecimals: (api: ApiPromise, assetId: any) => Promise<number>;
    parseBalance: (balanceData: any, assetId?: any) => BaseBalance;
}

export async function getDecimalsForAsset(
  chain: ChainKey,
  assetId: any,
  signal?: AbortSignal
): Promise<number> {
  const chainConfig = chainConfigs[chain];
  if (!chainConfig) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  const api = await chainConfig.getApiInstance(signal);
  const decimals = await chainConfig.getAssetDecimals(api, assetId);
  return decimals;
}

export const chainConfigs: { [key in ChainKey]?: ChainConfig } = {

  assetHub: {
    getApiInstance: (signal) => getApiInstance(ChainKey.AssetHub, signal),
    getBalance: async (api, accountId, assetId) => {
      if (assetId === 1000) {
        console.log('chainConfigs assetHub assetId === 1000')
        return api.query.system.account(accountId);
      } else {
        return api.query.assets.account(assetId, accountId);
      }
    },
    getAssetDecimals: async (api, assetId) => {
      if (assetId === 1000) {
        return getTokenDecimalsByChainName("assetHub");
      }
      const metadata = await api.query.assets.metadata(assetId);
      if (metadata && !metadata.isEmpty) {
        console.log('chainConfgs assetHub metadata', metadata)
        return (metadata as any).decimals.toNumber();
      }
      throw new Error("Decimals not found in metadata");
    },
    parseBalance: (balanceData, assetId) => {
      console.log('chainConfigs assetHub parseBalance', balanceData, assetId)
      if (balanceData.isEmpty) {
        console.log('assetHub balanceData is empty')
        return { free: '0', reserved: '0', frozen: '0' };
      }
      const bal = balanceData.toHuman();
      console.log('bal in assetHub', bal, assetId)
      if (assetId === 1000) {
        console.log('assetId === 1000')
        return {
          free: bal.data.free,
          reserved: bal.data.reserved,
          frozen: bal.data.frozen,
        }
      } else {
        return {
          free: bal.balance,
          reserved: '0',
          frozen: '0',
        };
     }
    },
  },



  assetHub_kusama: {
    getApiInstance: (signal) => getApiInstance(ChainKey.AssetHubKusama, signal),
    
    getBalance: async (api, accountId, assetId) => {
      const assetLocation = {
        parents: 2,
        interior: { X1: { GlobalConsensus: "Polkadot" } },
      };
      return api.query.foreignAssets.account(assetLocation, accountId);
    },

    getAssetDecimals: async () => {
      return 10; 
    },

    parseBalance: (balanceData) => {
      if (!balanceData || balanceData.isEmpty) {
        return { free: '0', reserved: '0', frozen: '0' };
      }
      const bal = balanceData.toHuman();
      const balanceStr = bal.balance.replace(/,/g, "");
      console.log('assetHub_kusama bal', bal)
      return {
        free: balanceStr,
        reserved: '0',
        frozen: '0',
      };
    },
  },

  bifrost: {
    ...baseChainConfig,
    getApiInstance: (signal) => getApiInstance(ChainKey.Bifrost, signal),
    getBalance: async (api, accountId, assetId) => {
      if (assetId === 0 || assetId === "0" || assetId === undefined) {
        return api.query.system.account(accountId);
      } else {
        const asset = { foreignAsset: assetId };
        return api.query.tokens.accounts(accountId, asset);
      }
    },
    getAssetDecimals: async (api, assetId) => {
      if (assetId === 0 || assetId === "0" || assetId === undefined) {
        return getTokenDecimalsByChainName("bifrost");
      } else {
        const assetList = listBifrostAssets();
        const assetInfo = assetList ? assetList.find((asset) => asset.assetId === assetId.toString()) : undefined;
        return assetInfo ? parseInt(assetInfo.asset.decimals, 10) : 12;
      }
    },
  },

 hydration: {
  ...baseChainConfig,
  getApiInstance: (signal) => getApiInstance(ChainKey.Hydration, signal),
  getBalance: async (api, accountId, assetId) => {
    if (assetId === 0 || assetId === "0" || assetId === undefined) {
      // Native balance
      return api.query.system.account(accountId);
    } else {
      // Token balance
      return api.query.tokens.accounts(accountId, assetId);
    }
  },
  getAssetDecimals: async (api, assetId) => {
    if (assetId === 0 || assetId === "0" || assetId === undefined) {
      // Use chain's native token decimals
      return getTokenDecimalsByChainName("hydration");
    } else {
      // Fetch decimals from asset registry
      const metadata = await api.query.assetRegistry.assets(assetId);

      if (metadata && !metadata.isEmpty) {
        const meta = (metadata as any).unwrap();
          console.log("getAssetDecimals hydration chain config", meta)
        // Adjust according to HydraDX metadata structure
        if (meta.decimals) {
        
          return meta.decimals.toHuman();
        } else if (meta.__internal__raw && meta.__internal__raw.decimals) {
          // Fallback if needed
          return meta.__internal__raw.decimals;
        }
        throw new Error("Decimals not found in metadata");
      }
      throw new Error("Metadata not found for asset ID " + assetId);
    }
  },
  parseBalance: (balanceData) => {
    // For token balances (non-native assets)
    if (balanceData.free && balanceData.reserved && balanceData.frozen) {
      return {
        free: balanceData.free.toString(),
        reserved: balanceData.reserved.toString(),
        frozen: balanceData.frozen.toString(),
      };
    } else if (balanceData.data) {
      // For native balance
      const data = balanceData.data;
      return {
        free: data.free.toString(),
        reserved: data.reserved.toString(),
        frozen: data.frozen ? data.frozen.toString() : '0',
      };
    } else {
      return { free: '0', reserved: '0', frozen: '0' };
    }
  },
},


  interlay: {
    ...baseChainConfig,
    getApiInstance: (signal) => getApiInstance(ChainKey.Interlay, signal),
    getBalance: async (api, accountId, assetId) => {
      if (assetId === 0 || assetId === "0" || assetId === undefined) {
        return api.query.system.account(accountId);
      } else {
        const asset = { foreignAsset: assetId };
        return api.query.tokens.accounts(accountId, asset);
      }
    },
    getAssetDecimals: async (api, assetId) => {
      if (assetId === 0 || assetId === "0" || assetId === undefined) {
        return getTokenDecimalsByChainName("interlay");
      } else {
        const assetList = listInterlayAssets();
        const assetInfo = assetList ? assetList.find((asset) => asset.assetId === assetId.toString()) : undefined;
        return assetInfo ? parseInt(assetInfo.asset.decimals, 10) : 12;
      }
    },
  },

  kusama: {
    getApiInstance: (signal) => getApiInstance(ChainKey.Kusama, signal),
    getBalance: async (api, accountId, assetId) => {
      return api.query.system.account(accountId);
    },
    getAssetDecimals: async () => {
      return getTokenDecimalsByChainName("kusama");
    },
    parseBalance: baseChainConfig.parseBalance,
  },



  mangatax: {
    ...baseChainConfig,
    getApiInstance: (signal) => getApiInstance(ChainKey.Mangatax, signal),
    getBalance: async (api, accountId, assetId) => {
      const asset = { foreignAsset: assetId };
      return api.query.tokens.accounts(accountId, asset);
    },
    getAssetDecimals: async (api, assetId) => {
      const assetList = listInterlayAssets();
      const assetInfo = assetList ? assetList.find((asset) => asset.assetId === assetId.toString()) : undefined;
      return assetInfo ? parseInt(assetInfo.asset.decimals, 10) : 18;
    },
  },


  moonbeam: {
    getApiInstance: (signal) => getApiInstance(ChainKey.Moonbeam, signal),
    getBalance: async (api, accountId, assetId) => {
      console.log('moonbeam getBalance', assetId, accountId)
      return api.query.assets.account(assetId, accountId);
    },
    getAssetDecimals: async (api, assetId) => {
      const assetList = listMoobeamAssets("moonbeam");
      const assetInfo = assetList ? assetList.find((asset) => asset.assetId === assetId.toString()) : undefined;
      if (assetInfo) {
        return parseInt(assetInfo.asset.decimals, 10);
      }
      throw new Error("Decimals not found in asset list");
    },
    parseBalance: (balanceData) => {
      if (balanceData.isEmpty) {
        return { free: '0', reserved: '0', frozen: '0' };
      }
      const bal = balanceData.toHuman();
      console.log('moonbeam bal', bal)  
      const balanceStr = bal.balance.replace(/,/g, "");
      return {
        free: balanceStr,
        reserved: '0',
        frozen: '0',
      };
    },
  },

  moonriver: {
    getApiInstance: (signal) => getApiInstance(ChainKey.Moonriver, signal),
    getBalance: async (api, accountId, assetId) => {
      const turAssetId = "133300872918374599700079037156071917454";
      return api.query.assets.account(turAssetId, accountId);
    },
    getAssetDecimals: async () => {
      return 10; // TUR on Moonriver has 10 decimals
    },
    parseBalance: (balanceData) => {
      if (balanceData.isEmpty) {
        return { free: '0', reserved: '0', frozen: '0' };
      }
      const bal = balanceData.toHuman();
      const balanceStr = bal.balance.replace(/,/g, "");
      return {
        free: balanceStr,
        reserved: '0',
        frozen: '0',
      };
    },
  },

  polkadot: {
    getApiInstance: (signal) => getApiInstance(ChainKey.Polkadot, signal),
    getBalance: async (api, accountId, assetId) => {
      return api.query.system.account(accountId);
    },
    getAssetDecimals: async () => {
      return getTokenDecimalsByChainName("polkadot");
    },
    parseBalance: baseChainConfig.parseBalance,
  },
  rococo: {
    getApiInstance: (signal) => getApiInstance(ChainKey.Rococo, signal),
    getBalance: async (api, accountId, assetId) => {
      return api.query.system.account(accountId);
    },
    getAssetDecimals: async () => {
      return getTokenDecimalsByChainName("rococo");
    },
    parseBalance: baseChainConfig.parseBalance,
  },


  turing: {
    ...baseChainConfig,
    getApiInstance: (signal) => getApiInstance(ChainKey.Turing, signal),
  },

};

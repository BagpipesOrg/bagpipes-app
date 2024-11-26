
import { listChains } from "../ChainsInfo/ChainsInfo";
import { ChainConfig, OrmlTokensAccountData } from "./types";

export const baseChainConfig: Omit<ChainConfig, 'getApiInstance'> = {
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
        return getTokenDecimalsByChainName(api.runtimeChain.toString().toLowerCase());
      } else {
        // Fetch decimals from asset registry
        const metadata = await api.query.assetRegistry.assets(assetId);
        if (metadata && !metadata.isEmpty) {
          const meta = (metadata as any).unwrap();
          return meta.decimals.toNumber();
        }
        throw new Error("Decimals not found in metadata");
      }
    },
    parseBalance: (balanceData) => {
      if (isOrmlTokensAccountData(balanceData)) {
        const bal = balanceData as OrmlTokensAccountData;
        return {
          free: bal.free.toString(),
          reserved: bal.reserved.toString(),
          frozen: bal.frozen.toString(),
        };
      } else if (balanceData.data) {
        const data = balanceData.data;
        return {
          free: data.free.toString(),
          reserved: data.reserved.toString(),
          frozen: data.frozen ? data.frozen.toString() : '0',
          miscFrozen: data.miscFrozen ? data.miscFrozen.toString() : '0',
          feeFrozen: data.feeFrozen ? data.feeFrozen.toString() : '0',
        };
      } else {
        return { free: '0', reserved: '0', frozen: '0' };
      }
    },
  };

  
  export function getTokenDecimalsByChainName(chainName: string): number {
    console.log(`getTokenDecimalsByChainName chainName`, chainName);
    const chainList = listChains();
    console.log(`testing getTokenDecimalsByChainName chainList`, chainList);
    const selectedChain = Object.values(chainList).find(
      (chain) => chain.name === chainName
    );
    if (!selectedChain) {
      throw new Error(`Chain not found: ${chainName}`);
    }
    return selectedChain.token_decimals;
  }
  

  function isOrmlTokensAccountData(obj: any): obj is OrmlTokensAccountData {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "free" in obj &&
      "reserved" in obj &&
      "frozen" in obj
    );
  }


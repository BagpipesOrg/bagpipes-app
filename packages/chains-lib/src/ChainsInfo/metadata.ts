export enum ChainKey {
    AssetHub = "assetHub",
    AssetHubKusama = "assetHub_kusama",
    Bifrost = "bifrost",
    Hydration = "hydration",
    Interlay = "interlay",
    Kusama = "kusama",
    Mangatax = "mangatax",
    Moonriver = "moonriver",
    Moonbeam = "moonbeam",
    People = "people",
    PeopleKusama = "people_kusama",
    Polkadot = "polkadot",
    Rococo = "rococo",
    RococoAssethub = "rococo_assethub",
    // RococoContracts = "rococo_contracts",
    Paseo = "paseo",
    PaseoPop = "paseo_pop",
    PaseoAssethub = "paseo_assethub",
    Turing = "turing",
  }

 
  export interface ChainMetadata extends BaseChainMetadata {}


  export interface BaseChainMetadata {
    chain: string;
    endpoints: string[];
    queryBalancePaths: string[];
    nativeAccount: boolean;
    queryAssetPaths?: string[]; 
    transferFunction?: string; 
  }
  
  export const CHAIN_METADATA: Record<ChainKey, ChainMetadata> = {
    [ChainKey.AssetHub]: {
      chain: "AssetHub",
      endpoints: [
        "wss://polkadot-asset-hub-rpc.polkadot.io",
        "wss://statemint.api.onfinality.io/public-ws",
      ],
      queryAssetPaths: ["assets.metadata"],
      queryBalancePaths: ["system.account", "assets.account"],
      nativeAccount: true,
    },
    [ChainKey.Bifrost]: {
      chain: "Bifrost",
      endpoints: [
        "wss://bifrost-polkadot-rpc.dwellir.com",
        "wss://bifrost-polkadot.ibp.network",
        "wss://bifrost-polkadot.dotters.network",
        "wss://hk.p.bifrost-rpc.liebi.com",
        "wss://eu.bifrost-polkadot-rpc.liebi.com/ws",
        "wss://bifrost.public.curie.radiumblock.co/ws"
      ],
      queryAssetPaths: ["assetRegistry.assetMetadatas"],
      queryBalancePaths: ["system.account", "balances.account"],
      nativeAccount: true,
    },

  [ChainKey.Paseo]: {
      chain: "paseo",
      endpoints: [
          "wss://paseo-rpc.dwellir.com",
          "wss://rpc.ibp.network/paseo"
      ],
      queryBalancePaths: ["system.account"],
      nativeAccount: true
  },
  
  [ChainKey.PaseoPop]: {
      chain: "paseo_pop",
      endpoints: [
          "wss://rpc3.paseo.popnetwork.xyz"
      ],
      queryBalancePaths: ["system.account"],
      nativeAccount: true
  },
  
  [ChainKey.PaseoAssethub]: {
      chain: "paseo_assethub",
      endpoints: [
          "wss://asset-hub-paseo-rpc.dwellir.com",
          "wss://sys.dotters.network/asset-hub-paseo"
      ],
      queryBalancePaths: ["system.account"],
      nativeAccount: true
  },
  
 
 
    [ChainKey.Hydration]: {
        chain: "Hydration",
        endpoints: [
          "wss://hydradx-rpc.dwellir.com",
          "wss://hydradx.api.onfinality.io/public-ws",
          "wss://rpc.hydradx.cloud",
        ],
        queryAssetPaths: ["assetRegistry.assets"],
        queryBalancePaths: ["system.account", "tokens.accounts"],
        transferFunction: "xTokens.transferMultiasset",
        nativeAccount: true,
      },
    [ChainKey.Interlay]: {
      chain: "Interlay",
      endpoints: [
        "wss://rpc-interlay.luckyfriday.io",
        "wss://interlay-rpc.dwellir.com",
      ],
      queryAssetPaths: ["assetRegistry.metadata"],
      queryBalancePaths: ["system.account"],
      nativeAccount: true,
    },
  
    [ChainKey.People]: {
      chain: "People",
      endpoints: [
        "wss://polkadot-people-rpc.polkadot.io",
        "wss://rpc-people-polkadot.luckyfriday.io",
      ],
      queryBalancePaths: ["system.account"],
      transferFunction: "xcmPallet.limitedReserveTransferAssets",
      nativeAccount: true,
    },
    [ChainKey.PeopleKusama]: {
      chain: "People (Kusama)",
      endpoints: [
        "wss://kusama-people-rpc.polkadot.io",
        "wss://rpc-people-kusama.luckyfriday.io",
      ],
      queryBalancePaths: ["system.account"],
      transferFunction: "xcmPallet.limitedReserveTransferAssets",
      nativeAccount: true,
    },
    [ChainKey.Polkadot]: {
      chain: "Polkadot",
      endpoints: [
        "wss://polkadot-rpc.dwellir.com",
        "wss://rpc.polkadot.io",
        "wss://polkadot.api.onfinality.io/public-ws",
      ],
      queryBalancePaths: ["system.account"],
      transferFunction: "xcmPallet.limitedReserveTransferAssets",
      nativeAccount: true,
    },
    [ChainKey.Kusama]: {
      chain: "Kusama",
      endpoints: [
        "wss://kusama-rpc.dwellir.com",
        "wss://kusama-rpc.polkadot.io",
        "wss://kusama.api.onfinality.io/public-ws",
      ],
      queryBalancePaths: ["system.account"],
      transferFunction: "xcmPallet.limitedReserveTransferAssets",
      nativeAccount: true,
    },
    [ChainKey.Moonbeam]: {
      chain: "Moonbeam",
      endpoints: [
        "wss://wss.api.moonbeam.network",
        "wss://moonbeam-rpc.dwellir.com",
      ],
      queryBalancePaths: ["system.account"],
      transferFunction: "xcmPallet.limitedReserveTransferAssets",
      nativeAccount: true,
    },
    [ChainKey.Rococo]: {
      chain: "Rococo",
      endpoints: ["wss://rococo-rpc.polkadot.io"],
      queryBalancePaths: ["system.account"],
      nativeAccount: true,
    },
    [ChainKey.RococoAssethub]: {
      chain: "Rococo Assethub",
      endpoints: ["wss://rococo-asset-hub-rpc.polkadot.io"],
      // queryAssetPaths: ["assets.metadata"], // Uncomment if needed
      queryBalancePaths: ["system.account"],
      nativeAccount: true,
    },

    [ChainKey.Mangatax]: {
      chain: "mangatax",
      endpoints: [
        "wss://kusama-archive.mangata.online",
        "wss://kusama-rpc.mangata.online",
      ],
      queryAssetPaths: ["assetRegistry.metadata"],
      queryBalancePaths: ["system.account"],
      nativeAccount: true,
    },
    [ChainKey.Moonriver]: {
      chain: "moonriver",
      endpoints: [
        "wss://moonriver-rpc.dwellir.com",
        "wss://wss.api.moonriver.moonbeam.network",
      ],
      queryAssetPaths: ["assetRegistry.metadata"],
      queryBalancePaths: ["system.account", "assets.accounts"],
      nativeAccount: true,
    },
    [ChainKey.AssetHubKusama]: {
      chain: "Kusama Assethub",
      endpoints: ["wss://statemine-rpc.dwellir.com"],
      queryBalancePaths: ["system.account"],
      nativeAccount: true,
    },
    [ChainKey.Turing]: {
      chain: "turing",
      endpoints: ["wss://rpc.turing.oak.tech"],
      queryAssetPaths: ["assetRegistry.metadata"],
      queryBalancePaths: ["system.account", "tokens.accounts"],
      nativeAccount: true,
    },
  };
  

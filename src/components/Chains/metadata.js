export const CHAIN_METADATA = {
    polkadot: {
        chain: "Polkadot",
        endpoints: [
            "wss://polkadot.api.onfinality.io/public-ws",
            "wss://rpc.polkadot.io",
        ],
        queryBalancePaths: ["system.account"],
        transferFunction: "xcmPallet.reserveTransferAssets",
        nativeAccount: true,

    },
    hydraDx: {
        chain: "HydraDX",
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
    assetHub: {
        chain: "AssetHub",
        endpoints: [
            "wss://polkadot-asset-hub-rpc.polkadot.io",
            "wss://statemint.api.onfinality.io/public-ws",
        ],
        queryAssetPaths: ["assets.metadata"],  
        queryBalancePaths: ["system.account", "assets.account"],
        nativeAccount: true,

    },
    // rococo
    sora: {
        chain: "Sora",
        endpoints: [
                "wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp",
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    },
    rococo: {
        chain: "Rococo",
        endpoints: [
                "wss://rococo-rpc.polkadot.io",
        ],
        queryBalancePaths: ["system.account"],
        nativeAccount: true,
    }
}

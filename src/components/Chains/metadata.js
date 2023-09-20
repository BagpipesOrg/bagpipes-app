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
    hydradx: {
        chain: "HydraDX",
        endpoints: [
            "wss://hydradx.api.onfinality.io/public-ws",
            "wss://rpc.hydradx.cloud",
            "wss://hydradx-rpc.dwellir.com"
        ],
        queryBalancePaths: ["system.account", "tokens.accounts"],
        transferFunction: "xTokens.transferMultiasset",
        nativeAccount: true,

    },
    assetHub: {
        chain: "AssetHub",
        endpoints: [
            "wss://statemint.api.onfinality.io/public-ws",
            "wss://polkadot-asset-hub-rpc.polkadot.io",
        ],
        queryBalancePaths: ["system.account", "assets.account"],
        nativeAccount: true,

    }
}

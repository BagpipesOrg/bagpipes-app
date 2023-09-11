


// ws endpoints 
export const rococo_ws = "wss://rococo-rpc.polkadot.io";

export const rococo_asset_hub_ws = "wss://Frococo-asset-hub-rpc.polkadot.io";

export const roc_basilisk_ws = "wss://basilisk-rococo-rpc.play.hydration.cloud";

export const roc_hydradx_ws = "wss://hydradx-rococo-rpc.play.hydration.cloud";

export const roc_sora2_ws = "wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp";

export const polkadot_ws = "wss://rpc.ibp.network/polkadot";

export const polkadot_asset_hub = "wss://statemint.api.onfinality.io/public-ws";

export const polkadot_hydradx = "wss://hydradx-rpc.dwellir.com";

export const polkadot_polkadex = "wss://polkadex-parachain.public.curie.radiumblock.co/ws";


export interface ChainInfo {
	name: string;
	ws_endpoint: string;
	paraid: number;
  }


export function list_chains() {
    // dict[paraid] = ChainInfo
    const chain_list: Record<number, ChainInfo> = {};

    const Polkadot: ChainInfo = {
        name: 'Polkadot',
        ws_endpoint: polkadot_ws,
        paraid: 0,
      };
      chain_list[0] = Polkadot;
      const HydraDX: ChainInfo = {
        name: 'HydraDX',
        ws_endpoint: polkadot_hydradx,
        paraid: 2034,
      };
      chain_list[2034] = HydraDX;
      const assethub: ChainInfo = {
        name: 'Polkadot AssetHub',
        ws_endpoint: polkadot_asset_hub,
        paraid: 1000
      };
      chain_list[1000] = assethub;
    return chain_list;
}



/// place a hydradx omnipool order


/// send the 90% of the dot to be converted to USDT, the rest will be sent 
/// directly to assethub 
// in order to cover tx fee's
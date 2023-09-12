import { polkadot_asset_hub, polkadot_ws, polkadot_hydradx, AssetInfo, polkadot_polkadex } from "./chain_info";


import { ApiPromise, WsProvider, SubmittableResult } from "@polkadot/api";


export async function list_assethub_assets() {
	const api = await connect(polkadot_asset_hub);
	console.log(`Connected to assethub`);
	
	const dictionary = new Map<number, any>();
	const assets = await api.query.assets.metadata.entries();
    assets.forEach(([{args: [id] } ,asset]) => {
		const myasset = {
			Asset: asset.toHuman(),
			AssetID: id.toHuman(),
		};
		dictionary.set(id.toHuman() as number, myasset);
      });
// remove asset id in order to be able to parse it
	const valuesArray = Array.from(dictionary.values());
//	console.log(`starting to list..`);
//	console.log(valuesArray);
	return valuesArray;
}


export async function list_polkadex_assets() {
	const api = await connect(polkadot_polkadex);
	console.log(`Connected to Polkadex`);
	
	const dictionary = new Map<number, any>();
	const assets = await api.query.assets.metadata.entries();
    assets.forEach(([{args: [id] } ,asset]) => {
		const myasset = {
			Asset: asset.toHuman(),
			AssetID: id.toHuman(),
		};
		dictionary.set(id.toHuman() as number, myasset);
      });
	return dictionary;

}

export async function connect(ws_endpoint: string) {

	const provider = new WsProvider(ws_endpoint);
	const api = await ApiPromise.create({
		provider: provider
	  });

	return api;
  }


export async function list_hydradx_assets() {
	console.log(`listing assets on hydradx`);
	const api = await connect(polkadot_hydradx);
	const dictionary = new Map<number, any>();

	const assets = await api.query.assetRegistry.assets.entries();
	assets.forEach(([{args: [id] } ,asset]) => {
		const myasset = {
			Asset: asset.toHuman(),
			AssetID: id.toHuman(),
		};
		dictionary.set(id.toHuman() as number, myasset);
      });
	
	// remove asset id in order to be able to parse it
	const valuesArray = Array.from(dictionary.values());
//	console.log(`starting to list..`);
//	console.log(valuesArray);
	return valuesArray;
}


/// Send DOT to a parachain
export async function generic_polkadot_to_parachain(paraid: number, amount: number, address: string) {
	const api = await connect(polkadot_ws);
	//const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("AccountId32", address).toHex();

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const account = {
	  parents: 0,
	  interior: { X1: { AccountId32: { id: accountId} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];


	const tx = api.tx.xcmPallet.reserveTransferAssets(
        { V3: destination },
        { V3: account },
        { V3: asset },
        0,
      );

	return tx;
}



// working: https://hydradx.subscan.io/xcm_message/polkadot-047344414db62b7c424c8de9037c5a99edd0794c
export async function dot_to_hydradx(amount: number){
	const paraid = 2034;
	const api = await connect(polkadot_ws);
	console.log(`sending dot to hydradx`);
	const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("AccountId32", address).toHex();

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const account = {
	  parents: 0,
	  interior: { X1: { AccountId32: { id: accountId} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];


	const tx = api.tx.xcmPallet.reserveTransferAssets(
        { V3: destination },
        { V3: account },
        { V3: asset },
        0,
      );
	console.log(`tx created!`);
	console.log(tx.toHex());
	return tx;
}

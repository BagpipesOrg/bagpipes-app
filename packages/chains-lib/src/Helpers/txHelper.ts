/// extra transactions

import { ApiPromise } from "@polkadot/api";
import { genericRawNativeBalance } from "./AssetHelper";
import { getApiInstance } from "../api/connect";
import { supported_Polkadot_Chains } from "../ChainsInfo";
import endpoints from "../api/WsEndpoints";
import { addressToEvm } from "@polkadot/util-crypto";
import { ChainKey } from "../api/metadata";

const u8aToHex = (bytes: number[] | Uint8Array): string => {
  const arr = bytes instanceof Uint8Array ? Array.from(bytes) : bytes;
  return (
    "0x" +
    arr.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
  );
};

// convert ss58 accountid32 to accountid20(evm)
export function substrate_address_to_evm(accountid32: string): string {
  const byteArray = addressToEvm(accountid32);
  return u8aToHex(byteArray); // return the hex version of the address
}

/// spawn a subscription and wait until balance on destination
/// account has been updated
async function spawn_native_balance_check(
  chain: supported_Polkadot_Chains,
  account: string,
  block_limit: number
) {
  let api: ApiPromise;
  // get the api instance for the chain
  switch (chain) {
    case supported_Polkadot_Chains.polkadot:
      api = await getApiInstance(endpoints.polkadot.default as ChainKey);
      console.log(`Polkadot`);
      break;
    case supported_Polkadot_Chains.assethub:
      api = await getApiInstance(endpoints.polkadot.assetHub as ChainKey);
      break;
    case supported_Polkadot_Chains.hydradx:
      api = await getApiInstance(endpoints.polkadot.hydraDx as ChainKey);
      break;
  }
  const original_balance = await genericRawNativeBalance(api, account);
  let count = 0;
  const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
    console.log(`Chain is at block: #${header.number}`);
    console.log(`Checking for balance changes`);
    /// check if the free amount has changed
    const new_balance = await genericRawNativeBalance(api, account);
    if (new_balance.free != original_balance.free) {
      console.log(`Balance has changed`);
      unsubscribe();
      //	process.exit(0); // change to die nicer?
    }

    if (++count === block_limit) {
      console.log(`block limit reached, exit...`);
      unsubscribe();
      //  process.exit(0); // change to die nicer?
    }
  });
}

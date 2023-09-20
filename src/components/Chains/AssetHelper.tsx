import connectToWsEndpoint from './connect';
import { ChainInfo, listChains } from './ChainsInfo'; 
import { adjustBalance, parseBalanceString, formatToFourDecimals, toUnit} from './utils'
import { ApiPromise } from "@polkadot/api";
import { string } from 'slate';

interface AssetResponseObject {
    nonce: number;
    consumers: number;
    providers: number;
    sufficients: number;
    data: {
      free: number;
      reserved: number;
      miscFrozen: number;
      feeFrozen: number;
      total: number;
    };
  }
 
function isAssetResponseObject(obj: any): obj is AssetResponseObject {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'nonce' in obj &&
      'consumers' in obj &&
      'providers' in obj &&
      'sufficients' in obj &&
      'data' in obj
    );
  }

/// convert assethub's asset balance response
interface  AssetHubAssetBalance {
  balance: number;
  status: string;
  reason: string,
  extra: string
}

function  isAssetHubAssetBalance(obj: any): obj is  AssetHubAssetBalance {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'balance' in obj &&
    'status' in obj &&
    'reason' in obj &&
    'extra' in obj
  );
}


// check asset balance on polkadot assethub
async function checkAssetHubAssetBalance(assetid: number, account_id_32: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  console.log(`checkAssetHubAssetBalance accountId`, account_id_32)
  // below, signal is used to abort the request
  const api = await connectToWsEndpoint('assetHub', signal);
  const balance = await api.query.assets.account(assetid, account_id_32);
  const b3 = balance.toHuman();
  console.log(`checkAssetHubAssetBalance balance`, balance)
  if (isAssetHubAssetBalance(b3)) {
      const bal_obj: AssetHubAssetBalance = b3;
      console.log(`checkAssetHubAssetBalance balance object`, bal_obj)
      return {
          free: bal_obj.balance,
          reserved: 0, 
          total: bal_obj.balance 
      };
  } 
  return { free: 0, reserved: 0, total: 0 };
   // console.log(balance.registry.);
//    console.log(`checkAssetHubAssetBalance done`);
}

interface OrmlTokensAccountData {
  free: number;
  reserved: number;
  frozen: number;
}

function isOrmlTokensAccountData(obj: any): obj is OrmlTokensAccountData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'free' in obj &&
    'reserved' in obj &&
    'frozen' in obj
        );
}


// returns the raw asset balance number, if not it returns 0
async function checkHydraDxRawAssetBalance(assetid: number, account_id_32: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, frozen: number } > {
  console.log(`checkHydraDxRawAssetBalance accountId`, account_id_32)
  console.log(`checkHydraDxRawAssetBalance assetId`, assetid)
  let api: any;
  let hdxBalance: any;
  let bal_obj: OrmlTokensAccountData;
    console.log(`checkHydraDxRawAssetBalance trying to connect`)
    try {
      api = await connectToWsEndpoint('hydraDx', signal);
      hdxBalance = await api.query.tokens.accounts(account_id_32, assetid);
  } catch (error) {
      console.error(`Error retrieving balance for asset ID ${assetid} and account ${account_id_32}:`, error);
      return { free: 0, reserved: 0, frozen: 0 };
  }
    const stringBalance = hdxBalance.toHuman();
    console.log(`checkHydraDxRawAssetBalance Raw HDX Balance:`, stringBalance);


    // convert asset balance type to parsable type 
    if (isOrmlTokensAccountData(hdxBalance)){
      bal_obj = hdxBalance
      console.log(`checkHydraDxRawAssetBalance bal obj`, bal_obj)
      return {
        free: bal_obj.free, 
        reserved: bal_obj.reserved, 
        frozen: bal_obj.frozen
      };
    }


    return { free: 0, reserved: 0, frozen: 0 };
}

/// returns the raw balance of the native dot token
async function checkPolkadotDotRawNativeBalance(accountId: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  let bal: any;
  let bal3: any;
  if (accountId) {
    const api = await connectToWsEndpoint('polkadot', signal);
    bal = await api.query.system.account(accountId);
  }
  bal3 = bal.toHuman();

  if (isAssetResponseObject(bal3)) {
      const bal2: AssetResponseObject = bal3;
      return {
          free: bal2.data.free,
          reserved: bal2.data.reserved,
          total: bal2.data.total
      };
  }
  return { free: 0, reserved: 0, total: 0 };
}

/// returns the raw balance of the native dot token
async function checkRococoRocRawNativeBalance(accountid: string, signal?: AbortSignal): Promise<{ free: number, reserved: number, total: number }> {
  const api = await connectToWsEndpoint('rococo', signal);
  const bal = await api.query.system.account(accountid);
  const bal3 = bal.toHuman();
  if (isAssetResponseObject(bal3)) {
      const bal2: AssetResponseObject = bal3;
      return {
          free: bal2.data.free,
          reserved: bal2.data.reserved,
          total: bal2.data.total
      };
  }
  return { free: 0, reserved: 0, total: 0 };
}




/*
assetRegistry.assetMetadataMap(5)
{
  symbol: DOT
  decimals: 10
}
*/
async function getHydradxAssetSymbolDecimals(assetid: number){
    const api = await connectToWsEndpoint('hydraDx');
    const resp = (await api.query.assetRegistry.assetMetadataMap(assetid)).toHuman();
    return resp;
}

function getTokenDecimalsByChainName(chainName: string): number {
  const chainList = listChains();
  const selectedChain = Object.values(chainList).find(chain => chain.name === chainName);
  if (!selectedChain) {
      throw new Error(`Chain not found: ${chainName}`);
  }
  return selectedChain.token_decimals;
}


export async function getAssetBalanceForChain(chain: string, assetId: number, accountId: string, signal?: AbortSignal): Promise<{ free: string, reserved: string, total: string }> {
  let balances: { free: number, reserved: number, total?: number, frozen?: number };


  const sanitizedAssetId = parseInt(assetId.toString().replace(/,/g, ''), 10);

  if (signal && signal.aborted) {
    throw new Error('Operation was aborted');
  }

  console.log(`getAssetBalanceForChain checking chain: ${chain}, ${assetId}, ${accountId}`);

    if (chain === "polkadot") {
        balances = await checkPolkadotDotRawNativeBalance(accountId, signal);

    } else if (chain === "hydraDx") {
      console.log(`getAssetBalanceForChain checking hydradx asset id`, assetId);
        balances = await checkHydraDxRawAssetBalance(assetId, accountId, signal);
        console.log(`getAssetBalanceForChain balance for hydradx`, balances.free.toString());

    } else if (chain === "assetHub") {
        balances = await checkAssetHubAssetBalance(sanitizedAssetId, accountId, signal);
    } else if (chain === "rococo") {
        balances = await checkRococoRocRawNativeBalance(accountId, signal);
    } else {
        throw new Error(`Unsupported chain: ${chain}`);
    }

    const tokenDecimals = getTokenDecimalsByChainName(chain);
    console.log(`checkAssetBalance balances.free: ${balances.free}`);
    const freeInUnits = toUnit(balances.free, tokenDecimals);
    console.log(`checkAssetBalance freeInUnits: ${freeInUnits}`);
    const reservedInUnits = toUnit(balances.reserved, tokenDecimals);

    console.log(`Free Balance in units: ${freeInUnits}`);
    console.log(`Reserved Balance in units: ${reservedInUnits}`);

    const totalInUnits = freeInUnits + reservedInUnits;
    console.log(`totalInUnits: ${totalInUnits}`);

    const totalRawBalances = Number(balances.free) + Number(balances.reserved) + Number(balances.frozen);
    console.log(`totalRawBalances: ${JSON.stringify(totalRawBalances)}`);

    console.log(`rawBalances: ${JSON.stringify(balances)}`);
    const adjustedBalances = {
      free: freeInUnits.toString(),
      reserved: reservedInUnits.toString(),
      total:totalInUnits.toString(),
      

  };
    const adjustedTrimmedBalancesIncludingData = {
      free: formatToFourDecimals(adjustedBalances.free),
      reserved: formatToFourDecimals(adjustedBalances.reserved),
      total: formatToFourDecimals(adjustedBalances.total),
      info: {
        chain, accountId, assetId, tokenDecimals
      }

    }
    console.log(`adjustedBalances [raw]: ${JSON.stringify(adjustedBalances)}`);
    return adjustedTrimmedBalancesIncludingData;
}


// generic function to check native account balance
async function generic_check_native_balance(api: ApiPromise, address: string) {
  // convert address to pubkey
 // const accountId = api.createType("account_id_32", address).toHex();
  const bal = await api.query.system.account(address);
  const bal3 = await bal.toHuman();
  if (isAssetResponseObject(bal3)) {
      const bal2: AssetResponseObject = bal3;

      return { free: bal3.data.free, reserved: bal3.data.reserved, miscFrozen:  bal3.data.miscFrozen , feeFrozen: bal3.data.feeFrozen} 
        }
    return {free: 0, reserved: 0, miscFrozen: 0, feeFrozen: 0};
}

async function hydradx_native_balance(address: string){
  const api = await connectToWsEndpoint('hydraDx');
  const result = generic_check_native_balance(api, address);
  return result
}

async function assethub_native_balance(accountid: string){
  const api = await connectToWsEndpoint('assetHub');
  const result = generic_check_native_balance(api, accountid);

    return result;
}



/// check asset decimals and metadata

interface AssethubAssetMetadata {
  deposit: number;
  name: string;
  symbol: string;
  decimals: number;
  isFrozen: boolean;
}

function isAssethubAssetMetadata(obj: any): obj is AssethubAssetMetadata {
return (
  typeof obj === 'object' &&
  obj !== null &&
  'deposit' in obj &&
  'name' in obj &&
  'decimals' in obj &&
  'isFrozen' in obj
      );
}

// get asset metadata 
// output:  {"deposit":"u128","name":"Bytes","symbol":"Bytes","decimals":"u8","isFrozen":"bool"}
async function get_assethub_asset_metadata(assetid: number) {
const api = await connectToWsEndpoint('assetHub');
const quuery = await api.query.asset.metadat(assetid);

if (isAssethubAssetMetadata(quuery)){
  const data: AssethubAssetMetadata = quuery
  return { "deposit": data.deposit, "name": data.name, "symbol": data.symbol, "decimals": data.decimals, "isFrozen": data.isFrozen};
}

return  {"deposit":0 ,"name":"not found","symbol":"NOT FOUND","decimals":0,"isFrozen":false}
}


/*
assetRegistry.assetMetadataMap(5)
{
  symbol: DOT
  decimals: 10
}
*/
async function get_hydradx_asset_symbol_decimals(assetid: number){
  const api = await connectToWsEndpoint('hydraDx');
  const resp = (await api.query.assetRegistry.assetMetadataMap(assetid)).toHuman();
  return resp;
}

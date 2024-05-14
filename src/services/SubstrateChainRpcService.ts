import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { getApiInstance } from '../Chains/api/connect';
import { signExtrinsicUtil } from '../components/Bagpipes/utils/signExtrinsicUtil';
import { Codec } from '@polkadot/types/types';

interface MethodParams {
  chainKey: string;
  palletName: string;
  methodName: string;
  params: any[];
  atBlock?: string;
  signerAddress?: string; // Include only for transactions that need signing
  signer?: any; // Include only for transactions that need signing
}

class SubstrateChainRpcService {
  static async executeChainQueryMethod({ chainKey, palletName, methodName, params, atBlock }: MethodParams): Promise<any> {
    const api = await getApiInstance(chainKey);
    const method = this.resolveMethod(api, palletName, methodName, false);
    const formattedParams = this.formatParams(params);

    try {
      let result: Codec;
      if (atBlock) {
        const blockHash = await this.getBlockHash(api, atBlock);
        result = await method.at(blockHash, ...formattedParams);
      } else {
        result = await method(...formattedParams);
      }
      return result.toHuman();
    } catch (error) {
      console.error('Error executing chain query method:', error);
      throw error;
    }
  }

  static async executeChainSignMethod({ chainKey, palletName, methodName, params, signerAddress, signer }: MethodParams): Promise<any> {
    const api = await getApiInstance(chainKey);
    const method = this.resolveMethod(api, palletName, methodName, true);
    const formattedParams = this.formatParams(params);
    const extrinsic = method(...formattedParams) as SubmittableExtrinsic<'promise'>;

    if (!signerAddress) throw new Error("Signer address is required for transaction signing.");

    
    
    const signedExtrinsic = await signExtrinsicUtil(api, signer, extrinsic, signerAddress);
    return await signedExtrinsic.send();
  }

  private static resolveMethod(api: ApiPromise, palletName: string, methodName: string, isTx: boolean): any {
    const camelPalletName = this.toCamelCase(palletName);
    const camelMethodName = this.toCamelCase(methodName);
    const namespace = isTx ? api.tx : api.query;

    if (!namespace[camelPalletName] || !namespace[camelPalletName][camelMethodName]) {
      throw new Error(`The method ${methodName} is not available on the pallet ${palletName}.`);
    }
    return namespace[camelPalletName][camelMethodName];
  }

  private static formatParams(params: any[]): any[] {
    // Ensure params are correctly formatted as an array
    return Array.isArray(params) ? params : [params];
  }

  private static async getBlockHash(api: ApiPromise, atBlock: string): Promise<string> {
    if (/^\d+$/.test(atBlock)) { // If it's a numeric string, treat it as a block number
      const blockNumber = parseInt(atBlock, 10);
      return (await api.rpc.chain.getBlockHash(blockNumber)).toString();
    }
    return atBlock; // Otherwise, it's already a block hash
  }

  private static toCamelCase(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }
}

export default SubstrateChainRpcService;

import { getApiInstance } from '../Chains/api/connect';

interface MethodParams {
    chainKey: string;
    palletName: string;
    methodName: string;
    params: any[];
    atBlock?: string; // Could be a block number or hash
}

class ChainQueryRpcService {
    static async executeChainQueryMethod({ chainKey, palletName, methodName, params, atBlock }: MethodParams): Promise<any> {
        console.log('Executing method:', methodName, 'on pallet:', palletName, 'with params:', params, 'at block:', atBlock);
        const api = await getApiInstance(chainKey);
        const camelPalletName = this.toCamelCase(palletName);
        const camelMethodName = this.toCamelCase(methodName);

        if (!api.query[camelPalletName] || !(api.query[camelPalletName] as any)[camelMethodName]) {
            throw new Error(`The method ${camelMethodName} is not available on the ${camelPalletName} pallet.`);
        }

        const method = (api.query[camelPalletName] as any)[camelMethodName];
        const inputParams = Array.isArray(params) ? params : [params];

        try {
            let blockHash = atBlock;

            // Convert block number to block hash if necessary
            if (atBlock && /^\d+$/.test(atBlock)) {
                console.log('Converting block number to block hash:', atBlock);
                const blockNumber = parseInt(atBlock, 10);
                const hashResult = await api.rpc.chain.getBlockHash(blockNumber);
                blockHash = hashResult.toString();
            }

            if (blockHash) {
                // Execute the query at a specific block hash
                return (await method.at(blockHash, ...inputParams)).toHuman();
            } else {
                // Execute the query at the latest state
                return (await method(...inputParams)).toHuman();
            }
        } catch (error) {
            console.error('Error executing method:', error);
            throw error;
        }
    }

    private static toCamelCase(str: string): string {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
}

export default ChainQueryRpcService;

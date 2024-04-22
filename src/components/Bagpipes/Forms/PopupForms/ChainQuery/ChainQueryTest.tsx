import { ApiPromise, WsProvider } from '@polkadot/api';

// This is the predefined chain metadata you mentioned
import { CHAIN_METADATA } from '../../../../../Chains/api/metadata';

async function connectChain(chainKey: keyof typeof CHAIN_METADATA) {
    const chainInfo = CHAIN_METADATA[chainKey];
    const provider = new WsProvider(chainInfo.endpoints[0]);  // Use the first available endpoint
    const api = await ApiPromise.create({ provider });
    return api;
}

async function fetchAndDecodeMetadata(api: ApiPromise) {
    const metadata = await api.rpc.state.getMetadata();
    const metadataAsString = metadata.toHuman(); // Converts the metadata to a more readable form
    console.log(metadataAsString);
    return metadataAsString;
}


export async function queryMetadata() {
    const api = await connectChain('polkadot');
    const metadata = await fetchAndDecodeMetadata(api);
    return metadata;
}

queryMetadata().catch(console.error);

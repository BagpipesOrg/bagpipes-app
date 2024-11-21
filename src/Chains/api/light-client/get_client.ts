import custompolkadot from '@polkadot-api/descriptors';
import { chainSpec as polkadotchainSpec } from "polkadot-api/chains/polkadot";
import { createClient } from "polkadot-api";              
import { getSmProvider } from "polkadot-api/sm-provider"; 
import { startFromWorker } from "polkadot-api/smoldot/from-worker";



export async function get_polkadot_client(){
    const smWorker = new Worker(import.meta.resolve("polkadot-api/smoldot/worker"));                                                               
        const smoldot = startFromWorker(smWorker)                              
        console.log(`started smoldot client `)                                 
        const polkadotChain: Promise<Chain> = smoldot.addChain({ polkadotchainSpec }) ;
        console.log(`dot added`)                                               
        const provider = getSmProvider(polkadotChain)                          
        const client = createClient(provider)                                  
        console.log(`got client`)                                              
                                                                               
        const api = client.getTypedApi(custompolkadot)                         
        
    return api;

}
/// parse the diagram data and return a tx
import { assethub_to_chain } from "./../../Chains/DraftTx"; // assethub > parachain


interface FormState {
    address: string;
    amount: number;
    asset: {
      name: string;
      assetId: number;
    };
    chain: string;
    contact: null | any; // You can specify the actual type for 'contact' if needed
  }

interface DiagramData {
    nodes: Array<{
      id: string;
      type: string;
      data: any; // You can specify the actual type for 'data' here
      formState: FormState; 
    }>;
    edges: Array<{
      // Define the properties of the 'edges' objects if needed
      // For example: id: string; source: string; target: string;
    }>;
  }
  
// works with 2 nodes, first is source chain, last is destination chain
async function diagram2tx(diagraminput: DiagramData) {
    const tx = "not set";
    console.log('[diagram2tx] called!!');
    let SourceChain: FormState[] = [];

    for (const node of diagraminput.nodes) {
        if (Object.keys(node.formState).length > 0) {
        if (SourceChain.length < 2) {
            SourceChain.push(node.formState);
        }

        console.log("[diagram2tx] Node ID:", node.id);
        console.log("[diagram2tx] Node Type:", node.type);
        console.log("[diagram2tx] Node Data:", node.data);
        console.log("[diagram2tx] Node Form State:", node.formState);
        }
      }      
       
    const source_chain = SourceChain[0];
    const destination_chain = SourceChain[1];
    const action = 'set me';
    console.log('[diagram2tx] Source chain: ', source_chain.chain);
    console.log('[diagram2tx] Source asset: ', source_chain.asset);
    console.log('[diagram2tx] Destination chain: ', destination_chain.chain);
      
     if (source_chain.chain = "assethub") {
        const destinationparaid = 11337;
        const amount: number = source_chain.amount;
        const assetid = source_chain.asset.assetId;
        const destaddress = destination_chain.address;
        console.log('[diagram2tx] creating tx');
        const tx: string = await assethub_to_chain(destinationparaid, amount, assetid, destaddress);
        console.log('[diagram2tx] tx ok:', tx);
        console.log('[diagram2tx] assethub okayy!');
        return tx;
     };
   // console.log('[diagram2tx] reading FORM state: ', diagramData.nodes[2].formState); //check if formstate is a valid option
   console.log('[diagram2tx] EOL!!');
   return tx;
}

export default diagram2tx;
import { dotToHydraDx, turing2moonriver, moonriver2turing, mangata2turing, polkadot_assethub_to_assetHub_kusama, hydraDxToParachain, turing2mangata, generic_kusama_to_parachain, assethub_to_hydra, hydradx_to_polkadot, hydradx_to_assethub, roc2assethub, polkadot_to_assethub, interlay2assethub, assethub2interlay, assethub_to_polkadot } from "../../../../Chains/DraftTx/DraftxTransferTx";
import { getTokenDecimalsByAssetName, getTokenDecimalsByChainName, get_hydradx_asset_symbol_decimals } from "../../../../Chains/Helpers/AssetHelper";
import toast from "react-hot-toast";
import { isEthereumAddress } from '@polkadot/util-crypto';

import { hydradx_omnipool_sell } from "../../../../Chains/DraftTx/DraftSwapTx";
import { listChains } from "../../../../Chains/ChainsInfo";
import { account } from "@polkadot/api-derive/balances";
import { evm } from "@polkadot/types/interfaces/definitions";

export async function extrinsicHandler(actionType, formData) {
    
    switch(actionType) {
        case 'xTransfer':
            console.log("Inside extrinsicHandler for xTransfer formData:", formData);
            return handlexTransfer(formData);
        case 'swap':
            console.log("Inside extrinsicHandler for swap");
            return await handleSwap(formData);
        case 'remark':
            console.log(`handling remark`);
            return handleRemark(formData);
        default:
            throw new Error("Unsupported action type.");
        }
};

function handleRemark(formData) {
    const source = formData.source;
    const msg = source.target;
    const chain = source.chain;
    console.log(`source: `, source);
    console.log(`handle Remark form data:`, formData);
    return generic_system_remark(chain, msg);
   
   // throw new Error("You can only swap from hydradx to hydradx");
}


function handlexTransfer(formData) {
    console.log("handlexTransfer Handling xTransfer...");
    const chains = listChains();
    const source = formData.source;
    const target = formData.target;
    const delay = formData.source.delay;

    // check if the asset is native or on-chain asset. 
    // Retrieve token decimals for the source chain
    const tokenDecimals = getTokenDecimalsByChainName(source.chain);

    // Adjust the source amount according to the token decimals
    const submittableAmount = source.amount * (10 ** tokenDecimals);

    console.log(`handlexTransfer Source chain: ${source.chain}`);
    console.log(`handlexTransfer Target chain: ${target.chain}`);
    console.log(`handlexTransfer Source amount: ${source.amount}`);
    console.log(`handlexTransfer Target address: ${target.address}`);

    // Define a map for each xTransfer action
    const reserverTransferActions = {
        'polkadot:hydraDx': () => {
            if(delay) {
                const numberValue = Number(delay);
                if (numberValue >= 1){
                    return dotToHydraDx(submittableAmount, target.address, numberValue);
                };
            };
            console.log("handlexTransfer for Polkadot to HydraDx...");
            return dotToHydraDx(submittableAmount, target.address);
        },
        'hydraDx:assetHub': () => {
            console.log("handlexTransfer for HydraDx to AssetHub...");

            return hydradx_to_assethub(source.amount, target.assetId, source.assetId, target.address);
        },
        'polkadot:assetHub': () => {
            if(delay) {
                const numberValue = Number(delay);
                if (numberValue >= 1){
                    return polkadot_to_assethub(submittableAmount, target.address, numberValue);
                };
            };
            console.log("handlexTransfer for Polkadot to AssetHub...");
            return polkadot_to_assethub(submittableAmount, target.address);
        }, 
        'assetHub:polkadot': () => {
            console.log("handlexTransfer for AssetHub to Polkadot...");
            return assethub_to_polkadot(submittableAmount, target.address);
        },
        'hydraDx:polkadot': () => {
            console.log("handlexTransfer for HydraDx to Polkadot...");
            const paraid = 0;
            const hamount = source.amount * (10 ** 10); // DOT asset on hydra has 10 decimals
            return hydradx_to_polkadot(hamount, target.address);
            //return hydraDxToParachain(submittableAmount, source.assetId, target.chain, paraid);
        },

        'assetHub:interlay': () => {
            const tetherAmount = submittableAmount / 1000;
            console.log("handlexTransfer forAssetHub to Interlay...", tetherAmount);
            return assethub2interlay(source.assetId, tetherAmount, target.address);
        },
/**/
        'moonriver:turing': () => {
        //    if not address is evm, break 
        //    {moonbeam_address_eth_warn && <p>invalid address</p>}
                return moonriver2turing(target.address, submittableAmount/100000000);
        },

       
        'turing:moonriver': () => {
             if (!isEthereumAddress(target.address)) { //  evm account check
                throw new Error("Only allowed to send to ethereum addresses when sending to moonriver");
            };
            return turing2moonriver(target.address, submittableAmount);
        },

        'assetHub:assetHub_kusama': () => {
            console.log(`Polkadot assethub to kusama assethub`);
            console.log(`input: `, submittableAmount, target.address);
           return polkadot_assethub_to_assetHub_kusama(submittableAmount, target.address);
        },


        'turing:mangatax': () => {
            return  turing2mangata(submittableAmount, target.address) ;
        },

        /* mangata has some weird signing ... not working atm
        'mangatax:turing': () => {
            return mangata2turing(submittableAmount, target.address, source.assetId);
        },
*/
/*  
not ready yet      
    

        'kusama:turing': () => {
            return generic_kusama_to_parachain(2114, submittableAmount, target.address);
        },
  */     
            // not supported
                // 'interlay:assethub': () => {
                //     return interlay2assethub(source.assetId, submittableAmount, target.address);
                //    },

        // ROC transfer, todo add transfer logo
        'rococo:rococo_assethub': () => {
            console.log(`rococo to rococo assethub transfer`);
            const amount = submittableAmount;
            const dest = target.address;
            return roc2assethub(amount, dest);
        },

        'assetHub:hydraDx': () => {
            console.log("handlexTransfer forAssetHub to HydraDx...");
            const paraid = 2034;
            return assethub_to_hydra(source.assetId, submittableAmount, target.address);
        }
    };

    const action = reserverTransferActions[`${source.chain}:${target.chain}`];

    if (action) {
        console.log(`action got!`);
        return action();
    } else {
        console.log("Unsupported xTransfer direction.");
        toast("Action data is empty. Did you fetch?");
        
        throw new Error("Unsupported xTransfer direction.");
    }
}


 
async function handleSwap(formData) {
    const source = formData.source;
    const target = formData.target;
    console.log(`handle swap form data:`, formData);
      // Retrieve token decimals for the source chain
    //   const tokenDecimals = getTokenDecimalsByChainName(source.chain);
      const tokenDecimals =  await getTokenDecimalsByAssetName(source.assetId);
console.log(`tokenDecimals: `, tokenDecimals);
           // Adjust the source amount according to the token decimals
      const submittableAmount = source.amount * (10 ** tokenDecimals);
        const assetin = source.assetId;
        const assetout = target.assetId;
        const amount = submittableAmount;
        //const minBuyAmount = set as recieve amount ;
      /// assetin = asset you have on your account
/// assetout = asset you want to swap to
/// amount = amount of assetin you want to swap to assetout
/// minBuyAmount = minimum amount to buy, note: tx will fail if this is set to 0 or to low
      // TODO: handle swaps
    if (source.chain === 'hydraDx' && target.chain === 'hydraDx') {

        
        return hydradx_omnipool_sell(assetin, assetout, source.amount, submittableAmount);  //hydradx_omnipool_sell(assetin: string, assetout: string, amount: number, minBuyAmount: number)
       //  true;
    }
    throw new Error("You can only swap from hydradx to hydradx");
}

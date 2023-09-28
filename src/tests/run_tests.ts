/// tests for XCMSend

import { genericPolkadotToParachain, assethub_to_parachain,  hydraDxToParachain, dotToHydraDx } from '../Chains/DraftTx/DraftReserveXTx';


// tests transaction transfers
async function test_transfers() {
    const paraid = 1000; //assethub
    const amount = 1337;
    const assetid = 1984;//usdt
    const address = "0x68de6e1566e333753df02b2446f24e1cc2b796cfdf954dc0f39753c578e02a40";// random accountid32
    console.log(`[test] Polkadot transfers`);
    const runp = await genericPolkadotToParachain(paraid, amount, address);
    console.log(`Polkadot DOT > assethub OK`)
    const runp2 = await dotToHydraDx(amount, address);
    console.log(`Polkadot DOT > hydradx OK`)
   
 
    console.log(`[test] AssetHub transfers`);
    const ah = await assethub_to_parachain(assetid.toString(), amount, address, 2034); // hydradx
    console.log(`Assethub > hydradx ok`);
    const ap = await assethub_to_parachain(assetid.toString(), amount, address, 0); // polkadot
    console.log(`Assethub > Polkadot ok`);


    console.log(`[test] HydraDx transfers`);
    const runh = await hydraDxToParachain(amount, assetid, address, paraid);
    console.log(`Hydradx > assethub ok`)
    const hp = await hydraDxToParachain(amount, assetid, address, 0); // polkadot
    console.log(`Hydradx > polkadot ok`);

    console.log(`all transaction tests are ok!`);
}

async function test_balances(){}

async function main() {
    console.log('Running tests');
    
    console.log('Running Balance tests');

    console.log('running transaction tests');
    await test_transfers();
    console.log('test completed');
}


main();
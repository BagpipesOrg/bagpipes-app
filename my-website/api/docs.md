# Api Documentation


## DB:    
Right now the API just use a simple key value inspired json file to store the diagram data, the file can be found at *dist/src/api/urls2.json*.   
The format is `{storage_key, compressed_diagramdata}`  
    
 Reset db:   
 ```shell
 echo "{urls:[]}" > dist/src/api/urls2.json
 ```


### Paths:  

##### Path: `/scenario/info`;   
Get information about a scenario.  

### Code:
```shell
$ curl -X POST -H "Content-Type: application/json" -d '{"id": "Uvervffcw"}' http://localhost:8080/scenario/info
$ {"result":"assetHub > xTransfer > polkadot"}
```

## Path: `/create/scenario`;   
Create a new scenario.  
### Code:
```shell
$ curl -X POST -H "Content-Type: application/json" -d '{"source_chain": "polkadot", "dest_chain": "hydraDx", "source_address": "your_source_address", "amount": 100, "assetid": 1}' http://localhost:8080/create/scenario
$ {"result":"QWdI3KifK"}
```
    
After your scenario id is generated, you can import it in the ui:   
`http://localhost:5173/#/create/?diagramData=MY_SCENARIO_ID`
    
## `/create/swap`:
Swap an asset using the HydraDx omnipool.

### Code:
In this example we want to swap 10 amount of asset 0(HDX) for asset 5(DOT).  

```shell 
$ curl -X POST -H "Content-Type: application/json" -d '{"assetin": 0, "assetout": 5, "amount": 10 }' http://localhost:8080/create/swap
{"success":true,"swap":{"swap_tx":"0xac043b05010000000500000000a0724e180900000000000000000000377d61b2850000000000000000000000","scenarioid":"IkwpZfaqF"}}

```
Sign and broadcast the swap_tx or view the scenario in our main UI with the scenarioid. 


*input:*   
-  assetin   
>  Number type, the asset id of the asset you want to convert from and have balance of.   

-  assetout   
>  Number type, the asset id of the asset you want to recieve. The recieving assetid 

-  amount     
>  Number type, Enter the amount you want to swaps of assetin asset. **Note:** if you want to exchange for example 10 dot, enter 10, do not enter the amount * token decimals. Enter the amount just like you would on any swap site.   





#### `/xcm-asset-transfer`:  

##### Info:  
Transfer an on-chain asset from one polkadot connected parachain to another


##### Code example:   
```shell
$ curl -X POST http://127.0.0.1:8080/xcm-asset-transfer   -H "Content-Type: application/json"   -d '{
    "sourchain": "assethub",
    "destchain": "hydradx",
    "assetid": "1984",
    "amount": 100,
    "destinationaddress": "7MinRZBqmh7SaJsNjsMuJHw3teB1Q834vvG1zSMPHQ2DQaAa"
  }'
```  
#### Result:  
`{"txdata":"0xec04630803000100c91f0300010100b673e1853db0a7eb8a38e7a6309d0f5a39c29d929f586f7d5d1e588845e2895703040000000091010000000000"}
`

*input:*   
- sourchain = assethub/hydradx/polkadot    
- deschain = hydradx/polkadot/assethub   
- assetid = id of asset to send   
- amount = raw amount to send   
- destination address = address of reciever on the destination chain  



## `/polkadot/openchannels`  

##### Info:  
Check what hrmp channels are avaliable for a parachain connected to polkadot.  



##### Code example:   
```shell
curl -X POST -H "Content-Type: application/json" -d '{"paraid": 1000}' http://localhost:8080/polkadot/openchannels              
```

Result: 
`{"open_hrmp_channels":1001,1002,2000,2004,2006,2007,2011,2012,2013,2030,2031,2032,2034,2035,2040,2046,2048,2051,2094,2101,2104],"sourcechain":1000}`


## `/call/template`  

##### Info:  
Coming soon


#### `/call/scenario`  

##### Info:  
Coming soon



## `/broadcast`:

###### Information:  
Broadcast a transaction using author submitextrinsics 

*input:*   
- chain = assethub/hydradx/polkadot    
- tx = signed transaction   

##### Testing broadcast:
Broadcast:

```typescript
async function broadcast_transaction() {
    await cryptoWaitReady();
    console.log(`broadcast_transaction start`);
    console.log(`generating tx..`);
// set your account keys
    const alice = get_test_account();
    const pa_tx = (await route_tx('polkadot', 'hydradx', 0, 20000, '16XByL4WpQ4mXzT2D8Fb3vmTLWfHu7QYh5wXX34GvahwPotJ'));
    console.log(`rawtx:`, pa_tx.toHex());
    const api = await connectToWsEndpoint('polkadot');
    const signhere = await pa_tx.signAsync(alice);
    console.log(`Signature: `, signhere.toHex());
    const testo = api.tx(signhere); // this will break if the tx is invalid
    console.log(`Verfied tx:`, testo.toHex());
    const bhash = await broadcastToChain('polkadot', testo);
    console.log(`blockhash published: `, bhash.toString());
    console.log(`broadcast_transaction done`);
}
```

Configure the right key in get_test_account and run the tx signing:
```ts
tx_si start
generating tx..
route_tx start
polkadot:hydradx
handleTransfer for Polkadot to HydraDx...
cant connect
connect
drafting dot to hydradx
Creating tx
4
rawtx: 0xf404630803000100c91f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000823801000000000000
Signature:  0x8d0284005400e2f7f5669b26998d8e4d3c1a2c8a2d0a9af827ca54a1cc3509105035c32e01286f7090ae34a1e3b8827ef9c035ede86a2b3e5c16bb6df072541327c7797d07e5934e245ae7c9ce199b2212fe559ff2df0a9ad1d66421aa3828223d8b2e9c8b45020400630803000100c91f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000823801000000000000
Verfied tx: 0x8d0284005400e2f7f5669b26998d8e4d3c1a2c8a2d0a9af827ca54a1cc3509105035c32e01286f7090ae34a1e3b8827ef9c035ede86a2b3e5c16bb6df072541327c7797d07e5934e245ae7c9ce199b2212fe559ff2df0a9ad1d66421aa3828223d8b2e9c8b45020400630803000100c91f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000823801000000000000
```

Copy the verified tx and curl it to the broadcast api:

```shell
curl -X POST -H "Content-Type: application/json" -d '{
  "chain": "polkadot",
  "tx": "0x8d0284005400e2f7f5669b26998d8e4d3c1a2c8a2d0a9af827ca54a1cc3509105035c32e01286f7090ae34a1e3b8827ef9c035ede86a2b3e5c16bb6df072541327c7797d07e5934e245ae7c9ce199b2212fe559ff2df0a9ad1d66421aa3828223d8b2e9c8b45020400630803000100c91f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000823801000000000000"
}' http://127.0.0.1:8080/broadcast
```

Result:  
`{"status":"broadcasted","hash":"0xf9b86cd2121c25685b5bbf9efffc5f6c81e7d3b568811860de36dccb09837d2b"}`


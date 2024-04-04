# Api tests


### Build:
```shell
$ git clone https://github.com/XcmSend/api
$ cd api/
$ npm run buildme 
```


### Run tests:
```shell
$ npm run test

> xcmsend-api@1.0.0 test
> ts-node src/api/tests.ts

running api tests
starting connection test
trying to connect to Polkadot
Polkadot connection ok
trying to connect to HydraDX
HydraDX connection ok
trying to connect to Assethub
Assethub connection ok
connection test passed
Testing transaction routing
Checking polkadot > hydradx
route_tx start
polkadot:hydradx
handleTransfer for Polkadot to HydraDx...
cant connect
connect
drafting dot to hydradx
polkadot > hydradx ok
Checking hydradx > assethub
route_tx start
hydradx:assethub
handleTransfer for HydraDx to AssetHub...
hydradx > assethub ok
Checking polkadot > assethub
route_tx start
polkadot:assethub
handleTransfer for Polkadot to AssetHub...
polkadot > assethub ok
Checking hydradx > polkadot
route_tx start
hydradx:polkadot
handleTransfer for HydraDx to Polkadot...
hydradx > polkadot ok
Checking assethub > polkadot
route_tx start
assethub:polkadot
handleTransfer for AssetHub to Polkadot...
assethub > polkadot ok
Checking assethub > hydradx
route_tx start
assethub:hydradx
handleTransfer for AssetHub to HydraDx...
[assethub_to_hydra]
assethub > hydradx ok
transaction routing ok
testing hrmp channels
Checking HydraDX <> Assethub channels
hrmp channel test passed
broadcast_transaction start
generating tx..
route_tx start
polkadot:hydradx
handleTransfer for Polkadot to HydraDx...
cant connect
connect
drafting dot to hydradx
rawtx: 0xf404630803000100c91f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000823801000000000000
Signature:  0x8d028400e229015b7907e059f566953b5970aac27c17521c59f32a972ba7204a29746d250152844175a0a3cbb8b14ba99c3ee5ffd3de1b7c11198c87c7dfb77ede9a20e173630a4e5c4840470a8ffd2583bc0b3148a6944446a61234f7488e9d7f662e6e8745000000630803000100c91f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000823801000000000000
Verfied tx: 0x8d028400e229015b7907e059f566953b5970aac27c17521c59f32a972ba7204a29746d250152844175a0a3cbb8b14ba99c3ee5ffd3de1b7c11198c87c7dfb77ede9a20e173630a4e5c4840470a8ffd2583bc0b3148a6944446a61234f7488e9d7f662e6e8745000000630803000100c91f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000823801000000000000
broadcast_transaction done
api tests finished
```


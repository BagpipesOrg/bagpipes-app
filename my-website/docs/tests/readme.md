# Testing Guide


XCMSend comes prepackaged with test that dry run the functionality. 


## Run tests:  
```shell
$ git clone https://github.com/XcmSend/app.git  
$ cd app/
$ npm install
$ npm run test
```

```shell
> @bagpipes/xcm-send@0.0.3 test
> npx tsx src/run_tests.ts

Running tests
Running Balance tests
Testing assethub balance
assethub balance ok
Checking polkadot balance checks
polkadot native balance check ok
Testing Hydradx asset balance
Hydradx asset balance ok
running transaction tests
[test] Polkadot transfers
Polkadot DOT > assethub OK
Polkadot DOT > hydradx OK
[test] AssetHub transfers
Assethub > hydradx ok
[test] assethub > polkadot
Assethub > Polkadot ok
[test] HydraDx transfers
Hydradx > assethub ok
[test] Hydradx > polkadot
Hydradx > polkadot ok
testing interlay
assethub > interlay
[assethub2interlay]:  0xe64afe6914886cdcfea8da5f13e1e21aa11876cfe7fdde9299bbcdbbdc3a8b19
0x0901041f0803010100c11f0300010100e64afe6914886cdcfea8da5f13e1e21aa11876cfe7fdde9299bbcdbbdc3a8b190304000002043205011f000208af2f0000000000
assethub > interlay ok
interlay > assethub
0x84045e0001c007000000c2eb0b00000000000000000000000003000200a10f000000
interlay > assethub ok
all transaction tests are constructed ok!
Checking XCM channels
Checking open hrmp channels
assethub has open channels
checking hydradx channels
hydradx has open channels
test completed
```

##### The tests will check:   
 -  drafting transactions and checking that they are encoded in the right way    
 -  checking if each chain returns correct asset and native balance    



### Broadcast transactions:  
Edit the `src/tests/run_tests` and set your seed in the `get_test_account` function.  


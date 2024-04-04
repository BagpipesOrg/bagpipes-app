# HydraDx swap

You can swap one asset for another using HydraDx's omnipool DEX.   


### Supported pools:    
- [x] Omnipool   
- [x] XYK   
- [x] LBP 
- [x] Stable  

Swaps are supported from HydraDX to HydraDX. We use HydraDx's SDK to generate the best swap route for your swap.  


## How to: 
Drag in one action node, a source chain and a destination chain:  
![](/img/swap0.png) 


**Note:** You can expand your workflow and drag in more xcm actions from other chains. 
 
Select the asset you want to swap and set the source destination. After that, press draft and Bagpipes will generate the extrinsics.  
![](/img/swap1.png)   



If all looks good, we want to press approve, sign it with our browser wallet and broadcast it to the chain!  
![](/img/swap2.png)   

Use a block explorer as [hydradx.subscan.io](https://hydradx.subscan.io/) to check if the transaction was successful.   

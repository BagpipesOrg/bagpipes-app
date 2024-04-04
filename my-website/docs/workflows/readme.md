# Basic workflow  

XCMSend allows you to easily create transactions flows of sending assets accross the polkadot connected chains and swapping them for other assets.  

Lets create a workflow!  

Tips:   
In order to quickly delete a node you can press the node with your mouse and press backspace in order to easily delete it. 

### Intro:  
![First page](/img/0.png)  
If we start XCMSend for the first time you will be prompted by the welcome screen.  

### Select wallet:  
![Select wallet](/img/1.png)   
We want to select a browser wallet that we have on the browser we are using. For this example I'm gonna select polkadot.js browser extension.   

### Create scenario:  
![](/img/2.png)   
Once we have selected a wallet, we want to create are first scenario.

### Lab:  
![](/img/3.png)   
This is our whiteboard and lab enviroment, here you can build your workflows.

### Chain node:  
![](/img/4.png)  
We want to add a source chain to our workflow as a first piece.  

### Add first chain:  
![](/img/5.png)   
Drag in the chain box and select which chain you want to use.  

### Add Action:  
![](/img/6.png)   
Every work flow consists of a source chain, an action and a destination chain. Lets add another chain and then an action inbetween them. For this example we are going to use xTransfer.  

### First xtransfer:  
![](/img/7.png)   
Select either swap or xTransfer, in this example we want to send an asset from the source to the destination chain.   

 
### Select asset from source chain:  
![](/img/8.png)   
Select which onchain asset you want to send tto the destination chain from the first source chain node.   

 
### Add another action to continue to flow:  
![](/img/9.png)   


![](/img/10.png)   

Congratulations! You have created your first part, you can drag in more boxes and continue to develop your application flow.  




### Add a swap:  
![](/img/12.png)   
We are now familiar with creating cross chain transfers with xtransfers we can add a swap. Select asset you want to swap from the first chain box, and the destination asset you want to get on the destination node.
**Note:**  We currently only supports dex interaction with HydraDx's omnipool. Meaning that swaps are only possible from HydraDx to Hydradx. If you want to continue the transaction flow, you can simply drag in a xtransfer action and send the asset to another chain.   


### Head back to /lab
![](/img/13.png)   

Congratulations! You have created your first scenario. All scenarios you create are stored in a browser cookie and you can return to the `/lab` section to view and edit them.  

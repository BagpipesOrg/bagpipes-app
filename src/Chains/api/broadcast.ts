

// broadcast.ts

import { ApiPromise } from '@polkadot/api';
import connectToWsEndpoint from "./connect";
import { CHAIN_METADATA } from './metadata';
import toast from 'react-hot-toast';

/**
 * Broadcast a signed extrinsic to the chain.
 * 
 * @param {string} chain - The name of the chain (e.g. 'polkadot').
 * @param {any} signedExtrinsic - The signed extrinsic to broadcast.
 */
export async function broadcastToChain(chain: string, signedExtrinsic: any): Promise<void> {
    let api: ApiPromise;
    // Start a loading toast and keep the ID to update it later
    const toastId = toast.loading('Broadcasting transaction...');
  
    try {
      api = await connectToWsEndpoint(chain);
    } catch (error) {
      toast.error("Failed to connect to the endpoint. Please ensure you're connected and try again.");
      throw error;
    }
  
    return new Promise<void>((resolve, reject) => {
      signedExtrinsic.send(({ status, events, dispatchError }) => {
        if (dispatchError) {
          toast.error(`Transaction error: ${dispatchError.toString()}`, { id: toastId });
          reject(dispatchError);
        } else if (status.isInBlock) {
            console.log(`Transaction included at blockHash ${status.asInBlock}`);
          toast.success(`Transaction included at blockHash ${status.asInBlock}`, { id: toastId });
        } else if (status.isFinalized) {
          toast.success(`Transaction finalized at blockHash ${status.asFinalized}`, { id: toastId });
          console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
          console.log(`Transaction finalized, events: ${events}`);
          resolve();
        } else if (status.isDropped || status.isInvalid || status.isUsurped) {
          toast.error(`Transaction failed: ${status.type}`, { id: toastId });
          reject(new Error(status.type));
        }
      }).catch((error: { message: any; toString: () => any; }) => {
        toast.error(`Error broadcasting transaction: ${error.message || error.toString()}`, { id: toastId });
        reject(error);
      });
    }).then(() => {
        toast.success(`Transaction finalized at blockHash`, { id: toastId });
      // You might want to update or close the toast on successful resolution.
    }).catch((error) => {
        toast.error(`Error broadcasting transaction from chain${chain}`, error.message || error.toString());
      // Error handling if needed after the rejection.
    });
  }
  

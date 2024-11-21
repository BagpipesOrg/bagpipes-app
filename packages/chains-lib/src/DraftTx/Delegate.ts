import { getApiInstance } from "../api/connect";
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ChainKey } from "../ChainsInfo/metadata";

export type Transaction = SubmittableExtrinsic<'promise'>;


export interface DelegateParams {
    toAddress: string;
    amount: number;
    conviction: Conviction;
  }

  export enum Conviction {
    None = 0,
    Locked1x = 1,
    Locked2x = 2,
    Locked3x = 3,
    Locked4x = 4,
    Locked5x = 5,
    Locked6x = 6,
  }
  

/*
tracks:
[0] Root
[1] Whitelisted Caller
[2] Wish For Change
[10] Staking Admin
[11] Treasurer
[12] Lease Admin
[13] Fellowship Admin
[14] General Admin
[15] Auction Admin
[20] Referendum Canceller
[21] Referendum Killer
[30] Small Tipper
[31] Big Tipper
[32] Small Spender
[33] Medium Spender
[34] Big Spender
*/
/**
 * Delegates tokens to a specified address on the Polkadot network.
 *
 * @param params - The delegation parameters.
 * @returns A SubmittableExtrinsic transaction ready to be sent.
 */
export async function delegatePolkadot(
    params: DelegateParams
  ): Promise<Transaction> {
    const { toAddress, amount, conviction } = params;
    
    // Define the tracks you want to delegate to
    const tracks: number[] = [0, 1, 2, 10, 11, 12, 13, 14, 15, 20, 21, 30, 31, 32, 33, 34];
    
    // Convert conviction to lock type if necessary
    const realConviction = number2lock(conviction);
    
    // Initialize the API instance with an AbortController
    const controller = new AbortController();
    const signal = controller.signal;
    
    let api: ApiPromise;
    
    try {
      api = await getApiInstance(ChainKey.Polkadot, signal);
    } catch (error) {
      console.error('Failed to connect to Polkadot API:', error);
      throw new Error('API connection failed');
    }
    
    // Check for outstanding votes before proceeding
    const hasOutstandingVotes = await checkOutstandingVotes(api);
    
    if (!hasOutstandingVotes) {
      console.warn('No outstanding votes found. Delegation aborted.');
      throw new Error('No outstanding votes to delegate');
    }
    
    // Prepare the list of delegation calls
    const callList = tracks.map((track) =>
      api.tx.convictionVoting.delegate(
        track.toString(),
        { Id: toAddress },
        realConviction,
        amount
      )
    );
    
    // Batch all delegation calls into a single transaction
    const finalTx = api.tx.utility.batchAll(callList);
    
    return finalTx;
  }
  

  export function number2lock(inputen: number) {
    var lockperiod: string | null = "Locked1x";
    switch (inputen) {
      case 0:
        lockperiod = null;
      case 1:
        lockperiod = "Locked1x";
      case 2:
        lockperiod = "Locked2x";
      case 3:
        lockperiod = "Locked3x";
      case 4:
        lockperiod = "Locked4x";
      case 5:
        lockperiod = "Locked5x";
      case 6:
        lockperiod = "Locked6x";
    }
    return lockperiod;
  }



  /**
 * Checks if the current account has any outstanding votes.
 *
 * @param api - The Polkadot API instance.
 * @returns A boolean indicating if there are outstanding votes.
 */
export async function checkOutstandingVotes(api: ApiPromise): Promise<boolean> {
    try {
      const [votes, delegations] = await Promise.all([
        api.query.convictionVoting.votes(),
        api.query.convictionVoting.delegations(),
      ]);
      

    // the below shows that the votes and delegations are not empty, and thus the function will return true
      const hasVotes = !votes.isEmpty;
      const hasDelegations = !delegations.isEmpty;
      
      return hasVotes || hasDelegations;
    } catch (error) {
      console.error('Error checking outstanding votes:', error);
      // Decide whether to default to allowing delegation or not
      return false;
    }
  }
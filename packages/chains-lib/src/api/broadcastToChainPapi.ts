// broadcast.ts

import { PolkadotClient } from "polkadot-api";
import { getClient } from "./getClient";
import { ChainKey } from "../ChainsInfo/metadata";
import toast from "react-hot-toast";
import { HexString } from "polkadot-api/types";
import { InvalidTxError } from "polkadot-api";

interface BroadcastCallbacks {
  onInBlock?: (blockHash: string) => void;
  onFinalized?: (blockHash: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Broadcast a signed extrinsic (SCALE-encoded as a HexString) to the chain.
 *
 * @param {ChainKey} chain - The name of the chain (e.g. 'polkadot').
 * @param {HexString} signedExtrinsic - The signed SCALE-encoded extrinsic to broadcast.
 * @param {BroadcastCallbacks} callbacks - Optional callbacks for events.
 */
export async function broadcastToChain(
  chain: ChainKey,
  signedExtrinsic: HexString,
  { onInBlock, onFinalized, onError }: BroadcastCallbacks = {}
): Promise<void> {
  console.log(`broadcasting to ${chain}`);

  let client: PolkadotClient;
  try {
    client = await getClient(chain);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    onError?.(new Error(`Failed to connect to the endpoint: ${errorMessage}`));
    return;
  }

  // Using submitAndWatch will return an Observable of TxBroadcastEvent
  // We'll convert it to a promise that resolves when finalized or rejects on error
  return new Promise<void>((resolve, reject) => {
    const subscription = client
      .submitAndWatch(signedExtrinsic)
      .subscribe({
        next: (event) => {
          switch (event.type) {
            case "broadcasted":
              console.log(`Transaction broadcasted with hash ${event.txHash}`);
              // This is optional: it's just a signal that the tx is out in the network.
              break;

            case "txBestBlocksState":
              // This event fires every time the transaction is found or not found in a best block.
              // If `found:true`, the transaction is included in a best block (similar to "in block" in old API).
              if (event.found) {
                console.log(
                  `Transaction included in block ${event.block.hash} (not finalized yet).`
                );
                onInBlock?.(event.block.hash);
              }
              break;

            case "finalized":
              // The transaction is included in a finalized block
              console.log(
                `Transaction finalized at blockHash ${event.block.hash}`
              );
              // Check if it was successful:
              if (!event.ok) {
                const errMsg = `Transaction failed on-chain: ${event.dispatchError?.type ?? "Unknown error"}`;
                console.log(errMsg);
                onError?.(new Error(errMsg));
                subscription.unsubscribe();
                reject(new Error(errMsg));
                return;
              }
              onFinalized?.(event.block.hash);
              subscription.unsubscribe();
              resolve();
              break;

            default:
              // Other cases should not happen, but let's log them for completeness
              console.log(`Unknown event type: ${(event as any).type}`);
              break;
          }
        },
        error: (err: unknown) => {
          let errorMessage = "Unknown error broadcasting transaction.";
          if (err instanceof InvalidTxError) {
            // Transaction is invalid at runtime
            errorMessage = `Invalid transaction: ${JSON.stringify(err.error)}`;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          console.error(`Transaction error: ${errorMessage}`);
          onError?.(new Error(errorMessage));
          subscription.unsubscribe();
          reject(new Error(errorMessage));
        },
        complete: () => {
          // The subscription completes if the transaction is finalized successfully.
          // We've already handled that case in "finalized" event.
        },
      });
  });
}

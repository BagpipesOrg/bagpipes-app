import { ApiPromise, WsProvider } from "@polkadot/api";
import { CHAIN_METADATA, ChainMetadata, ChainKey } from "../ChainsInfo/metadata";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import toast from "react-hot-toast";

// Store the API connections in a global map
const apiConnections = new Map<string, ApiPromise>();
// Constant to set max reconnection attempts
const MAX_RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_TIMEOUT = 5000; // milliseconds

export async function getApiInstance(chain: ChainKey, signal?: AbortSignal | undefined): Promise<ApiPromise> {
  console.log("getApiInstance chain", chain);

  if (signal?.aborted) {
    throw new Error("Operation aborted before initiation.");
  }


  if (apiConnections.has(chain)) {
    const api = apiConnections.get(chain);
    if (api && api.isConnected) {
      return api;
    } else {
      console.log(`Connection to ${chain} lost. Attempting to reconnect...`);
      // Attempt to reconnect a few times
      for (let i = 0; i < 3; i++) {
        try {
          if (api) {
            await api.connect();
            console.log(`Reconnected to ${chain} successfully.`);
            return api;
          }
        } catch (error) {
          console.error(
            `Attempt ${i + 1} failed to reconnect to ${chain}:`,
            error
          );
        }
      }
      apiConnections.delete(chain); // Cleanup after failed reconnection attempts
      throw new Error(
        `Failed to reconnect to ${chain} after several attempts.`
      );
    }
  }

  const controller = new AbortController();
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }


  // Establish a new connection if we don't have one already
  console.log(`Establishing new connection to ${chain}...`);
  const api = await connectToWsEndpoint(chain, controller.signal);
  apiConnections.set(chain, api);
  console.log(`api connections.`, apiConnections);
  return api;
}

export async function connectToWsEndpoint(chain: ChainKey, signal: AbortSignal): Promise<ApiPromise> {
  console.log("connectToWsEndpoint connection chain", chain);
  await cryptoWaitReady();

  const metadata: ChainMetadata = CHAIN_METADATA[chain as ChainKey];
  if (!metadata || !metadata.endpoints || metadata.endpoints.length === 0) {
    toast.error(`No endpoints found for chain: ${chain}`);
    throw new Error(`No endpoints found for chain: ${chain}`);
  }

  let lastError: any;
  for (const endpoint of metadata.endpoints) {

    try {
      console.log("Attempting to connect to endpoint", endpoint);
      const provider = new WsProvider(endpoint);
      const api = await ApiPromise.create({ provider });
      console.log("api promise connect", api);
      await api.isReady;

      api.on("disconnected", async () => {
        console.log(
          `Disconnected from ${endpoint}. Attempting to reconnect...`
        );
        apiConnections.delete(chain); // Delete the existing connection instance

        // Try to create a new connection
        try {
          const controller = new AbortController();
          const newApi = await connectToWsEndpoint(chain, controller.signal);
          apiConnections.set(chain, newApi);
          console.log(`api connections.`, apiConnections);
          console.log(`Reconnected to ${chain} successfully.`);
        } catch (reconnectError) {
          console.error(`Failed to reconnect to ${chain}:`, reconnectError);
        }
      });

      apiConnections.set(chain, api);
      console.log("Connected to endpoint", endpoint);
      return api;
    } catch (error) {
      lastError = error;
      console.error(`Failed to connect to endpoint ${endpoint}:`, error);

      if (error instanceof Error && error.message.includes("Insufficient resources")) {
        toast.error(`Endpoint ${endpoint} has insufficient resources.`);
      } else if (error instanceof Error && error.message.includes("abnormal closure")) {
        toast.error(`Endpoint ${endpoint} closed the connection abnormally.`);
      } else {
        toast.error(
          `Failed to connect to endpoint ${endpoint}. Trying next...`
        );
      }
    }
  }

  toast.error(
    "All endpoints failed. Please check your connection and try again."
  );
  throw lastError;
}

import { createClient, PolkadotClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/node";
import { CHAIN_METADATA, ChainMetadata, ChainKey } from "../ChainsInfo/metadata";
import toast from "react-hot-toast";

// Store the API connections in a global map
const apiConnections = new Map<string, PolkadotClient>();

const MAX_RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_TIMEOUT = 5000; // milliseconds

export async function getApiInstancePapi(
  chain: ChainKey,
  signal?: AbortSignal | undefined
): Promise<PolkadotClient> {
  console.log("getApiInstance chain", chain);

  if (signal?.aborted) {
    throw new Error("Operation aborted before initiation.");
  }

  if (apiConnections.has(chain)) {
    const client = apiConnections.get(chain);
    // PolkadotClient doesn't expose isConnected or similar; it's a stable client.
    // If we trust the client is still good, just return it.
    if (client) {
      return client;
    } else {
      console.log(`No valid client instance found for ${chain}. Attempting to reconnect...`);
      // Attempt to reconnect if needed
      for (let i = 0; i < MAX_RECONNECTION_ATTEMPTS; i++) {
        try {
          // Since PolkadotClient doesn't have a connect method, we'll just re-create it.
          const controller = new AbortController();
          if (signal) {
            signal.addEventListener('abort', () => controller.abort());
          }
          const newClient = await connectToWsEndpointPapi(chain, controller.signal);
          apiConnections.set(chain, newClient);
          console.log(`Reconnected to ${chain} successfully.`);
          return newClient;
        } catch (error) {
          console.error(`Attempt ${i + 1} failed to reconnect to ${chain}:`, error);
        }
      }
      apiConnections.delete(chain); 
      throw new Error(`Failed to reconnect to ${chain} after several attempts.`);
    }
  }

  const controller = new AbortController();
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  // Establish a new connection if we don't have one already
  console.log(`Establishing new connection to ${chain}...`);
  const client = await connectToWsEndpointPapi(chain, controller.signal);
  apiConnections.set(chain, client);
  console.log(`api connections.`, apiConnections);
  return client;
}

export async function connectToWsEndpointPapi(
  chain: ChainKey,
  signal: AbortSignal
): Promise<PolkadotClient> {
  console.log("connectToWsEndpoint connection chain", chain);

  const metadata: ChainMetadata = CHAIN_METADATA[chain as ChainKey];
  if (!metadata || !metadata.endpoints || metadata.endpoints.length === 0) {
    toast.error(`No endpoints found for chain: ${chain}`);
    throw new Error(`No endpoints found for chain: ${chain}`);
  }

  let lastError: any;
  for (const endpoint of metadata.endpoints) {
    try {
      console.log("Attempting to connect to endpoint", endpoint);
      const provider = getWsProvider(endpoint);
      const client = createClient(provider);

      apiConnections.set(chain, client);
      console.log("Connected to endpoint", endpoint);
      return client;
    } catch (error) {
      lastError = error;
      console.error(`Failed to connect to endpoint ${endpoint}:`, error);

      if (error instanceof Error && error.message.includes("Insufficient resources")) {
        toast.error(`Endpoint ${endpoint} has insufficient resources.`);
      } else if (error instanceof Error && error.message.includes("abnormal closure")) {
        toast.error(`Endpoint ${endpoint} closed the connection abnormally.`);
      } else {
        toast.error(`Failed to connect to endpoint ${endpoint}. Trying next...`);
      }
    }
  }

  toast.error(
    "All endpoints failed. Please check your connection and try again."
  );
  throw lastError;
}

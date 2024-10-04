//ts-nocheck
import { getApiInstance } from "./connect";
import { ChainKey } from "./metadata";

const getNonce = (chainEndpoint: string, address: string) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const controller = new AbortController();
      const signal = controller.signal;
      const api = await getApiInstance(chainEndpoint as ChainKey, signal);
      const { nonce } = (await api.query.system.account(address)) as any;
      console.log("nonce in getNonce", nonce);
      resolve(nonce.toNumber());
      console.log("nonce", nonce.toNumber());
    } catch (error) {
      reject(error);
    }
  });
};

export default getNonce;

import { decodeAddress } from '@polkadot/util-crypto';

export function getRawAddress(ss58Address: string): Uint8Array {
  console.log(`getRawAddress: `, ss58Address);
  try {
    return decodeAddress(ss58Address);
  } catch (e) {
    throw new Error("Invalid SS58 address format.");
  }
}
import { ApiPromise, WsProvider } from '@polkadot/api';
import { TradeRouter, CachingPoolService, PoolType } from '@galacticcouncil/sdk';

import connectToWsEndpoint from './connect';
import endpoints from './WsEndpoints';

let tradeRouter;

async function initializeTradeRouter() {
  const api = await connectToWsEndpoint(endpoints.polkadot.hydraDx);

  console.log(`getHydraDx Initializing PoolService...`);
  const poolService = new CachingPoolService(api);

  console.log(`getHydraDx Initializing TradeRouter...`);
  tradeRouter = await new TradeRouter(poolService, { includeOnly: [PoolType.Omni] });
// console.log(`getHydraDx TradeRouter:`, tradeRouter);

  const result = await tradeRouter.getAllAssets();
console.log(`getHydraDx All assets:`, result);
}

export async function getHydraDxSpotPrice(assetIn: string, assetOut: string) {
  if (!tradeRouter) {
    await initializeTradeRouter();
  }
  const spotPrice = await tradeRouter.getBestSpotPrice(assetIn, assetOut);
  console.log(`getHydraDx Spot price for ${assetIn} to ${assetOut}: ${JSON.stringify(spotPrice, null, 2)}`);

  return spotPrice.toString();
}

export async function getHydraDxSellPrice(assetIn: string, assetOut: string, amount: number) {
  if (!tradeRouter) {
    console.log(`getHydraDx Initializing TradeRouter in teh getHydraDxSell function...`);
    await initializeTradeRouter();
  }

  console.log(`getHydraDx Getting selling details...`);

  const tradeDetails = await tradeRouter.getBestSell(assetIn, assetOut, amount);
  console.log(`getHydraDx trade details:`, tradeDetails);

  return tradeDetails;
}

import { Connection } from "@solana/web3.js";
import fetch from "isomorphic-fetch";

import { Jupiter, RouteInfo, TOKEN_LIST_URL } from "@jup-ag/core";
import {
  ENV,
  INPUT_MINT_ADDRESS,
  USER_KEYPAIR,
  SOLANA_RPC_ENDPOINT,
  Token,
} from "./constants";

import {getAMMPools} from './pools';
import { calculateArbitrage } from "./calcArb";




const main = async () => {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT); // Setup Solana RPC connection
    const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json(); // Fetch token list from Jupiter API

    //  Load Jupiter


    // If you know which input/output pair you want
    const AMMPools = await getAMMPools();


    /*
    // Alternatively, find all possible outputToken based on your inputToken
    const possiblePairsTokenInfo = await getPossiblePairsTokenInfo({
      tokens,
      routeMap,
      inputToken,
    });

    console.log(possiblePairsTokenInfo)

    
    const routes = await getRoutes({
      jupiter,
      inputToken,
      outputToken,
      inputAmount: AMOUNT, // 1 unit in UI
      slippage: .1, // .1% slippage
    });

    const bestRoute = routes!.routesInfos[0];
    const profit = bestRoute.outAmountWithSlippage - bestRoute.inAmount;
    const fee = 500; // Tx fee in USDC = ~.000005 SOL
    console.log(bestRoute);
    console.log(`Pre tx profit: ${profit}`)

    // Percentage
    // Routes that are too good to be true usually are
    const percentage = profit / bestRoute.inAmount * 100;
    */
  } catch (error) {
    console.log({ error });
  }
};

main();

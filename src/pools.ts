import { Connection } from "@solana/web3.js";
import { getTokenCount } from "@orca-so/sdk";
import { Pool } from "./constants";
import {orcaPoolConfigs} from "./orcaPools";
import { CurveType } from "@orca-so/sdk/dist/model/orca/pool/pool-types";
import {u64} from "@solana/spl-token";
import { sec } from "mathjs";

export const getAMMPools = async () => {
    const AMMPools = new Map<string, Pool[]>();

    const connection = new Connection("https://api.mainnet-beta.solana.com", "singleGossip");
    
    const OrcaPools: Pool[] = [];
    let count = 0;

    for (let [poolAddr, poolParams] of Object.entries(orcaPoolConfigs)) {
        if (poolParams.curveType != CurveType.ConstantProduct) {
            // Our convex optimization is dependent on constant prod.
            continue;
        }

        const tokenA = poolParams.tokens[poolParams.tokenIds[0]];
        const tokenB = poolParams.tokens[poolParams.tokenIds[1]];
        count += 1;

        const tokenCount = await getTokenCount(connection, poolParams, tokenA, tokenB);

        const tokenAAmount = tokenCount['inputTokenCount'];
        const tokenBAmount = tokenCount['outputTokenCount'];

        const pool: Pool = {
            tokenA: tokenA.mint.toString(),
            tokenB: tokenB.mint.toString(),
            tokenAAmount,
            tokenBAmount
        }

        OrcaPools.push(pool);

        if (count == 20) {
            break;
        }
    }

    const raydiumPairs = await (await fetch("https://api.raydium.io/v2/main/pairs")).json();
    const raydiumNameToMint = (await (await fetch("https://sdk.raydium.io/token/raydium.mainnet.json")).json())["spl"];
    const RaydiumPools: Pool[] = [];

    for (let pair of raydiumPairs) {
        const name: string = pair["name"];
        const firstToken = name.split("-")[0];
        const secondToken = name.split("-")[1];

        if (!raydiumNameToMint[firstToken] || !raydiumNameToMint[secondToken]) {
            continue;
        }

        const tokenA = raydiumNameToMint[firstToken]["mint"];
        const tokenB = raydiumNameToMint[secondToken]["mint"];

        const tokenAAmount = new u64(pair["tokenAmountCoin"]);
        const tokenBAmount = new u64(pair["tokenAmountPc"]);

        const pool: Pool = {
            tokenA,
            tokenB,
            tokenAAmount,
            tokenBAmount
        }

        RaydiumPools.push(pool);

    }

    console.log(JSON.stringify(RaydiumPools));

    AMMPools.set('Orca', OrcaPools);
    AMMPools.set('Raydium', RaydiumPools);

    return AMMPools; 
};
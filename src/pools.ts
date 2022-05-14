import { Connection, PublicKey } from "@solana/web3.js";
import { getTokenCount, U64Utils, deserializeAccount } from "@orca-so/sdk";
import { Pool } from "./constants";
import { orcaPoolConfigs } from "./orcaPools";
import { CurveType } from "@orca-so/sdk/dist/model/orca/pool/pool-types";
import { u64 } from "@solana/spl-token";
import { sec } from "mathjs";
import { isAssertClause } from "typescript";

export const getAMMPools = async () => {
    const AMMPools = new Map<string, Pool[]>();

    const connection = new Connection("https://solana-api.projectserum.com");

    const OrcaPools: Pool[] = [];
    const OrcaPoolTokenAddrs: PublicKey[] = [];

    let count = 0;
    for (let [poolAddr, poolParams] of Object.entries(orcaPoolConfigs)) {
        count += 1;
        if (count >= 50) {
            break;
        }

        if (poolParams.curveType != CurveType.ConstantProduct) {
            // Our convex optimization is dependent on constant prod.
            continue;
        }

        const tokenA = poolParams.tokens[poolParams.tokenIds[0]];
        const tokenB = poolParams.tokens[poolParams.tokenIds[1]];

        OrcaPoolTokenAddrs.push(tokenA.addr);
        OrcaPoolTokenAddrs.push(tokenB.addr);

        const pool: Pool = {
            tokenA: tokenA.mint.toString(),
            tokenB: tokenB.mint.toString(),
            tokenAAmount: new u64(0),
            tokenBAmount: new u64(0)
        }

        OrcaPools.push(pool);
    }

    const account_infos = await connection.getMultipleAccountsInfo(OrcaPoolTokenAddrs);
    const token_accounts = account_infos.map((info) =>
        info != undefined ? deserializeAccount(<Buffer>info.data) : undefined
    );

    for (let i = 0; i < token_accounts.length; i += 2) {
        const tokenAAmount = token_accounts.at(i)?.amount;
        const tokenBAmount = token_accounts.at(i + 1)?.amount;

        const altIndex = i / 2;
        let tokenPool = OrcaPools.at(altIndex);

        if (tokenAAmount == null || tokenBAmount == null) {
            throw new Error("Could not retrieve token amount");
        }

        if (tokenPool == null) {
            throw new Error("Token pool is null");
        }

        tokenPool = {
            tokenA: tokenPool.tokenA,
            tokenB: tokenPool.tokenB,
            tokenAAmount,
            tokenBAmount
        }

        OrcaPools[altIndex] = tokenPool;
    }

    AMMPools.set('Orca', OrcaPools);
    /*

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

    AMMPools.set('Raydium', RaydiumPools);
    */

    console.log(JSON.stringify(OrcaPools));
    return AMMPools;
};
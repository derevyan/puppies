import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig, getTokenCount, getTokens } from "@orca-so/sdk";
import { TokenListProvider, TokenInfo, CDNTokenListResolutionStrategy } from "@solana/spl-token-registry";
import Decimal from "decimal.js";
import { WALLET_PRIVATE_KEY, SOLANA_RPC_ENDPOINT, Pool } from "./constants";
import { isConstructorDeclaration } from "typescript";

export const getAMMPools = async () => {
    const AMMPools = new Map<string, Pool[]>();

    const orcaPoolsJson = await (await fetch('https://api.orca.so/allPools')).json();
    const raydiumPoolsJson = await (await fetch('https://api.raydium.io/v2/main/pairs')).json();
    
    const OrcaPools: Pool[] = [];
    for (let pair in orcaPoolsJson) {
        const poolInfo = orcaPoolsJson[pair];
        let fixedName = pair.replace('\[aquafarm\]', '');
        fixedName = fixedName.replace('\[stable\]', '');
        
        const tokenA = fixedName.split('/')[0];
        const tokenB = fixedName.split('/')[1];

        const tokenAAmount = poolInfo['tokenAAmount'];
        const tokenBAmount = poolInfo['tokenBAmount'];

        const pool: Pool = {
            tokenA,
            tokenB,
            tokenAAmount,
            tokenBAmount
        }

        OrcaPools.push(pool);
    }

    const RaydiumPools: Pool[] = [];
    for (let poolInfo of raydiumPoolsJson) {
        const name = poolInfo['name'];
        
        const tokenA = name.split('-')[0];
        const tokenB = name.split('-')[1];

        if (tokenA == 'unknown' || tokenB == 'unknown') {
            continue;
        }

        const tokenAAmount = poolInfo['tokenAmountCoin'];
        const tokenBAmount = poolInfo['tokenAmountPc'];

        const pool: Pool = {
            tokenA,
            tokenB,
            tokenAAmount,
            tokenBAmount
        }

        RaydiumPools.push(pool);
    }

    AMMPools.set('Orca', OrcaPools);
    AMMPools.set('Raydium', RaydiumPools);
    
    return AMMPools; 
};
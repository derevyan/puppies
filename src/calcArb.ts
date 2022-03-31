import { Pool } from './constants';
import { matrix } from 'mathjs';

export const calculateArbitrage = async (AMMPools: Map<string, Pool[]>) => {
    const AMMTokens = [];
    const allTokens = new Set();

    for (const [AMM, pools] of AMMPools.entries()) {
        const tokens = new Set();
        for (const pool of pools) {
            tokens.add(pool.tokenA);
            tokens.add(pool.tokenB);

            allTokens.add(pool.tokenA);
            allTokens.add(pool.tokenB);
        }

        AMMTokens.push(tokens);
    }

    // Turn sets into lists (assigning each token an index within an AMM)
    const AMMIndices = [];
    for (const tokens of AMMTokens) {
        AMMIndices.push(Array.from(tokens));
    }

    // Create a global list of tokens where each token's global index is their position in this list
    const globalIndices = Array.from(allTokens);

    // Create local indices of tokens for each AMM
    const localIndices = [];
    for (const AMM of AMMIndices) {
        const localIndexMatrix = [];
        for (const index in globalIndices) {
            const row = [];
            const token = globalIndices[index];
            for (const localIndex in AMM) {
                if (AMM[localIndex] == token) {
                    row.push(1)
                } else {
                    row.push(0)
                }
            }

            localIndexMatrix.push(row);
        }

        localIndices.push(localIndexMatrix);
    }

    console.log(JSON.stringify(localIndices));
}
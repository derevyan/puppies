import {Pool, RESERVE_TOKENS, MAX_LENGTH_PATH, PathStep} from './constants';

export const makePaths = (pairs: Pool[]) => {
    const adjacencyList = new Map<string, Set<Pool>>();

    for (const pair of pairs) {
        const tokenA = pair.tokenA;
        const tokenB = pair.tokenB;

        if (adjacencyList.has(tokenA)){
            adjacencyList.get(tokenA)?.add(pair);
        } else {
            adjacencyList.set(tokenA, new Set([pair]));
        }

        if (adjacencyList.has(tokenB)){
            adjacencyList.get(tokenB)?.add(pair);
        } else {
            adjacencyList.set(tokenB, new Set([pair]));
        }
    }

    let paths: PathStep[][][] = [];

    for (const reserveToken of RESERVE_TOKENS) {
        const firstPairs = adjacencyList.get(reserveToken);
        if (!firstPairs) {
            continue;
        }

        const steps = [];

        for (const pool of firstPairs) {
            const tokenA = pool.tokenA;
            const tokenB = pool.tokenB;

            let tokenIn = tokenB;
            let tokenOut = tokenA;
            let reserveIn = pool.tokenBAmount;
            let reserveOut = pool.tokenAAmount;

            if (reserveToken == tokenA) {
                tokenIn = tokenA;
                tokenOut = tokenB;
                reserveIn = pool.tokenAAmount;
                reserveOut = pool.tokenBAmount;
            }

            const pathStep: PathStep = {
                tokenIn,
                tokenOut,
                reserveIn,
                reserveOut
            }

            steps.push([pathStep]);
        }

        paths.push(steps);
        
        for (let i = 0; i < MAX_LENGTH_PATH - 1; i++) {
            const lastPaths: PathStep[][] | undefined = paths.at(-1);
            if (!lastPaths) {
                break;
            }

            let lengthPaths: PathStep[][] = [];

            for (const path of lastPaths) {
                const step = path.at(-1);
                if (!step) {
                    continue;
                }

                const pools = adjacencyList.get(step.tokenOut);
                if (!pools) {
                    continue;
                }

                const newPaths: PathStep[][] = [];

                for (const pool of pools) {
                    const tokenA = pool.tokenA;
                    const tokenB = pool.tokenB;
        
                    let tokenIn = tokenB;
                    let tokenOut = tokenA;
                    let reserveIn = pool.tokenBAmount;
                    let reserveOut = pool.tokenAAmount;
        
                    if (step.tokenOut == tokenA) {
                        tokenIn = tokenA;
                        tokenOut = tokenB;
                        reserveIn = pool.tokenAAmount;
                        reserveOut = pool.tokenBAmount;
                    }
        
                    const pathStep: PathStep = {
                        tokenIn,
                        tokenOut,
                        reserveIn,
                        reserveOut
                    }
                    
                    const newPath = [...path];
                    newPath.push(pathStep);
                    newPaths.push(newPath);
                }

                lengthPaths = lengthPaths.concat(newPaths);
            }

            paths.push(lengthPaths);
        }
    }
    const actualPaths: PathStep[][] = [];

    for (const lengthPaths of paths) {
        for (const path of lengthPaths) {
            if (!path) {
                continue;
            }

            const lastStep = path.at(-1);
            if (!lastStep) {
                continue;
            }

            if (RESERVE_TOKENS.indexOf(lastStep.tokenOut) != -1) {
                actualPaths.push(path);
            }
        }
    }
    return actualPaths;
}
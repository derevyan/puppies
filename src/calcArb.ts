import { Pool } from './constants';
import { makePaths } from './makePaths';
import { fast_path_two_arb, fast_path_three_arb } from './pathArb';

export const calculateArbitrage = async (AMMPools: Map<string, Pool[]>) => {
    const pools = await AMMPools;
    const allPools = Array.from(pools.values()).flat();
    const paths = makePaths(allPools);

    const profitPaths = [];

    for (const path of paths) {
        let amt_in, profit, between_lp_amts;
        try {
        if (path.length == 2) {
            [amt_in, profit, between_lp_amts] = fast_path_two_arb(
                path[0].reserveIn.toNumber(),
                path[0].reserveOut.toNumber(),
                path[1].reserveIn.toNumber(),
                path[1].reserveOut.toNumber()
            );
        }

        else if (path.length == 3) {
            [amt_in, profit, between_lp_amts] = fast_path_three_arb(
                path[0].reserveIn.toNumber(),
                path[0].reserveOut.toNumber(),
                path[1].reserveIn.toNumber(),
                path[1].reserveOut.toNumber(),
                path[2].reserveIn.toNumber(),
                path[2].reserveOut.toNumber()
            );
        }

        if (!profit || !amt_in || !between_lp_amts) {
            continue;
        }

        const profitPct = profit / amt_in;

        if(profitPct > .1) {
            console.log(`Profit of ${profit} through route ${JSON.stringify(path)}, with amt in: ${amt_in}`);
            // TODO: verify that the paths are feasible (max input > output for all steps)

            profitPaths.push([path, profit, amt_in, between_lp_amts]);
        } 
        } catch(error) {
            console.log("Number too big");
        }
    }

    return profitPaths;
}
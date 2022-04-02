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
        if (path.length == 2) {
            [amt_in, profit, between_lp_amts] = fast_path_two_arb(
                path[0].reserveIn,
                path[0].reserveOut,
                path[1].reserveIn,
                path[1].reserveOut
            );
        } 
        /*
        else if (path.length == 3) {
            [amt_in, profit, between_lp_amts] = fast_path_three_arb(
                path[0].reserveIn,
                path[0].reserveOut,
                path[1].reserveIn,
                path[1].reserveOut,
                path[2].reserveIn,
                path[2].reserveOut
            );
        }
        */
        if(profit && profit > 0) {
            profitPaths.push([path, profit, amt_in, between_lp_amts]);
        } 
    }

    return profitPaths;
}
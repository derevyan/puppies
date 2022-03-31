export enum ConstantFunction {
    ConstantProduct = 'ConstantProduct'
}

export interface AMMInfo {
    name: string;
    function: ConstantFunction;
    fee: number;
}

 export const Saber: AMMInfo = {
    name: 'Saber',
    function: ConstantFunction['ConstantProduct'],
    fee: 0.3
 }

 export const Orca: AMMInfo = {
    name: 'Orca',
    function: ConstantFunction['ConstantProduct'],
    fee: 0.3
 }

 export const Raydium: AMMInfo = {
    name: 'Raydium',
    function: ConstantFunction['ConstantProduct'],
    fee: 0.25
 }
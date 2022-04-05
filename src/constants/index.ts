import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import './amms';
import { u64 } from "@solana/spl-token";
import {OrcaPoolToken} from "@orca-so/sdk";
import * as Tokens from "@orca-so/sdk/dist/constants/tokens";

require("dotenv").config();

// How much USD to trade
export const AMOUNT = 10;

// Endpoints, connection
export const ENV: Cluster = (process.env.CLUSTER as Cluster) || "mainnet-beta";

// Sometimes, your RPC endpoint may reject you if you spam too many RPC calls. Sometimes, your PRC server
// may have invalid cache and cause problems.
export const SOLANA_RPC_ENDPOINT =
  ENV === "devnet"
    ? "https://api.devnet.solana.com"
    : "https://solana-api.projectserum.com";

// Wallets
export const WALLET_PRIVATE_KEY =
  process.env.WALLET_PRIVATE_KEY || "PASTE YOUR WALLET PRIVATE KEY";
//export const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
export const USER_KEYPAIR = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(WALLET_PRIVATE_KEY)));

// Token Mints
export const INPUT_MINT_ADDRESS =
  ENV === "devnet"
    ? "So11111111111111111111111111111111111111112" // SOL
    : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
export const OUTPUT_MINT_ADDRESS =
  ENV === "devnet"
    ? "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt" // SRM
    : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDT


// Tokens we use as input and output
export const RESERVE_TOKENS = [Tokens.usdcToken.mint.toString()];
// Max amount of legs for our arb
export const MAX_LENGTH_PATH = 3;

// Interface
export interface Token {
  chainId: number; // 101,
  address: string; // '8f9s1sUmzUbVZMoMh6bufMueYH1u4BJSM57RCEvuVmFp',
  symbol: string; // 'TRUE',
  name: string; // 'TrueSight',
  decimals: number; // 9,
  logoURI: string; // 'https://i.ibb.co/pKTWrwP/true.jpg',
  tags: string[]; // [ 'utility-token', 'capital-token' ]
}

export interface Pool {
  tokenA: string;
  tokenB: string;
  tokenAAmount: u64;
  tokenBAmount: u64;
}

export interface PathStep {
  tokenIn: string;
  tokenOut: string;
  reserveIn: u64;
  reserveOut: u64;
}
import { Address } from 'viem';

/**
 * Supported chain names
 */
export type ChainName = 'optimism' | 'world';

/**
 * Dust token representation
 */
export interface DustToken {
  address: Address;
  symbol: string;
  decimals: number;
  balance: string; // Raw balance (wei)
  balanceFormatted: string; // Human-readable
  valueUsd: number; // Approx USD value
  chain: ChainName;
}

/**
 * Quote request to backend
 */
export interface QuoteRequest {
  tokenIn: Address;
  amount: string; // in wei
  srcChainId: number;
}

/**
 * Quote response from backend
 */
export interface QuoteResponse {
  oneInchData: string; // hex calldata
  pythUpdateData: string[]; // array of bytes
  estUsdcOut: string; // estimated USDC output (wei)
  estFeeUsd?: number; // optional fee estimate
}

/**
 * Transaction status
 */
export type TxStatus = 'idle' | 'approving' | 'swapping' | 'finalizing' | 'success' | 'error';

/**
 * Transaction step
 */
export interface TxStep {
  name: string;
  status: 'pending' | 'in_progress' | 'complete' | 'error';
  txHash?: string;
  explorerUrl?: string;
}

/**
 * Sweep transaction state
 */
export interface SweepState {
  status: TxStatus;
  steps: TxStep[];
  error?: string;
  finalUsdcAmount?: string;
}

/**
 * World ID verification state
 */
export interface WorldIDState {
  verified: boolean;
  proof?: string;
  nullifierHash?: string;
}

'use client';

import { useState, useEffect } from 'react';
import {
  fetchBalance,
  fetchQuote,
  checkAllowance,
  executeSweep,
  fetchReceipts,
  fetchStats,
  checkHealth,
  fetchContracts
} from '@/lib/api';

/**
 * Hook to fetch user's dust token balance
 */
export function useTokenBalance(address: string | undefined, tokenAddress: string) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !tokenAddress) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBalance(address, tokenAddress);
        setBalance(data.balance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address, tokenAddress]);

  return { balance, loading, error };
}

/**
 * Hook to get swap quote
 */
export function useSwapQuote(tokenIn: string, amount: string, chainId: string = '11155111') {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async () => {
    if (!tokenIn || !amount) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuote(tokenIn, amount, chainId);
      setQuote(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch quote';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { quote, loading, error, getQuote };
}

/**
 * Hook to check token allowance
 */
export function useAllowance(address: string | undefined, tokenAddress: string, spender?: string) {
  const [allowance, setAllowance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkApproval = async () => {
    if (!address || !tokenAddress) return;

    setLoading(true);
    setError(null);
    try {
      const data = await checkAllowance(address, tokenAddress, spender);
      setAllowance(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to check allowance';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { allowance, loading, error, checkApproval };
}

/**
 * Hook to execute sweep
 */
export function useSweep() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sweep = async (params: {
    userAddress: string;
    tokenIn: string;
    amount: string;
    oneInchData: string;
    minUsdcOut: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeSweep(params);
      setResult(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to execute sweep';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, sweep };
}

/**
 * Hook to fetch user receipts
 */
export function useReceipts(address: string | undefined) {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReceipts(address);
        setReceipts(data.receipts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch receipts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  return { receipts, loading, error };
}

/**
 * Hook to fetch protocol stats
 */
export function useStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStats();
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading, error };
}

/**
 * Hook to check backend health
 */
export function useBackendHealth() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealth(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Backend is unavailable';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { health, loading, error, check };
}

/**
 * Hook to fetch contracts
 */
export function useContracts() {
  const [contracts, setContracts] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchContracts();
        setContracts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { contracts, loading, error };
}

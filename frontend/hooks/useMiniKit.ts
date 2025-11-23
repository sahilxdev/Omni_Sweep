'use client';

import { useEffect, useState } from 'react';
import { MiniKit, ResponseEvent } from '@worldcoin/minikit-js';

export function useMiniKit() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const installed = MiniKit.isInstalled();
    setIsInstalled(installed);
    
    // Wallet address can be retrieved through user state or wallet commands
    // For now, we'll set it through MiniKit events when available
  }, []);

  const verify = async (action: string, signal?: string) => {
    if (!isInstalled) {
      throw new Error('MiniKit is not installed');
    }

    return MiniKit.commandsAsync.verify({
      action,
      signal: signal || '',
      verification_level: 'orb' as any,
    });
  };

  const sendTransaction = async (transaction: {
    to: string;
    value: string;
    data?: string;
  }) => {
    if (!isInstalled) {
      throw new Error('MiniKit is not installed');
    }

    return MiniKit.commandsAsync.sendTransaction({
      transaction: [transaction] as any,
    });
  };

  const pay = async (payment: {
    reference: string;
    to: string;
    tokens: Array<{
      symbol: string;
      token_amount: string;
    }>;
    description: string;
  }) => {
    if (!isInstalled) {
      throw new Error('MiniKit is not installed');
    }

    return MiniKit.commandsAsync.pay({
      ...payment,
      tokens: payment.tokens as any,
    });
  };

  const signMessage = async (message: string) => {
    if (!isInstalled) {
      throw new Error('MiniKit is not installed');
    }

    return MiniKit.commandsAsync.signMessage({ message });
  };

  return {
    isInstalled,
    walletAddress,
    verify,
    sendTransaction,
    pay,
    signMessage,
    MiniKit,
  };
}

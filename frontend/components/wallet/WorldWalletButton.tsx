'use client';

import { useEffect, useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { Button } from '@/components/ui/Button';
import { Wallet } from 'lucide-react';

export function WorldWalletButton() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const installed = MiniKit.isInstalled();
    setIsInstalled(installed);
    
    // Wallet address will be available through MiniKit user state when connected
    // It's typically accessed after sign-in or through wallet commands
  }, []);

  if (!isInstalled) {
    return (
      <div className="text-sm text-gray-500">
        Open in World App to use World Wallet
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="text-sm text-gray-500">
        No wallet connected
      </div>
    );
  }

  return (
    <Button variant="outline" className="flex items-center space-x-2">
      <Wallet className="w-4 h-4" />
      <span className="font-mono">
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
      </span>
    </Button>
  );
}

'use client';

import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface MiniKitProviderProps {
  children: ReactNode;
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  useEffect(() => {
    // Install MiniKit - this initializes the SDK
    MiniKit.install();

    // Log MiniKit status for debugging
    console.log('MiniKit installed:', {
      isInstalled: MiniKit.isInstalled(),
    });

    // MiniKit is now installed and ready
    // Event subscriptions should be done in specific components as needed
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return <>{children}</>;
}

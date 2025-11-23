'use client';

import Link from 'next/link';
import { ConnectButton } from '../wallet/ConnectButton';

export function Header() {
  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 hover:bg-black/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            
            <div>
              <div className="text-2xl font-black  bg-clip-text text-transparent">
                OmniSweep
              </div>
              <div className="text-xs text-gray-500 -mt-1">Dust to USDC</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/receipts" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Receipts
            </Link>
          </nav>

          {/* Wallet Connect */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

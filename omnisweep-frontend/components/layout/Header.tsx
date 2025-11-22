'use client';

import Link from 'next/link';
import { ConnectButton } from '../wallet/ConnectButton';

export function Header() {
  return (
    <header className="border-b border-white/20 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-xl">✨</span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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

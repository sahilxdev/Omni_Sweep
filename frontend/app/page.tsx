'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { ConnectButton } from '@/components/wallet/ConnectButton';

export default function DashboardPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        
      </div>
    );
  }

  // Mock dust data - TODO: Replace with real data from blockchain
  const mockDustData = {
    optimism: {
      totalUSD: 12.45,
      tokenCount: 5,
    },
    world: {
      totalUSD: 8.21,
      tokenCount: 3,
    },
  };

  const totalDust = mockDustData.optimism.totalUSD + mockDustData.world.totalUSD;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Dashboard Header */}
      {/* (Removed large hero title to keep only the purple nav logo) */}
      {/* Chain Selection Cards - Dark Theme */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Optimism Card */}
        <Link href="/sweep?chain=optimism">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 hover:border-red-500 transition-all cursor-pointer group">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔴</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Optimism</h2>
                <p className="text-slate-400 text-sm">Dust Balance</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-3xl font-bold text-white">${mockDustData.optimism.totalUSD.toFixed(2)}</span>
                <span className="text-slate-400 text-sm">USD</span>
              </div>
              <p className="text-slate-400 text-sm">
                {mockDustData.optimism.tokenCount} tokens with small balances
              </p>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 group-hover:shadow-lg transition-all">
              View & Sweep
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Link>

        {/* World Chain Card */}
        <Link href="/sweep?chain=world">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">World Chain</h2>
                <p className="text-slate-400 text-sm">Dust Balance</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-3xl font-bold text-white">${mockDustData.world.totalUSD.toFixed(2)}</span>
                <span className="text-slate-400 text-sm">USD</span>
              </div>
              <p className="text-slate-400 text-sm">
                {mockDustData.world.tokenCount} tokens with small balances
              </p>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 group-hover:shadow-lg transition-all">
              View & Sweep
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap, Scan, TrendingUp, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import GlareHover from '@/components/ui/GlareHover';

export default function DashboardPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-20">
          <div className="mb-6">
            <GradientText 
              colors={['#667eea', '#764ba2', '#f093fb', '#667eea']}
              animationSpeed={6}
              showBorder={false}
              className="text-6xl md:text-7xl font-black"
            >
              OmniSweep
            </GradientText>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Convert your dust tokens on Optimism and World Chain to clean USDC on Base
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Connect your wallet to get started
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <GlareHover
              width="100%"
              height="auto"
              background="rgba(88, 28, 135, 0.3)"
              borderRadius="1rem"
              borderColor="rgba(139, 92, 246, 0.3)"
              glareColor="#a78bfa"
              glareOpacity={0.4}
              className="backdrop-blur-md"
            >
              <div className="p-6 w-full">
                <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Multi-Chain Sweep</h3>
                <p className="text-purple-200 text-sm">
                  Consolidate dust from Optimism and World Chain into USDC on Base
                </p>
              </div>
            </GlareHover>

            <GlareHover
              width="100%"
              height="auto"
              background="rgba(88, 28, 135, 0.3)"
              borderRadius="1rem"
              borderColor="rgba(139, 92, 246, 0.3)"
              glareColor="#a78bfa"
              glareOpacity={0.4}
              className="backdrop-blur-md"
            >
              <div className="p-6 w-full">
                <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Gas Sponsorship</h3>
                <p className="text-purple-200 text-sm">
                  Verify with World ID on World Chain for sponsored transactions
                </p>
              </div>
            </GlareHover>

            <GlareHover
              width="100%"
              height="auto"
              background="rgba(88, 28, 135, 0.3)"
              borderRadius="1rem"
              borderColor="rgba(139, 92, 246, 0.3)"
              glareColor="#a78bfa"
              glareOpacity={0.4}
              className="backdrop-blur-md"
            >
              <div className="p-6 w-full">
                <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Best Rates</h3>
                <p className="text-purple-200 text-sm">
                  Powered by 1inch aggregation for optimal swap execution
                </p>
              </div>
            </GlareHover>
          </div>

          {/* How It Works - Dark Purple Theme */}
          <div className="bg-purple-950/30 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/20 shadow-2xl mb-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">How It Works</h2>
            <p className="text-center text-purple-200 mb-12">Four simple steps to turn dust into USDC</p>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(139, 92, 246, 0.1)"
                  borderRadius="0.75rem"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  glareColor="#a78bfa"
                  glareOpacity={0.4}
                  className="backdrop-blur-sm"
                >
                  <div className="p-6 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-4 text-sm">1</div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Scan className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Scan Your Dust</h3>
                  <p className="text-sm text-purple-200">
                    We scan your small token balances on Optimism and World Chain
                  </p>
                </div>
                </GlareHover>
              </div>
              <div className="relative">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(139, 92, 246, 0.1)"
                  borderRadius="0.75rem"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  glareColor="#a78bfa"
                  glareOpacity={0.4}
                  className="backdrop-blur-sm"
                >
                  <div className="p-6 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-4 text-sm">2</div>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Price & Swap</h3>
                  <p className="text-sm text-purple-200">
                    We call Pyth & 1inch to get the best prices and execute swaps
                  </p>
                </div>
                </GlareHover>
              </div>
              <div className="relative">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(139, 92, 246, 0.1)"
                  borderRadius="0.75rem"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  glareColor="#a78bfa"
                  glareOpacity={0.4}
                  className="backdrop-blur-sm"
                >
                  <div className="p-6 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-4 text-sm">3</div>
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Bridge to Base</h3>
                  <p className="text-sm text-purple-200">
                    Stargate + LayerZero send your USDC securely to Base
                  </p>
                </div>
                </GlareHover>
              </div>
              <div className="relative">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(139, 92, 246, 0.1)"
                  borderRadius="0.75rem"
                  borderColor="rgba(139, 92, 246, 0.3)"
                  glareColor="#a78bfa"
                  glareOpacity={0.4}
                  className="backdrop-blur-sm"
                >
                  <div className="p-6 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-4 text-sm">4</div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Receive Clean USDC</h3>
                  <p className="text-sm text-purple-200">
                    You receive consolidated USDC in your wallet on Base
                  </p>
                </div>
                </GlareHover>
              </div>
            </div>
          </div>

          {/* Why OmniSweep - Dark Purple Theme */}
          <div className="bg-purple-950/30 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Why OmniSweep?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-white">No Gas Needed</h3>
                <p className="text-purple-200 text-sm">
                  World ID users get sponsored gas on World Chain
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-white">Best Rates</h3>
                <p className="text-purple-200 text-sm">
                  Powered by Pyth oracles and 1inch aggregation
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-white">Secure Bridge</h3>
                <p className="text-purple-200 text-sm">
                  LayerZero & Stargate for safe cross-chain transfers
                </p>
              </div>
            </div>
          </div>
        </div>
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">Your Dust Overview</h1>
        <p className="text-gray-600">
          Connect your wallet to see your dust balances
        </p>
      </div>

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

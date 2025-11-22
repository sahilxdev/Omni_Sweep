'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useEffect, useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DustTokenList } from '@/components/sweep/DustTokenList';
import { WorldIDPanel } from '@/components/sweep/WorldIDPanel';
import { getChainByName, chainMetadata } from '@/lib/chains';
import { ChainName } from '@/types';

export default function SweepPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chainParam = searchParams.get('chain') as ChainName | null;
  
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const [worldIdVerified, setWorldIdVerified] = useState(false);

  // Redirect if no chain param
  useEffect(() => {
    if (!chainParam || !['optimism', 'world'].includes(chainParam)) {
      router.push('/');
    }
  }, [chainParam, router]);

  if (!chainParam || !['optimism', 'world'].includes(chainParam)) {
    return null;
  }

  const chain = getChainByName(chainParam);
  const metadata = chain ? chainMetadata[chain.id] : null;

  // Redirect if not connected
  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view and sweep dust tokens
          </p>
          <Link href="/">
            <Button className="gradient-bg text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if on correct network
  const isCorrectNetwork = chain && currentChainId === chain.id;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {metadata && (
              <div className={`w-16 h-16 rounded-full ${metadata.color} bg-opacity-10 flex items-center justify-center text-3xl`}>
                {metadata.icon}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold">Sweep Dust → Base USDC</h1>
              <p className="text-gray-600 mt-1">
                Source network: <span className="font-medium">{metadata?.name || chainParam}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Switch Banner */}
      {!isCorrectNetwork && chain && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Wrong Network</h3>
                <p className="text-gray-700">
                  Please switch to {metadata?.name} to view and sweep your dust tokens.
                </p>
              </div>
            </div>
            <Button
              onClick={() => switchChain?.({ chainId: chain.id })}
              className="gradient-bg text-white ml-4"
            >
              Switch to {metadata?.name}
            </Button>
          </div>
        </div>
      )}

      {/* World ID Panel - Only for World Chain */}
      {chainParam === 'world' && isCorrectNetwork && (
        <WorldIDPanel 
          verified={worldIdVerified}
          onVerified={() => setWorldIdVerified(true)}
        />
      )}

      {/* Dust Token List */}
      {isCorrectNetwork && chain && (
        <DustTokenList 
          chain={chainParam}
          chainId={chain.id}
          address={address!}
          worldIdVerified={worldIdVerified}
        />
      )}

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-bold text-lg mb-3">About Dust Sweeping</h3>
        <div className="text-gray-700 space-y-2 text-sm">
          <p>
            <strong>Dust tokens</strong> are small amounts (typically &lt;$10) that aren't worth the gas fees to move individually.
          </p>
          <p>
            OmniSweep consolidates them into USDC on Base in a single transaction, saving you time and gas costs.
          </p>
          {chainParam === 'world' && (
            <p className="text-blue-700">
              <strong>World Chain Bonus:</strong> Verify with World ID to get sponsored gas for your sweep!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

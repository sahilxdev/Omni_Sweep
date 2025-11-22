'use client';

import { useState } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { SweepModal } from './SweepModal';
import { formatTokenAmount, formatUSD } from '@/lib/utils';
import { DustToken, ChainName } from '@/types';

interface DustTokenListProps {
  chain: ChainName;
  chainId: number;
  address: string;
  worldIdVerified: boolean;
}

export function DustTokenList({ chain, chainId, address, worldIdVerified }: DustTokenListProps) {
  const [selectedToken, setSelectedToken] = useState<DustToken | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock dust tokens - TODO: Replace with actual token fetching
  const mockDustTokens: DustToken[] = [
    {
      address: '0x4200000000000000000000000000000000000042',
      symbol: 'OP',
      decimals: 18,
      balance: '2340000000000000000', // 2.34 OP
      balanceFormatted: '2.34',
      valueUsd: 5.21,
      chain,
    },
    {
      address: '0x1234567890123456789012345678901234567890',
      symbol: 'RANDOM',
      decimals: 18,
      balance: '10000000000000000000', // 10 RANDOM
      balanceFormatted: '10.00',
      valueUsd: 1.02,
      chain,
    },
  ];

  const handleSweep = (token: DustToken) => {
    setSelectedToken(token);
    setShowModal(true);
  };

  if (mockDustTokens.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold mb-3">No Dust Found</h3>
        <p className="text-gray-600">
          You don't have any dust tokens on {chain === 'optimism' ? 'Optimism' : 'World Chain'}.
          <br />
          Try checking the other chain!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <h2 className="text-xl font-bold">Dust Tokens on {chain === 'optimism' ? 'Optimism' : 'World Chain'}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {mockDustTokens.length} token{mockDustTokens.length !== 1 ? 's' : ''} worth less than $10
          </p>
        </div>

        {/* Token Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approx USD
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDustTokens.map((token, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {token.address.slice(0, 6)}...{token.address.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{token.balanceFormatted}</div>
                    <div className="text-xs text-gray-500">{token.symbol}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-green-600">{formatUSD(token.valueUsd)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      onClick={() => handleSweep(token)}
                      size="sm"
                      className="gradient-bg text-white"
                    >
                      Sweep
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total dust value: <span className="font-bold text-gray-900">
              {formatUSD(mockDustTokens.reduce((sum, t) => sum + t.valueUsd, 0))}
            </span>
          </div>
          <a
            href={`https://${chain === 'optimism' ? 'optimistic.etherscan.io' : 'worldscan.org'}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
          >
            <span>View on Explorer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Sweep Modal */}
      {showModal && selectedToken && (
        <SweepModal
          token={selectedToken}
          chain={chain}
          chainId={chainId}
          worldIdVerified={worldIdVerified}
          onClose={() => {
            setShowModal(false);
            setSelectedToken(null);
          }}
        />
      )}
    </>
  );
}

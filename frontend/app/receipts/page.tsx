'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatUSD } from '@/lib/utils';

export default function ReceiptsPage() {
  // Mock receipts data - TODO: Replace with actual data from SweepReceipt events on Base
  const mockReceipts = [
    {
      id: 1,
      date: '2024-11-22',
      time: '18:30:15',
      fromChain: 'Optimism',
      tokenIn: 'OP',
      amountIn: '2.34',
      usdcOut: '5.21',
      status: 'complete',
      txHashes: {
        source: '0xabc123...',
        base: '0xdef456...',
      },
    },
    {
      id: 2,
      date: '2024-11-21',
      time: '14:22:08',
      fromChain: 'World Chain',
      tokenIn: 'WLD',
      amountIn: '10.00',
      usdcOut: '1.02',
      status: 'complete',
      txHashes: {
        source: '0xghi789...',
        base: '0xjkl012...',
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold">Sweep Receipts</h1>
        <p className="text-gray-600 mt-2">
          History of your dust sweeping transactions
        </p>
      </div>

      {/* Receipts Table */}
      {mockReceipts.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Chain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USDC on Base
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{receipt.date}</div>
                      <div className="text-sm text-gray-500">{receipt.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium">{receipt.fromChain}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium">{receipt.tokenIn}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm">{receipt.amountIn}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">{receipt.usdcOut} USDC</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <a
                          href={`https://optimistic.etherscan.io/tx/${receipt.txHashes.source}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          title="View source transaction"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://basescan.org/tx/${receipt.txHashes.base}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                          title="View Base transaction"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            📜
          </div>
          <h3 className="text-2xl font-bold mb-3">No Receipts Yet</h3>
          <p className="text-gray-600 mb-6">
            Complete your first dust sweep to see receipts here
          </p>
          <Link href="/">
            <Button className="gradient-bg text-white">
              Start Sweeping
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

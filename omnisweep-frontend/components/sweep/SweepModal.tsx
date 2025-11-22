'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { TransactionStepper } from './TransactionStepper';
import { formatTokenAmount, formatUSD, getExplorerUrl } from '@/lib/utils';
import { DustToken, ChainName, QuoteResponse, SweepState } from '@/types';
import { toast } from 'sonner';

interface SweepModalProps {
  token: DustToken;
  chain: ChainName;
  chainId: number;
  worldIdVerified: boolean;
  onClose: () => void;
}

export function SweepModal({ token, chain, chainId, worldIdVerified, onClose }: SweepModalProps) {
  const [amount, setAmount] = useState(token.balanceFormatted);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [sweepState, setSweepState] = useState<SweepState>({
    status: 'idle',
    steps: [
      { name: 'Approving token...', status: 'pending' },
      { name: 'Swapping & bridging...', status: 'pending' },
      { name: 'Finalizing on Base...', status: 'pending' },
    ],
  });

  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      // TODO: Call actual backend /api/quote
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockQuote: QuoteResponse = {
        oneInchData: '0x1234...', // Mock calldata
        pythUpdateData: ['0xabcd...'], // Mock Pyth data
        estUsdcOut: '5100000', // 5.1 USDC (6 decimals)
        estFeeUsd: 0.15,
      };
      
      setQuote(mockQuote);
      toast.success('Quote received!');
    } catch (error) {
      toast.error('Failed to get quote. Please try again.');
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleSweep = async () => {
    if (!quote) return;
    
    try {
      // Step 1: Approve
      setSweepState(prev => ({
        ...prev,
        status: 'approving',
        steps: prev.steps.map((step, idx) => 
          idx === 0 ? { ...step, status: 'in_progress' } : step
        ),
      }));

      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock approval
      
      const approveTxHash = '0xabc123...'; // Mock tx hash
      setSweepState(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => 
          idx === 0 ? { 
            ...step, 
            status: 'complete',
            txHash: approveTxHash,
            explorerUrl: getExplorerUrl(chainId, approveTxHash),
          } : step
        ),
      }));

      toast.success('Token approved!');

      // Step 2: Sweep
      setSweepState(prev => ({
        ...prev,
        status: 'swapping',
        steps: prev.steps.map((step, idx) => 
          idx === 1 ? { ...step, status: 'in_progress' } : step
        ),
      }));

      await new Promise(resolve => setTimeout(resolve, 3000)); // Mock sweep
      
      const sweepTxHash = '0xdef456...'; // Mock tx hash
      setSweepState(prev => ({
        ...prev,
        steps: prev.steps.map((step, idx) => 
          idx === 1 ? { 
            ...step, 
            status: 'complete',
            txHash: sweepTxHash,
            explorerUrl: getExplorerUrl(chainId, sweepTxHash),
          } : step
        ),
      }));

      toast.success('Sweep executed!');

      // Step 3: Finalize
      setSweepState(prev => ({
        ...prev,
        status: 'finalizing',
        steps: prev.steps.map((step, idx) => 
          idx === 2 ? { ...step, status: 'in_progress' } : step
        ),
      }));

      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock finalization
      
      const baseTxHash = '0xghi789...'; // Mock tx hash on Base
      setSweepState(prev => ({
        ...prev,
        status: 'success',
        finalUsdcAmount: '5.10',
        steps: prev.steps.map((step, idx) => 
          idx === 2 ? { 
            ...step, 
            status: 'complete',
            txHash: baseTxHash,
            explorerUrl: getExplorerUrl(8453, baseTxHash), // Base chain ID
          } : step
        ),
      }));

      toast.success(`Success! ${quote.estUsdcOut} USDC arrived on Base`);

    } catch (error) {
      setSweepState(prev => ({
        ...prev,
        status: 'error',
        error: 'Transaction failed. Please try again.',
      }));
      toast.error('Sweep failed');
    }
  };

  const isSuccess = sweepState.status === 'success';
  const isProcessing = ['approving', 'swapping', 'finalizing'].includes(sweepState.status);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">
            {isSuccess ? '✓ Sweep Complete' : `Sweep ${token.symbol} to USDC on Base`}
          </h2>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success State */}
          {isSuccess && sweepState.finalUsdcAmount && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                {sweepState.finalUsdcAmount} USDC
              </h3>
              <p className="text-green-700">Successfully arrived on Base!</p>
            </div>
          )}

          {/* Transaction Steps */}
          {sweepState.status !== 'idle' && (
            <TransactionStepper steps={sweepState.steps} />
          )}

          {/* Idle State - Quote Form */}
          {sweepState.status === 'idle' && (
            <>
              {/* Token Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Token</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <span className="font-medium">{token.symbol}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Source Chain</span>
                  <span className="font-medium">{chain === 'optimism' ? 'Optimism' : 'World Chain'}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Destination</span>
                  <span className="font-medium">Base (USDC)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Balance</span>
                  <span className="font-medium">{token.balanceFormatted} {token.symbol}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Sweep
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="0.0"
                />
                <button
                  onClick={() => setAmount(token.balanceFormatted)}
                  className="text-sm text-primary hover:text-primary/80 mt-2"
                >
                  Use max balance
                </button>
              </div>

              {/* Quote Display */}
              {quote ? (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Estimated USDC on Base</span>
                    <span className="text-lg font-bold text-blue-900">
                      {formatTokenAmount(quote.estUsdcOut, 6)} USDC
                    </span>
                  </div>
                  {quote.estFeeUsd && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Est. fees & slippage</span>
                      <span className="text-gray-900">{formatUSD(quote.estFeeUsd)}</span>
                    </div>
                  )}
                  {worldIdVerified && chain === 'world' && (
                    <div className="flex items-center space-x-2 text-sm text-green-700">
                      <span>✓</span>
                      <span>Gas sponsored (World ID verified)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Click "Get Quote" to see estimated output
                </div>
              )}

              {/* Error Display */}
              {sweepState.error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{sweepState.error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!quote ? (
                  <>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={fetchQuote}
                      disabled={loadingQuote || !amount || parseFloat(amount) <= 0}
                      className="flex-1 gradient-bg text-white"
                    >
                      {loadingQuote ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Getting Quote...
                        </>
                      ) : (
                        'Get Quote'
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setQuote(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSweep}
                      className="flex-1 gradient-bg text-white"
                    >
                      Approve & Sweep
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Success Actions */}
          {isSuccess && (
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 gradient-bg text-white"
              >
                Do Another Sweep
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

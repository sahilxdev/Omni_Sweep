'use client';

import { Check, Loader2, ExternalLink, X } from 'lucide-react';
import { TxStep } from '@/types';
import { cn } from '@/lib/utils';

interface TransactionStepperProps {
  steps: TxStep[];
}

export function TransactionStepper({ steps }: TransactionStepperProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, idx) => {
        const isPending = step.status === 'pending';
        const isInProgress = step.status === 'in_progress';
        const isComplete = step.status === 'complete';
        const isError = step.status === 'error';

        return (
          <div key={idx} className="flex items-start space-x-3">
            {/* Icon */}
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                isPending && 'bg-gray-200 text-gray-400',
                isInProgress && 'bg-blue-100 text-blue-600',
                isComplete && 'bg-green-100 text-green-600',
                isError && 'bg-red-100 text-red-600'
              )}
            >
              {isPending && <div className="w-3 h-3 rounded-full bg-gray-400" />}
              {isInProgress && <Loader2 className="w-5 h-5 animate-spin" />}
              {isComplete && <Check className="w-5 h-5" />}
              {isError && <X className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    'font-medium',
                    isPending && 'text-gray-500',
                    isInProgress && 'text-blue-900',
                    isComplete && 'text-green-900',
                    isError && 'text-red-900'
                  )}
                >
                  {step.name}
                </p>
                {isInProgress && (
                  <span className="text-xs text-blue-600 animate-pulse">Processing...</span>
                )}
                {isComplete && (
                  <span className="text-xs text-green-600">Complete</span>
                )}
              </div>

              {/* Transaction Link */}
              {step.txHash && step.explorerUrl && (
                <a
                  href={step.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-primary hover:text-primary/80 mt-1"
                >
                  <span className="font-mono">{step.txHash}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

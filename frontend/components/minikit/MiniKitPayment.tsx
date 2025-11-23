'use client';

import { useState } from 'react';
import { MiniKit, PayCommandInput, ResponseEvent } from '@worldcoin/minikit-js';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MiniKitPaymentProps {
  amount: string;
  tokenSymbol: string;
  recipient: string;
  description: string;
  reference: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function MiniKitPayment({
  amount,
  tokenSymbol,
  recipient,
  description,
  reference,
  onSuccess,
  onError,
}: MiniKitPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!MiniKit.isInstalled()) {
      toast.error('Please open this app in World App');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentPayload: PayCommandInput = {
        reference,
        to: recipient,
        tokens: [
          {
            symbol: tokenSymbol as any, // MiniKit token types are flexible
            token_amount: amount,
          },
        ] as any,
        description,
      };

      const { finalPayload } = await MiniKit.commandsAsync.pay(paymentPayload);

      if (finalPayload.status === 'success') {
        const transactionId = (finalPayload as any).transaction_id;
        toast.success('Payment successful!');
        onSuccess?.(transactionId);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ${amount} ${tokenSymbol}`
      )}
    </Button>
  );
}

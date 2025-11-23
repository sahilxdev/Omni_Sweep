'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { MiniKit, VerifyCommandInput, ResponseEvent } from '@worldcoin/minikit-js';

interface WorldIDPanelProps {
  verified: boolean;
  onVerified: () => void;
}

export function WorldIDPanel({ verified, onVerified }: WorldIDPanelProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    // Subscribe to verify responses
    MiniKit.subscribe(
      ResponseEvent.MiniAppVerifyAction,
      async (payload) => {
        if (payload.status === 'error') {
          setError('Verification failed');
          setIsVerifying(false);
          return;
        }

        // Verification successful
        if (payload.status === 'success') {
          console.log('World ID verification successful:', payload);
          onVerified();
          setIsVerifying(false);
        }
      }
    );
  }, [onVerified]);

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      setError('MiniKit is not installed. Please open this app in World App.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const verifyPayload: VerifyCommandInput = {
        action: 'verify-human', // Action ID for your app
        signal: '', // Optional signal for additional verification
        verification_level: 'orb' as any, // 'orb' or 'device'
      };

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        throw new Error('Verification failed');
      }

      // You can verify the proof on your backend here if needed
      // The proof includes: merkle_root, nullifier_hash, proof, verification_level
      console.log('Verification proof:', finalPayload);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err instanceof Error ? err.message : 'Verification failed');
      setIsVerifying(false);
    }
  };

  if (verified) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 text-green-900">World ID Verified ✓</h3>
            <p className="text-green-700">
              Gas sponsorship enabled (subject to paymaster policy). Your sweep transactions may be sponsored!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Verify with World ID</h3>
            <p className="text-gray-700 mb-3">
              Get sponsored gas on World Chain by verifying your World ID. This helps prevent spam and qualifies you for gasless transactions.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>Verification is optional but recommended for gas savings</span>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleVerify}
          disabled={isVerifying}
          className="gradient-bg text-white ml-4"
        >
          {isVerifying ? 'Verifying...' : 'Verify with World ID'}
        </Button>
      </div>
    </div>
  );
}

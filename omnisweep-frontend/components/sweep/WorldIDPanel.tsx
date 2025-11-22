'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface WorldIDPanelProps {
  verified: boolean;
  onVerified: () => void;
}

export function WorldIDPanel({ verified, onVerified }: WorldIDPanelProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // TODO: Integrate with World ID MiniKit
    // For now, simulate verification
    setTimeout(() => {
      onVerified();
      setIsVerifying(false);
    }, 2000);
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

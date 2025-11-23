'use client';

import { useState } from 'react';
import { useMiniKit } from '@/hooks/useMiniKit';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Wallet, Send, FileSignature, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function MiniKitDemo() {
  const { isInstalled, walletAddress, verify, sendTransaction, pay, signMessage } = useMiniKit();
  const [isVerified, setIsVerified] = useState(false);

  if (!isInstalled) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2">World App Required</h3>
        <p className="text-gray-700">
          This mini app uses World MiniKit features. Please open it in the World App to access all functionality.
        </p>
      </div>
    );
  }

  const handleVerify = async () => {
    try {
      const result = await verify('verify-demo');
      if (result.finalPayload.status === 'success') {
        setIsVerified(true);
        toast.success('World ID verified successfully!');
      }
    } catch (error) {
      toast.error('Verification failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSignMessage = async () => {
    try {
      const result = await signMessage('Hello from OmniSweep!');
      if (result.finalPayload.status === 'success') {
        toast.success('Message signed successfully!');
      }
    } catch (error) {
      toast.error('Signing failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
          <Shield className="w-6 h-6 text-purple-600" />
          <span>World MiniKit Integration</span>
        </h2>
        <p className="text-gray-700 mb-4">
          This app is integrated with World MiniKit SDK, giving you access to:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-bold">World ID Verification</h3>
            </div>
            <p className="text-sm text-gray-600">Verify your humanity with World ID</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold">Wallet Integration</h3>
            </div>
            <p className="text-sm text-gray-600">Connect with your World App wallet</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Send className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold">Payments & Transactions</h3>
            </div>
            <p className="text-sm text-gray-600">Send tokens and execute transactions</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileSignature className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold">Message Signing</h3>
            </div>
            <p className="text-sm text-gray-600">Sign messages for authentication</p>
          </div>
        </div>
      </div>

      {walletAddress && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Connected Wallet</h3>
          <p className="font-mono text-sm text-gray-700">{walletAddress}</p>
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">MiniKit Actions</h3>
        <div className="space-y-3">
          <Button
            onClick={handleVerify}
            disabled={isVerified}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isVerified ? '✓ Verified with World ID' : 'Verify with World ID'}
          </Button>
          
          <Button
            onClick={handleSignMessage}
            variant="outline"
            className="w-full"
          >
            Sign a Test Message
          </Button>
        </div>
      </div>
    </div>
  );
}

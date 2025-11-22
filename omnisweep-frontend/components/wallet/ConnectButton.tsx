'use client';

import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { Button } from '../ui/Button';
import { shortenAddress } from '@/lib/utils';
import { ChevronDown, Wallet, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Not connected state
  if (!isConnected) {
    return (
      <>
        <Button 
          onClick={() => setShowConnectModal(true)}
          className="gradient-bg text-white"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>

        {/* Connect Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Connect Wallet</h2>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {/* Coinbase Smart Wallet - Primary */}
                {connectors
                  .filter(conn => conn.name === 'Coinbase Wallet')
                  .map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => {
                        connect({ connector });
                        setShowConnectModal(false);
                      }}
                      className="w-full flex items-center justify-between p-4 border-2 border-primary rounded-xl hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Coinbase Smart Wallet</div>
                          <div className="text-xs text-gray-500">Recommended</div>
                        </div>
                      </div>
                      <div className="text-xs bg-primary text-white px-3 py-1 rounded-full">
                        Primary
                      </div>
                    </button>
                  ))}

                {/* Other wallets */}
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">or connect with</span>
                  </div>
                </div>

                {connectors
                  .filter(conn => conn.name !== 'Coinbase Wallet')
                  .map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => {
                        connect({ connector });
                        setShowConnectModal(false);
                      }}
                      className="w-full flex items-center justify-between p-4 border rounded-xl hover:border-primary hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="font-medium">{connector.name}</div>
                      </div>
                    </button>
                  ))}
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">
                By connecting, you agree to our Terms of Service
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Connected state
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        variant="outline"
        className="border-2"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="font-mono text-sm">
            {ensName || shortenAddress(address || '')}
          </span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </Button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border p-2 z-50">
          <div className="px-3 py-2 border-b mb-2">
            <div className="text-xs text-gray-500">Connected Account</div>
            <div className="font-mono text-sm mt-1">{shortenAddress(address || '')}</div>
          </div>

          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
}

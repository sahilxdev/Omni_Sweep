"use client";

import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { Button } from '../ui/Button';
import { shortenAddress } from '@/lib/utils';
import { ChevronDown, Wallet, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ConnectButtonProps {
  label?: React.ReactNode;
  className?: string;
}

export function ConnectButton({ label, className }: ConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const defaultClass = "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all";

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button className={className ?? "bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-50 cursor-not-allowed"}>
        <Wallet className="w-4 h-4 mr-2" />
        {label ?? 'Connect Wallet'}
      </Button>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <>
        <Button 
          onClick={() => setShowConnectModal(true)}
          className={className ?? defaultClass}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {label ?? 'Connect Wallet'}
        </Button>

        {/* Connect Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md rounded-2xl p-6 bg-white/5 backdrop-blur-md border border-white/10 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
                  <button
                    onClick={() => setShowConnectModal(false)}
                    aria-label="Close connect modal"
                    className="text-white/70 hover:text-white rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <span aria-hidden>✕</span>
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
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-all group border border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">Coinbase Smart Wallet</div>
                          <div className="text-xs text-white/70">Recommended</div>
                        </div>
                      </div>
                      <div className="text-xs bg-white/12 text-white px-3 py-1 rounded-full">
                        Primary
                      </div>
                    </button>
                  ))}

                {/* Other wallets */}
                <div className="flex items-center py-3" role="separator" aria-orientation="horizontal" aria-label="or connect with">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="mx-3 text-xs text-white/70 bg-white/6 px-3 py-1 rounded-full">or connect with</span>
                  <div className="flex-1 h-px bg-white/10" />
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
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-white/8 hover:bg-white/10 transition-all text-white"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div className="font-medium text-white">{connector.name}</div>
                      </div>
                    </button>
                  ))}
              </div>

              <p className="text-xs text-white/70 text-center mt-6">
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
        className={className ?? defaultClass}
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
        <div className="absolute right-0 mt-2 w-64 bg-white/6 text-white rounded-xl shadow-xl border border-white/10 p-2 z-50">
          <div className="px-3 py-2 border-b border-white/8 mb-2">
            <div className="text-xs text-white/70">Connected Account</div>
            <div className="font-mono text-sm mt-1 text-white">{shortenAddress(address || '')}</div>
          </div>

          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-600/10 text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium">Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
}

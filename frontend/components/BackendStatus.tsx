'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { checkHealth } from '@/lib/api';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [contracts, setContracts] = useState<any>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await checkHealth();
        setStatus('online');
        setContracts(health.contracts);
      } catch (error) {
        setStatus('offline');
      }
    };

    checkBackend();
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center space-x-2 text-sm text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking backend...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {status === 'online' ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-400">Backend Online</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-400">Backend Offline</span>
        </>
      )}
    </div>
  );
}

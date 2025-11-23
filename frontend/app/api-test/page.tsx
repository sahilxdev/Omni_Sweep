'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { checkHealth, fetchContracts, fetchQuote, fetchStats } from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'Health Check',
      key: 'health',
      fn: () => checkHealth(),
      description: 'Check if backend is running'
    },
    {
      name: 'Fetch Contracts',
      key: 'contracts',
      fn: () => fetchContracts(),
      description: 'Get all contract addresses'
    },
    {
      name: 'Fetch Stats',
      key: 'stats',
      fn: () => fetchStats(),
      description: 'Get protocol statistics'
    },
    {
      name: 'Get Quote',
      key: 'quote',
      fn: () => fetchQuote('0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60', '1000000000000000000'),
      description: 'Test swap quote (1 DustToken → USDC)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Backend API Test</h1>
        <p className="text-slate-400 mb-8">
          Testing connection to: <code className="text-purple-400">{process.env.NEXT_PUBLIC_API_URL}</code>
        </p>

        <div className="grid gap-4">
          {tests.map((test) => (
            <div key={test.key} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{test.name}</h3>
                  <p className="text-slate-400 text-sm">{test.description}</p>
                </div>
                <Button
                  onClick={() => runTest(test.key, test.fn)}
                  disabled={loading[test.key]}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading[test.key] ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Run Test'
                  )}
                </Button>
              </div>

              {results[test.key] && (
                <div className={`mt-4 p-4 rounded-lg ${
                  results[test.key].success 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {results[test.key].success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-semibold ${
                      results[test.key].success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {results[test.key].success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <pre className="text-xs text-slate-300 overflow-x-auto">
                    {JSON.stringify(
                      results[test.key].success ? results[test.key].data : results[test.key].error,
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-2">API Endpoint</h3>
          <code className="text-sm text-slate-300">
            {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
          </code>
        </div>
      </div>
    </div>
  );
}

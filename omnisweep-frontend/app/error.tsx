'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={reset} className="gradient-bg text-white">
          Try again
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import ErrorRetry from '@/components/ui/error-retry';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page Load Error:', error);
  }, [error]);

  return (
    <ErrorRetry 
        title="Unable to Connect"
        message="We are having trouble loading the school data."
        onRetry={reset}
        autoRetry={true}
    />
  );
}

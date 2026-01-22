'use client';

import { useState, useEffect } from 'react';
import ErrorRetry from '@/components/ui/error-retry';

interface TimeoutLoaderProps {
  children: React.ReactNode;
  timeout?: number; // duration in ms, default 15000 (15s)
}

export default function TimeoutLoader({ children, timeout = 15000 }: TimeoutLoaderProps) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (showError) {
    return (
      <ErrorRetry 
        title="Still loading..."
        message="It's taking a bit longer than usual to connect. Reconnecting..."
        autoRetry={true}
      />
    );
  }

  return <>{children}</>;
}

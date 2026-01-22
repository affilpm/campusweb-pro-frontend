'use client';

import LoadingSpinner from '@/components/ui/loading';
import TimeoutLoader from '@/components/ui/timeout-loader';

export default function Loading() {
  return (
    <TimeoutLoader>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading content..." />
          <p className="text-blue-200 mt-4 max-w-sm mx-auto text-sm opacity-80">
            Please wait while we prepare the best experience for you.
          </p>
        </div>
      </div>
    </TimeoutLoader>
  );
}

'use client';
import { PageLoadingSkeleton } from '@/components/ui/loading';
import TimeoutLoader from '@/components/ui/timeout-loader';

export default function Loading() {
  return (
    <TimeoutLoader>
      <PageLoadingSkeleton />
    </TimeoutLoader>
  );
}

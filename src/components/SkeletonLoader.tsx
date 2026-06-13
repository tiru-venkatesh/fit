import React from 'react';

export function SkeletonLoader({
  type = 'card',
  count = 1,
  className = '',
}: {
  type?: 'card' | 'text' | 'list' | 'metric';
  count?: number;
  className?: string;
}) {
  const renderSkeleton = () => {
    switch (type) {
      case 'metric':
        return (
          <div className="rounded-xl border border-white/[0.04] bg-zinc-900/50 p-4 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-zinc-800" />
            <div className="mt-2 h-8 w-1/2 rounded bg-zinc-800" />
            <div className="mt-1 h-3 w-1/4 rounded bg-zinc-800" />
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-5/6 rounded bg-zinc-800" />
            <div className="h-4 w-2/3 rounded bg-zinc-800" />
          </div>
        );
      case 'list':
        return (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 rounded-lg bg-zinc-950/20 p-3">
                <div className="h-10 w-10 rounded bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-zinc-800" />
                  <div className="h-3 w-1/4 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'card':
      default:
        return (
          <div className={`rounded-2xl border border-white/[0.04] bg-zinc-950/40 p-6 animate-pulse ${className}`}>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-zinc-800" />
                <div className="h-3 w-1/4 rounded bg-zinc-800" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded bg-zinc-800" />
              <div className="h-4 w-5/6 rounded bg-zinc-800" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
}

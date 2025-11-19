'use client';

import Card from './Card';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto`} />
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <Card hover>
      <div className="space-y-4">
        <LoadingSkeleton className="w-full h-64" />
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center">
          <LoadingSkeleton className="h-8 w-24" />
          <LoadingSkeleton className="h-10 w-32" />
        </div>
      </div>
    </Card>
  );
}


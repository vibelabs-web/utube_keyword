import type { HTMLAttributes, ElementType } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

/**
 * Skeleton component for loading states
 * Shows an animated placeholder while content is loading
 */
export function Skeleton({
  as: Component = 'div',
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <Component
      data-testid="skeleton"
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      {...props}
    />
  );
}

interface CardSkeletonProps {
  lines?: number;
}

/**
 * Card skeleton for generic card loading states
 * Shows a card structure with multiple content lines
 */
export function CardSkeleton({ lines = 2 }: CardSkeletonProps) {
  return (
    <div
      data-testid="card-skeleton"
      className="bg-white rounded-lg border p-4 space-y-3"
    >
      <Skeleton className="h-6 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          data-testid="skeleton-line"
          className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

/**
 * Metric card skeleton for dashboard metric cards
 * Shows placeholder for label, value, and description
 */
export function MetricCardSkeleton() {
  return (
    <div
      data-testid="metric-skeleton"
      className="bg-white rounded-lg border p-4 space-y-2"
    >
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/**
 * Keyword analysis result skeleton
 * Matches the structure of keyword analysis results
 */
export function KeywordResultSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metric cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
      {/* Related keywords card */}
      <CardSkeleton lines={5} />
    </div>
  );
}

/**
 * Comment analysis result skeleton
 * Matches the structure of comment analysis results
 */
export function CommentResultSkeleton() {
  return (
    <div className="space-y-6">
      {/* Video info card */}
      <CardSkeleton lines={3} />
      {/* Analysis results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
      </div>
    </div>
  );
}

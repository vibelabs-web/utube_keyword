/**
 * Utility function to merge class names conditionally
 * Simple alternative to clsx/classnames for className merging
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

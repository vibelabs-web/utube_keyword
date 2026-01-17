import { Card, CardBody, CardHeader } from '@/components/ui';

interface Sentiment {
  positive: number;
  neutral: number;
  negative: number;
  total_analyzed: number;
}

interface SentimentChartProps {
  sentiment: Sentiment;
}

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
  testId: string;
}

/**
 * ProgressBar Component
 *
 * Displays a single sentiment progress bar with label and percentage.
 */
function ProgressBar({ label, value, color, testId }: ProgressBarProps) {
  const percentage = Math.round(value * 100);

  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">
          {percentage}%
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
          data-testid={testId}
          aria-label={`${label} ${percentage}%`}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

/**
 * SentimentChart Component
 *
 * Displays sentiment analysis results as horizontal progress bars.
 * Shows the distribution of positive, neutral, and negative sentiment
 * across analyzed comments.
 *
 * Features:
 * - Three sentiment categories with color coding
 * - Percentage display for each sentiment
 * - Total analyzed count
 * - Accessible progress bars with ARIA labels
 * - Smooth animations
 *
 * @example
 * ```tsx
 * <SentimentChart sentiment={{
 *   positive: 0.6,
 *   neutral: 0.3,
 *   negative: 0.1,
 *   total_analyzed: 100
 * }} />
 * ```
 */
export default function SentimentChart({ sentiment }: SentimentChartProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-slate-900">감정 분석</h3>
        <p className="text-sm text-slate-600">
          분석된 댓글: {sentiment.total_analyzed.toLocaleString()}개
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <ProgressBar
            label="긍정"
            value={sentiment.positive}
            color="bg-green-500"
            testId="positive-bar"
          />
          <ProgressBar
            label="중립"
            value={sentiment.neutral}
            color="bg-slate-400"
            testId="neutral-bar"
          />
          <ProgressBar
            label="부정"
            value={sentiment.negative}
            color="bg-red-500"
            testId="negative-bar"
          />
        </div>
      </CardBody>
    </Card>
  );
}

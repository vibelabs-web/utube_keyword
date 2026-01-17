import { Card, CardBody, CardHeader } from '@/components/ui';

interface FrequentWord {
  word: string;
  count: number;
  percentage: number;
}

interface FrequentWordsProps {
  words: FrequentWord[];
}

/**
 * FrequentWords Component
 *
 * Displays the top 10 most frequently mentioned words in comments
 * with ranking, count, and percentage information.
 *
 * Features:
 * - Displays ranking with circular badge
 * - Shows word count and percentage
 * - Limits to top 10 words
 * - Empty state for no data
 *
 * @example
 * ```tsx
 * <FrequentWords words={[
 *   { word: '좋아요', count: 50, percentage: 10 }
 * ]} />
 * ```
 */
export default function FrequentWords({ words }: FrequentWordsProps) {
  if (words.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-slate-900">
            자주 언급된 단어
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-center text-slate-500">분석된 단어가 없습니다</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-slate-900">
          자주 언급된 단어
        </h3>
      </CardHeader>
      <CardBody>
        <ul className="space-y-3">
          {words.slice(0, 10).map((word, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
            >
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center
                           rounded-full bg-blue-500 text-sm font-bold text-white"
                aria-label={`순위 ${index + 1}`}
              >
                {index + 1}
              </span>
              <span className="flex-1 text-lg font-medium text-slate-900">
                {word.word}
              </span>
              <div className="text-right">
                <span className="text-lg font-semibold text-slate-900">
                  {word.count}회
                </span>
                <span className="ml-2 text-sm text-slate-500">
                  {word.percentage}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

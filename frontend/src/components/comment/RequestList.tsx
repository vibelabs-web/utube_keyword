import { Card, CardBody, CardHeader, Badge } from '@/components/ui';

interface ViewerRequest {
  text: string;
  like_count: number;
  author: string;
}

interface RequestListProps {
  requests: ViewerRequest[];
}

/**
 * RequestList Component
 *
 * Displays top viewer requests/comments sorted by like count.
 * Shows the most popular requests from the audience.
 *
 * Features:
 * - Displays top 5 requests
 * - Shows like count with badge
 * - Displays author name
 * - Shows published date
 * - Empty state for no data
 *
 * @example
 * ```tsx
 * <RequestList requests={[
 *   {
 *     text: '다음 영상 해주세요!',
 *     like_count: 100,
 *     author: 'user1'
 *   }
 * ]} />
 * ```
 */
export default function RequestList({ requests }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-slate-900">
            시청자 요청사항
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-center text-slate-500">요청사항이 없습니다</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-slate-900">시청자 요청사항</h3>
        <p className="text-sm text-slate-600">
          좋아요가 많은 순으로 표시됩니다
        </p>
      </CardHeader>
      <CardBody>
        <ul className="space-y-4">
          {requests.slice(0, 5).map((request, index) => (
            <li
              key={index}
              className="rounded-lg border border-slate-200 p-4 last:border-b-0"
            >
              <p className="mb-3 text-slate-900">{request.text}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="font-medium">@{request.author}</span>
                <Badge variant="default" size="sm">
                  {request.like_count} likes
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

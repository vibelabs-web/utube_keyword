import { Card, CardHeader, CardBody } from '@/components/ui';

interface TopComment {
  text: string;
  like_count: number;
  author: string;
}

interface TopCommentsProps {
  comments: TopComment[];
}

export default function TopComments({ comments }: TopCommentsProps) {
  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-900">인기 댓글 TOP 5</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {comments.map((comment, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-sm text-slate-700">{comment.text}</p>
                <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {comment.like_count} likes
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">- {comment.author}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

import { Card, CardHeader, CardBody } from '@/components/ui';

interface ViewerQuestion {
  text: string;
  like_count: number;
  author: string;
}

interface ViewerQuestionsProps {
  questions: ViewerQuestion[];
}

export default function ViewerQuestions({ questions }: ViewerQuestionsProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-900">시청자 질문</h3>
        <p className="text-sm text-slate-500">시청자들이 궁금해하는 내용</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3"
            >
              <span className="shrink-0 text-lg">❓</span>
              <div className="flex-1">
                <p className="text-sm text-slate-700">{question.text}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span>{question.author}</span>
                  {question.like_count > 0 && (
                    <>
                      <span>·</span>
                      <span>{question.like_count} likes</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

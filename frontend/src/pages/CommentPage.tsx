import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  ErrorMessage,
  CommentResultSkeleton,
} from '@/components/ui';
import { useCommentAnalysis } from '@/hooks/useCommentAnalysis';
import { isValidYouTubeUrl } from '@/utils/validation';
import FrequentWords from '@/components/comment/FrequentWords';
import RequestList from '@/components/comment/RequestList';
import SentimentChart from '@/components/comment/SentimentChart';
import TopComments from '@/components/comment/TopComments';
import ViewerQuestions from '@/components/comment/ViewerQuestions';

/**
 * Comment Analysis Page
 *
 * Allows users to analyze YouTube video comments by entering a video URL.
 * Displays video information, sentiment analysis, frequent words, and viewer requests.
 */
export default function CommentPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const { mutate, data, isPending, error } = useCommentAnalysis();

  /**
   * Handles the analyze button click
   * Validates the URL and triggers the analysis
   */
  const handleAnalyze = () => {
    setUrlError('');

    if (!videoUrl.trim()) {
      setUrlError('YouTube URL을 입력해주세요');
      return;
    }

    if (!isValidYouTubeUrl(videoUrl)) {
      setUrlError('유효한 YouTube URL을 입력해주세요');
      return;
    }

    mutate({ video_url: videoUrl });
  };

  /**
   * Handles Enter key press on input
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  /**
   * Clears error when user types
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    if (urlError) {
      setUrlError('');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">댓글 분석</h1>
        <p className="text-slate-600">
          YouTube 영상 URL을 입력하여 댓글을 분석하세요
        </p>
      </div>

      {/* URL Input Section */}
      <Card className="mb-8">
        <CardBody>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                value={videoUrl}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="YouTube 영상 URL을 입력하세요"
                error={urlError}
                disabled={isPending}
                aria-label="YouTube 영상 URL"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleAnalyze}
              isLoading={isPending}
              disabled={isPending}
              className="sm:w-auto"
            >
              {isPending ? '분석 중...' : '분석하기'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Loading State */}
      {isPending && <CommentResultSkeleton />}

      {/* Error State */}
      {error && (
        <ErrorMessage
          message={error.message || '댓글 분석 중 오류가 발생했습니다'}
        />
      )}

      {/* Results Section */}
      {data && !isPending && (
        <div className="space-y-6">
          {/* Video Info Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">영상 정보</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">
                    {data.video_info.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {data.video_info.channel_title}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-sm text-slate-500">조회수</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {data.video_info.view_count.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">댓글 수</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {data.video_info.comment_count.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">분석된 댓글</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {(data.sentiment?.total_analyzed || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">분석 시간</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(data.analyzed_at).toLocaleTimeString('ko-KR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Analysis Results Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Sentiment Analysis */}
            {data.sentiment && <SentimentChart sentiment={data.sentiment} />}

            {/* Frequent Words */}
            <FrequentWords words={data.frequent_words} />
          </div>

          {/* Top Comments */}
          <TopComments comments={data.top_comments || []} />

          {/* Viewer Questions & Requests */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ViewerQuestions questions={data.viewer_questions || []} />
            <RequestList requests={data.viewer_requests} />
          </div>
        </div>
      )}
    </div>
  );
}

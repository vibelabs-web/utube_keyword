"""
Tests for CommentAnalyzerService

Tests comment text analysis functionality:
- Frequent word extraction
- Viewer request detection
- Sentiment analysis
"""
import pytest
from app.services.comment_analyzer import CommentAnalyzerService


class TestCommentAnalyzer:
    @pytest.fixture
    def analyzer(self):
        return CommentAnalyzerService()

    @pytest.fixture
    def sample_comments(self):
        return [
            {"text": "정말 좋은 영상이에요! 다음 영상도 기대됩니다", "like_count": 50, "author": "user1"},
            {"text": "너무 재미있어요 감사합니다", "like_count": 30, "author": "user2"},
            {"text": "이런 영상 더 올려주세요!", "like_count": 100, "author": "user3"},
            {"text": "별로에요... 실망입니다", "like_count": 5, "author": "user4"},
            {"text": "다음에는 파이썬 강의 해주세요!", "like_count": 80, "author": "user5"},
        ]

    def test_extract_frequent_words(self, analyzer, sample_comments):
        """빈도 단어 추출 테스트"""
        result = analyzer.extract_frequent_words(sample_comments)

        assert len(result) <= 20  # 최대 20개
        assert all(word.count > 0 for word in result)
        assert all(word.percentage >= 0 for word in result)
        # 빈도순 정렬 확인
        counts = [w.count for w in result]
        assert counts == sorted(counts, reverse=True)

    def test_extract_viewer_requests(self, analyzer, sample_comments):
        """시청자 요청사항 추출 테스트"""
        result = analyzer.extract_viewer_requests(sample_comments)

        # "~해주세요", "~기대됩니다" 패턴 감지
        assert len(result) >= 1
        # 좋아요 순 정렬
        likes = [r.like_count for r in result]
        assert likes == sorted(likes, reverse=True)

    def test_analyze_sentiment(self, analyzer, sample_comments):
        """감성 분석 테스트"""
        result = analyzer.analyze_sentiment(sample_comments)

        assert hasattr(result, "positive")
        assert hasattr(result, "neutral")
        assert hasattr(result, "negative")
        assert hasattr(result, "total_analyzed")

        # 비율 합이 1.0
        total = result.positive + result.neutral + result.negative
        assert abs(total - 1.0) < 0.01

        # 분석된 댓글 수
        assert result.total_analyzed == len(sample_comments)

    def test_analyze_empty_comments(self, analyzer):
        """빈 댓글 처리"""
        result = analyzer.analyze_sentiment([])

        assert result.total_analyzed == 0
        assert result.positive == 0
        assert result.neutral == 0
        assert result.negative == 0

    def test_extract_frequent_words_filters_stopwords(self, analyzer):
        """불용어 필터링 테스트"""
        comments = [
            {"text": "이것은 좋은 강의입니다", "like_count": 10, "author": "user1"},
            {"text": "이것도 좋은 설명이에요", "like_count": 20, "author": "user2"},
        ]

        result = analyzer.extract_frequent_words(comments)

        # '이', '것', '은', '도' 등 불용어는 제외되어야 함
        words = [w.word for w in result]
        assert "이" not in words
        assert "것" not in words
        assert "은" not in words

    def test_viewer_requests_limited_to_10(self, analyzer):
        """요청사항 최대 10개로 제한"""
        # 15개의 요청 댓글 생성
        comments = [
            {"text": f"{i}번째 영상 올려주세요", "like_count": i, "author": f"user{i}"}
            for i in range(15)
        ]

        result = analyzer.extract_viewer_requests(comments)

        assert len(result) <= 10

    def test_sentiment_with_positive_comments(self, analyzer):
        """긍정 댓글 비율 테스트"""
        comments = [
            {"text": "정말 좋아요 최고예요", "like_count": 10, "author": "user1"},
            {"text": "감사합니다 훌륭해요", "like_count": 20, "author": "user2"},
            {"text": "별로네요", "like_count": 5, "author": "user3"},
        ]

        result = analyzer.analyze_sentiment(comments)

        # 3개 중 2개가 긍정적이므로 positive > 0.5
        assert result.positive > 0.5
        assert result.total_analyzed == 3

    def test_sentiment_with_negative_comments(self, analyzer):
        """부정 댓글 비율 테스트"""
        comments = [
            {"text": "별로에요 실망입니다", "like_count": 10, "author": "user1"},
            {"text": "최악이네요 후회됩니다", "like_count": 20, "author": "user2"},
            {"text": "좋아요", "like_count": 5, "author": "user3"},
        ]

        result = analyzer.analyze_sentiment(comments)

        # 3개 중 2개가 부정적이므로 negative > 0.5
        assert result.negative > 0.5
        assert result.total_analyzed == 3

    @pytest.mark.asyncio
    async def test_analyze_all_integration(self, analyzer, sample_comments):
        """전체 분석 통합 테스트"""
        result = await analyzer.analyze_all(sample_comments)

        assert "frequent_words" in result
        assert "viewer_requests" in result
        assert "sentiment" in result

        # 각 분석 결과가 올바른 타입인지 확인
        assert isinstance(result["frequent_words"], list)
        assert isinstance(result["viewer_requests"], list)
        assert result["sentiment"] is not None

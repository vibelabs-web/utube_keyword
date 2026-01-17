"""
Comment Analyzer Service

Provides text analysis functionality for YouTube comments:
- Frequent word extraction
- Viewer request detection
- Sentiment analysis (positive/negative/neutral)
"""
import re
from collections import Counter
from typing import List, Dict, Any

from app.schemas.comment import FrequentWord, ViewerRequest, ViewerQuestion, TopComment, SentimentAnalysis


class CommentAnalyzerService:
    """
    Service for analyzing YouTube comment text.

    Provides:
    - Word frequency analysis (top 20 words)
    - Viewer request extraction (pattern-based)
    - Sentiment analysis (keyword-based dictionary approach)
    """

    # 불용어 (한국어 + 영어)
    STOPWORDS = {
        # 한국어
        '이', '그', '저', '것', '수', '등', '들', '및', '에서', '으로',
        '하다', '있다', '되다', '하고', '하는', '할', '하면', '합니다',
        '입니다', '있습니다', '됩니다', '해요', '네요', '거든요', '이에요',
        '예요', '이네요', '에요',
        # 영어
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
        'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she',
        'we', 'they', 'what', 'which', 'who', 'whom', 'how', 'when', 'where',
        'why', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
        'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too',
        'very', 'just', 'also', 'now', 'here', 'there', 'if', 'then', 'my',
        'your', 'his', 'her', 'our', 'their', 'me', 'him', 'us', 'them'
    }

    # 요청 패턴 (한국어 + 영어)
    REQUEST_PATTERNS_KO = [
        r'.*해주세요',
        r'.*해 주세요',
        r'.*부탁드려요',
        r'.*부탁합니다',
        r'.*기대됩니다',
        r'.*기대해요',
        r'.*올려주세요',
        r'.*해주시면',
        r'.*하면 좋겠',
    ]

    REQUEST_PATTERNS_EN = [
        r'.*please\s+(make|do|show|upload|create|cover).*',
        r'.*can\s+you\s+(make|do|show|please).*',
        r'.*would\s+(love|like)\s+to\s+see.*',
        r'.*next\s+(video|time|episode).*',
        r'.*more\s+(videos?|content|episodes?)\s+(about|on|like).*',
        r'.*wish\s+you\s+(would|could).*',
        r'.*should\s+(make|do|cover|try).*',
        r'.*hope\s+(you|to\s+see).*',
        r'.*looking\s+forward\s+to.*',
        r'.*waiting\s+for.*',
        r'.*need\s+(a\s+)?(video|tutorial|guide).*',
    ]

    # 질문 패턴
    QUESTION_PATTERNS = [
        r'.*\?$',  # 물음표로 끝나는 댓글
        r'^(what|how|why|when|where|who|which|can|could|would|is|are|do|does|did)\s+.*',
        r'^(뭐|어떻게|왜|언제|어디|누가|무엇|어떤)\s*.*',
    ]

    # 긍정/부정 키워드 (한국어 + 영어)
    POSITIVE_WORDS = {
        # 한국어
        '좋아요', '좋다', '좋네요', '최고', '대박', '감사', '추천',
        '재미있', '유익', '도움', '멋지', '훌륭', '완벽', '사랑',
        '좋은', '재미', '감사합니다',
        # 영어
        'good', 'great', 'amazing', 'awesome', 'love', 'excellent',
        'fantastic', 'wonderful', 'best', 'perfect', 'helpful',
        'thanks', 'thank', 'nice', 'cool', 'incredible', 'brilliant',
        'loved', 'appreciate', 'useful', 'informative', 'like', 'liked'
    }

    NEGATIVE_WORDS = {
        # 한국어
        '별로', '싫어', '실망', '아쉬', '나쁘', '최악', '짜증',
        '불만', '화나', '후회', '지루', '재미없',
        # 영어
        'bad', 'terrible', 'awful', 'worst', 'hate', 'boring',
        'disappointing', 'disappointed', 'useless', 'waste', 'sucks',
        'poor', 'horrible', 'annoying', 'stupid', 'wrong', 'dislike'
    }

    def extract_frequent_words(
        self,
        comments: List[Dict[str, Any]]
    ) -> List[FrequentWord]:
        """
        Extract frequent words from comments.

        Args:
            comments: List of comment dictionaries with 'text' field

        Returns:
            List of FrequentWord objects (max 20), sorted by frequency
        """
        all_words = []
        for comment in comments:
            text = comment.get("text", "")
            # 한글, 영문, 숫자만 추출
            words = re.findall(r'[가-힣a-zA-Z0-9]+', text)
            # 불용어 및 짧은 단어 제거
            words = [w for w in words if len(w) > 1 and w not in self.STOPWORDS]
            all_words.extend(words)

        # 빈도수 계산
        counter = Counter(all_words)
        total = len(all_words) if all_words else 1

        # 상위 20개
        frequent = []
        for word, count in counter.most_common(20):
            frequent.append(FrequentWord(
                word=word,
                count=count,
                percentage=round(count / total * 100, 1)
            ))

        return frequent

    def extract_viewer_requests(
        self,
        comments: List[Dict[str, Any]]
    ) -> List[ViewerRequest]:
        """
        Extract viewer requests from comments based on patterns.

        Detects patterns like:
        - 한국어: ~해주세요, ~기대됩니다, ~부탁드려요
        - 영어: please make, can you, would love to see

        Args:
            comments: List of comment dictionaries

        Returns:
            List of ViewerRequest objects (max 10), sorted by like_count
        """
        requests = []
        patterns_ko = [re.compile(p) for p in self.REQUEST_PATTERNS_KO]
        patterns_en = [re.compile(p, re.IGNORECASE) for p in self.REQUEST_PATTERNS_EN]

        for comment in comments:
            text = comment.get("text", "")
            text_lower = text.lower()

            # 한국어 패턴 매칭
            matched = False
            for pattern in patterns_ko:
                if pattern.match(text):
                    matched = True
                    break

            # 영어 패턴 매칭
            if not matched:
                for pattern in patterns_en:
                    if pattern.match(text_lower):
                        matched = True
                        break

            if matched:
                requests.append(ViewerRequest(
                    text=text[:200],  # 긴 댓글 자르기
                    like_count=comment.get("like_count", 0),
                    author=comment.get("author_name", comment.get("author", "익명"))
                ))

        # 좋아요 순 정렬
        requests.sort(key=lambda x: x.like_count, reverse=True)

        return requests[:10]  # 상위 10개

    def analyze_sentiment(
        self,
        comments: List[Dict[str, Any]]
    ) -> SentimentAnalysis:
        """
        Analyze sentiment of comments using keyword-based approach.

        Categorizes comments into:
        - Positive: Contains more positive keywords
        - Negative: Contains more negative keywords
        - Neutral: Equal or no keywords

        Args:
            comments: List of comment dictionaries

        Returns:
            SentimentAnalysis with ratios and total count
        """
        if not comments:
            return SentimentAnalysis(
                positive=0,
                neutral=0,
                negative=0,
                total_analyzed=0
            )

        positive_count = 0
        negative_count = 0
        neutral_count = 0

        for comment in comments:
            text = comment.get("text", "").lower()

            # 긍정/부정 키워드 카운트
            pos_score = sum(1 for w in self.POSITIVE_WORDS if w in text)
            neg_score = sum(1 for w in self.NEGATIVE_WORDS if w in text)

            if pos_score > neg_score:
                positive_count += 1
            elif neg_score > pos_score:
                negative_count += 1
            else:
                neutral_count += 1

        total = len(comments)

        return SentimentAnalysis(
            positive=round(positive_count / total, 2),
            neutral=round(neutral_count / total, 2),
            negative=round(negative_count / total, 2),
            total_analyzed=total
        )

    def extract_viewer_questions(
        self,
        comments: List[Dict[str, Any]]
    ) -> List[ViewerQuestion]:
        """
        Extract questions from comments.

        Args:
            comments: List of comment dictionaries

        Returns:
            List of ViewerQuestion objects (max 10), sorted by like_count
        """
        questions = []
        patterns = [re.compile(p, re.IGNORECASE) for p in self.QUESTION_PATTERNS]

        for comment in comments:
            text = comment.get("text", "").strip()
            if len(text) < 5:  # 너무 짧은 댓글 제외
                continue

            for pattern in patterns:
                if pattern.match(text):
                    questions.append(ViewerQuestion(
                        text=text[:200],
                        like_count=comment.get("like_count", 0),
                        author=comment.get("author_name", comment.get("author", "익명"))
                    ))
                    break

        # 좋아요 순 정렬
        questions.sort(key=lambda x: x.like_count, reverse=True)
        return questions[:10]

    def extract_top_comments(
        self,
        comments: List[Dict[str, Any]]
    ) -> List[TopComment]:
        """
        Extract top engaging comments by likes.

        Args:
            comments: List of comment dictionaries

        Returns:
            List of TopComment objects (max 5), sorted by like_count
        """
        sorted_comments = sorted(
            comments,
            key=lambda x: x.get("like_count", 0),
            reverse=True
        )

        top_comments = []
        for comment in sorted_comments[:5]:
            text = comment.get("text", "").strip()
            if text:
                top_comments.append(TopComment(
                    text=text[:200],
                    like_count=comment.get("like_count", 0),
                    author=comment.get("author_name", comment.get("author", "익명"))
                ))

        return top_comments

    async def analyze_all(
        self,
        comments: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Execute all analysis operations.

        Args:
            comments: List of comment dictionaries

        Returns:
            Dictionary with all analysis results
        """
        return {
            "frequent_words": self.extract_frequent_words(comments),
            "viewer_requests": self.extract_viewer_requests(comments),
            "viewer_questions": self.extract_viewer_questions(comments),
            "top_comments": self.extract_top_comments(comments),
            "sentiment": self.analyze_sentiment(comments)
        }

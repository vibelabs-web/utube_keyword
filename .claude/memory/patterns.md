# Code Patterns

## 백엔드 패턴

### API 응답 형식
```python
# 성공 응답
{
  "data": { ... },
  "meta": { "timestamp": "..." }
}

# 에러 응답
{
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": []
  }
}
```

### 서비스 레이어 패턴
```python
class KeywordService:
    def __init__(self, db: AsyncSession, youtube_client: YouTubeClient):
        self.db = db
        self.youtube_client = youtube_client

    async def analyze(self, keyword: str) -> KeywordAnalysisResult:
        # 캐시 확인 → API 호출 → 저장 → 반환
        pass
```

## 프론트엔드 패턴

### 컴포넌트 구조
```tsx
// 기능별 폴더 구조
src/
  components/
    keyword/
      KeywordInput.tsx
      KeywordResult.tsx
    comment/
      CommentInput.tsx
      CommentResult.tsx
  hooks/
    useKeywordAnalysis.ts
    useCommentAnalysis.ts
```

### Zustand 스토어 패턴
```typescript
interface KeywordStore {
  keyword: string;
  result: KeywordResult | null;
  isLoading: boolean;
  analyze: (keyword: string) => Promise<void>;
}
```

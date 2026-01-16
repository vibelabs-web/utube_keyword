# Design System (기초 디자인 시스템)

> 유튜브 키워드 분석기 & 댓글 분석기 - 디자인 가이드

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 바이브코딩 채널의 성장 속도를 높이기 위해 잘 될 콘텐츠 주제를 데이터 기반으로 찾는다 |
| 2 | 페르소나 | 바이브코딩 유튜버 (구독자 5,000명, 영상 50개, 성장 가속화 희망) |
| 3 | 핵심 기능 | FEAT-1: 키워드 분석, FEAT-2: 댓글 분석 |
| 4 | 성공 지표 (노스스타) | 분석 도구를 통해 선정한 주제의 영상 조회수 10,000회 달성 |
| 5 | 입력 지표 | 주 1회 이상 키워드 분석 실행, 월 4회 이상 댓글 분석 실행 |
| 6 | 비기능 요구 | API 응답 시간 5초 이내, 웹 인터페이스 |
| 7 | Out-of-scope | 다른 사용자 서비스, 모바일 앱, 유료화, 인증 시스템 |
| 8 | Top 리스크 | 시간 부족으로 개발 중단 |
| 9 | 완화/실험 | MVP 기능 최소화, 1~2주 내 완료 목표, AI 코딩 활용 |
| 10 | 다음 단계 | YouTube Data API 키 발급 및 테스트 |

---

## 1. 디자인 철학

### 1.1 핵심 가치

| 가치 | 설명 | 구현 방법 |
|------|------|----------|
| **데이터 중심** | 정보가 명확하게 전달되어야 함 | 깔끔한 카드, 명확한 수치 표시 |
| **단순함** | 복잡함 없이 바로 사용 가능 | 최소한의 UI 요소, 직관적 흐름 |
| **전문성** | 데이터 분석 도구다운 느낌 | 차분한 컬러, 정돈된 레이아웃 |

### 1.2 참고 서비스 (무드보드)

| 서비스 | 참고할 점 | 참고하지 않을 점 |
|--------|----------|-----------------|
| **vidIQ** | 데이터 시각화 방식 | 복잡한 대시보드 |
| **노션** | 깔끔한 레이아웃, 여백 | 모노톤 컬러 |
| **Linear** | 전문적인 느낌, 다크 모드 옵션 | 과한 애니메이션 |

---

## 2. 컬러 팔레트

### 2.1 역할 기반 컬러

| 역할 | 컬러명 | Hex | 사용처 |
|------|--------|-----|--------|
| **Primary** | YouTube Red | `#FF0000` | 주요 버튼, 강조 (유튜브 연관성) |
| **Primary Dark** | Dark Red | `#CC0000` | 호버 상태 |
| **Secondary** | Slate Blue | `#475569` | 보조 버튼, 아이콘 |
| **Surface** | White | `#FFFFFF` | 카드 배경 |
| **Background** | Slate 50 | `#F8FAFC` | 전체 배경 |
| **Text Primary** | Slate 900 | `#0F172A` | 주요 텍스트 |
| **Text Secondary** | Slate 500 | `#64748B` | 보조 텍스트 |
| **Border** | Slate 200 | `#E2E8F0` | 테두리 |

### 2.2 피드백 컬러

| 상태 | 컬러 | Hex | 사용처 |
|------|------|-----|--------|
| **Success** | Emerald | `#10B981` | 성공, 높은 검색량, 긍정 감성 |
| **Warning** | Amber | `#F59E0B` | 주의, 중간 경쟁도 |
| **Error** | Red | `#EF4444` | 오류, 높은 경쟁도, 부정 감성 |
| **Info** | Blue | `#3B82F6` | 정보, 안내 |

### 2.3 경쟁도 표시 컬러

| 경쟁도 | 컬러 | Hex | 의미 |
|--------|------|-----|------|
| Low | Emerald | `#10B981` | 좋은 기회 |
| Medium | Amber | `#F59E0B` | 적당한 경쟁 |
| High | Red | `#EF4444` | 높은 경쟁 |

### 2.4 다크 모드 (v2)

- MVP에서는 라이트 모드만 지원
- TailwindCSS dark: 클래스로 v2에서 쉽게 추가 가능

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

| 용도 | 폰트 | 대안 |
|------|------|------|
| 본문 | Pretendard | system-ui, -apple-system, sans-serif |
| 숫자/데이터 | Roboto Mono | monospace |

### 3.2 타입 스케일

| 이름 | 크기 | 굵기 | 용도 |
|------|------|------|------|
| Display | 32px | Bold (700) | 페이지 제목 |
| H1 | 24px | Bold (700) | 섹션 제목 |
| H2 | 20px | SemiBold (600) | 카드 제목 |
| H3 | 16px | SemiBold (600) | 서브 제목 |
| Body Large | 16px | Regular (400) | 강조 본문 |
| Body | 14px | Regular (400) | 기본 본문 |
| Caption | 12px | Regular (400) | 부가 정보, 라벨 |
| **Data** | 28px | Bold (700) | 큰 숫자 (검색량 등) |
| **Data Small** | 18px | SemiBold (600) | 중간 숫자 |

---

## 4. 간격 토큰 (Spacing)

| 이름 | 값 | Tailwind | 용도 |
|------|-----|----------|------|
| xs | 4px | space-1 | 아이콘-텍스트 간격 |
| sm | 8px | space-2 | 요소 내부 여백 |
| md | 16px | space-4 | 요소 간 간격 |
| lg | 24px | space-6 | 섹션 간 간격 |
| xl | 32px | space-8 | 큰 섹션 구분 |
| 2xl | 48px | space-12 | 페이지 여백 |

---

## 5. 기본 컴포넌트

### 5.1 버튼 (Button)

| 상태 | Primary | Secondary | Ghost |
|------|---------|-----------|-------|
| 기본 | bg-red-600 text-white | border-slate-300 text-slate-700 | text-slate-600 |
| 호버 | bg-red-700 | bg-slate-50 | underline |
| 포커스 | ring-2 ring-red-500 | ring-2 ring-slate-400 | ring-2 ring-slate-400 |
| 비활성 | opacity-50 cursor-not-allowed | opacity-50 | opacity-50 |
| 로딩 | spinner + "분석 중..." | spinner | spinner |

**크기:**
```css
/* Large */
.btn-lg { @apply px-6 py-3 text-base; }

/* Medium (기본) */
.btn-md { @apply px-4 py-2 text-sm; }

/* Small */
.btn-sm { @apply px-3 py-1.5 text-xs; }
```

### 5.2 입력 필드 (Input)

```css
/* 기본 */
.input {
  @apply w-full px-4 py-2 border border-slate-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
  @apply placeholder:text-slate-400;
}

/* 에러 */
.input-error {
  @apply border-red-500 focus:ring-red-500;
}
```

### 5.3 카드 (Card)

```css
.card {
  @apply bg-white rounded-xl border border-slate-200;
  @apply shadow-sm p-4;
}

.card-hover {
  @apply hover:shadow-md transition-shadow;
}
```

### 5.4 데이터 카드 (Stat Card)

```html
<div class="card text-center">
  <p class="text-sm text-slate-500 mb-1">검색량</p>
  <p class="text-3xl font-bold text-slate-900">12,000</p>
  <p class="text-xs text-slate-400">/월</p>
</div>
```

### 5.5 탭 (Tab)

```css
.tab {
  @apply px-4 py-2 text-sm font-medium text-slate-600;
  @apply border-b-2 border-transparent;
  @apply hover:text-slate-900 hover:border-slate-300;
}

.tab-active {
  @apply text-red-600 border-red-600;
}
```

### 5.6 뱃지 (Badge)

```css
/* 경쟁도 뱃지 */
.badge-low { @apply bg-emerald-100 text-emerald-700; }
.badge-medium { @apply bg-amber-100 text-amber-700; }
.badge-high { @apply bg-red-100 text-red-700; }

/* 기본 스타일 */
.badge {
  @apply inline-flex items-center px-2 py-0.5 rounded text-xs font-medium;
}
```

---

## 6. 레이아웃

### 6.1 페이지 구조

```
┌────────────────────────────────────────────────────────┐
│  Header (로고, 탭 네비게이션)                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Main Content                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │  검색/입력 영역                                 │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 데이터 1 │  │ 데이터 2 │  │ 데이터 3 │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │  상세 결과 영역                                 │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Footer (API 상태, 버전)                               │
└────────────────────────────────────────────────────────┘
```

### 6.2 반응형 그리드

```css
/* 통계 카드 그리드 */
.stat-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

/* 결과 리스트 */
.result-list {
  @apply space-y-3;
}
```

### 6.3 컨테이너

```css
.container {
  @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

---

## 7. 접근성 체크리스트

### 7.1 필수 (MVP)

- [x] **색상 대비**: 텍스트와 배경 대비율 4.5:1 이상 확보
- [x] **포커스 링**: ring-2로 키보드 탐색 시 명확한 포커스 표시
- [x] **클릭 영역**: 버튼/링크 최소 44x44px
- [x] **에러 표시**: 색상 + 텍스트 + 아이콘 병행
- [x] **폰트 크기**: 본문 최소 14px

### 7.2 권장 (v2)

- [ ] 키보드 전체 탐색 가능
- [ ] 스크린 리더 호환 (ARIA 라벨)
- [ ] 다크 모드 지원

---

## 8. 아이콘

### 8.1 아이콘 라이브러리

**선택: Lucide React**
- 깔끔한 라인 스타일
- React 컴포넌트로 바로 사용
- TailwindCSS와 잘 어울림

### 8.2 주요 아이콘

| 용도 | 아이콘 | 사용처 |
|------|--------|--------|
| 검색 | `Search` | 키워드 입력 |
| 분석 | `BarChart2` | 분석 결과 |
| 댓글 | `MessageSquare` | 댓글 분석 |
| 트렌드 | `TrendingUp` | 검색량 상승 |
| 경고 | `AlertCircle` | 경고/주의 |
| 성공 | `CheckCircle` | 완료/성공 |
| 로딩 | `Loader2` | 로딩 스피너 |
| 외부 링크 | `ExternalLink` | 유튜브로 이동 |

### 8.3 아이콘 사용 규칙

```jsx
// 크기
<Search className="w-4 h-4" />  // 작음
<Search className="w-5 h-5" />  // 기본
<Search className="w-6 h-6" />  // 큼

// 버튼 내
<button className="flex items-center gap-2">
  <Search className="w-4 h-4" />
  <span>검색</span>
</button>
```

---

## 9. 로딩 상태

### 9.1 스피너

```jsx
<Loader2 className="w-5 h-5 animate-spin text-red-600" />
```

### 9.2 스켈레톤

```css
.skeleton {
  @apply bg-slate-200 animate-pulse rounded;
}
```

```jsx
// 데이터 카드 스켈레톤
<div className="card">
  <div className="skeleton h-4 w-16 mb-2" />
  <div className="skeleton h-8 w-24" />
</div>
```

---

## Decision Log

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2024-01-17 | YouTube Red를 Primary 컬러로 | 유튜브 분석 도구임을 직관적으로 전달 |
| 2024-01-17 | Lucide React 아이콘 | 가볍고 React 친화적 |
| 2024-01-17 | 라이트 모드 우선 | MVP 빠른 개발, 다크 모드는 v2 |
| 2024-01-17 | 카드 기반 데이터 표시 | 데이터 시각화에 적합, 확장 용이 |

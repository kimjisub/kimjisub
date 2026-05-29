# 블로그 포스트 형식 레퍼런스

## 폴더 구조

```
src/blog/{YYYY-MM-DD-slug}/
├── index.mdx       # 본문 (필수)
└── assets/         # 글 전용 이미지 (선택)
```

- slug은 영문 kebab-case. 날짜는 작성일 기준 ISO.
- codegen 불필요 — 런타임에 디렉토리를 직접 읽는다.

## 메타데이터 (index.mdx 최상단 export)

```tsx
export const meta = {
  title: "글 제목",
  date: "2026-05-15",              // ISO 날짜
  description: "한두 문장 요약 — 목록/SEO에 노출됨",
  author: "Kim Jisub",
  keywords: ["키워드1", "키워드2"], // SEO용
  tags: ["AI", "개발철학"],         // 분류 태그
  image: "/blog/{slug}/cover.jpg",  // 선택 — 커버 이미지 (public 경로)
  readingTime: "10분",
  category: "개발",
  published: false                  // 검토 끝나면 true
}
```

- `published: false`면 목록에 안 뜬다. 초안은 항상 false로 시작.
- `image`는 `public/blog/{slug}/` 경로다. 없으면 필드를 빼도 빌드는 깨지지 않는다.

## 본문 작성

메타 export 아래에 마크다운으로 본문을 쓴다. 최상위 제목(`#`)은 보통 쓰지 않고 `##`부터 시작한다 (title이 메타에 있으므로).

```mdx
export const meta = { /* ... */ }

## 첫 섹션

본문...
```

## 사용 가능한 MDX 컴포넌트

이미지가 필요하면 `assets/`에 두고 import한다. 존재하지 않는 이미지를 import하지 않는다 (`ls assets/`로 먼저 확인).

```mdx
import Image from 'next/image';
import { ImageGrid, PhoneScreens, SideBySide } from '@/components/ImageGrid';
import img1 from './assets/content-1.png';

<Image src={img1} alt="설명" />

<SideBySide ratio="1:1">
  <Image src={img1} alt="" />
  <Image src={img2} alt="" />
</SideBySide>

<ImageGrid cols={3}>
  <Image src={img1} alt="" />
</ImageGrid>

<PhoneScreens>
  <Image src={screen1} alt="" />
</PhoneScreens>
```

- `<ImageGrid cols={2|3|4}>` — 이미지 그리드
- `<SideBySide ratio="1:1|1:2|2:1">` — 좌우 배치
- `<PhoneScreens>` — 모바일 스크린샷 (폰 프레임)

## 본문 소스 코드 블록은 기본적으로 쓰지 않는다

이 블로그의 무게중심은 "어떻게 구현했는가"가 아니라 "왜 그렇게 판단했는가"에 있다 (자세한 근거는 SKILL.md "톤과 글의 성격"). 그래서 글에 소스 코드를 첨부할 일은 **웬만하면 없다.** 같은 내용은 보통 산문·비유·표로 충분히 풀린다.

- 기술적 동작·아키텍처·의사결정은 산문·비유·표로 설명한다.
- 식별자나 짧은 명령어는 인라인 코드(`revalidate`, `pnpm dev` 같은)로 자유롭게 쓴다.
- 데이터·구조를 보여줘야 할 때는 코드 펜스 대신 마크다운 표를 우선 고려한다.
- 위 MDX import 예시는 글 작성 방법을 설명하기 위한 것이지, 본문에 그런 블록을 노출하라는 뜻이 아니다.

**예외**: 코드 그 자체가 글의 의도와 분리될 수 없을 때(특정 시그니처가 논점인 경우, 짧은 한 토막이 글의 펀치라인인 경우)는 코드 블록을 써도 된다. 단, "코드를 보여줘야겠다"는 충동이 들면 먼저 산문으로 바꿔본 뒤에도 정말 필요한지 한 번 더 묻는다.

## 검증

- MDX는 JSX이므로 import한 컴포넌트/이미지 경로가 실제로 존재해야 빌드된다.
- 작성 후 dev 서버(`pnpm dev`)에서 `/blog/{slug}`로 직접 접근해 렌더를 확인한다 (published: false여도 직접 URL은 열린다).

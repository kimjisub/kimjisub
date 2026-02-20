# CLAUDE.md — kimjisub 포트폴리오 웹사이트

## 프로젝트 개요

개인 포트폴리오 웹사이트. 프로젝트, 경력, 기술 스택, 블로그를 보여주는 사이트.

- **프레임워크**: Next.js 16 (App Router) + React 19
- **언어**: TypeScript 5 (strict mode)
- **스타일링**: Tailwind CSS 3.4 + Radix UI Themes
- **콘텐츠**: MDX (`@mdx-js/loader` + `@next/mdx`)
- **DB**: PostgreSQL (Supabase) via Prisma 7
- **패키지 매니저**: pnpm

## 주요 명령어

```bash
pnpm dev              # 개발 서버 (포트 32957) + codegen watch 동시 실행
pnpm build            # 빌드 (prebuild에서 codegen 자동 실행)
pnpm start            # 프로덕션 서버
pnpm lint             # ESLint
pnpm codegen          # _index.ts, _graph.json 수동 재생성
```

## 디렉토리 구조

```
src/
├── app/                  # Next.js App Router (라우팅)
│   ├── (with-layout)/    # 헤더/푸터 포함 레이아웃 (/, /projects, /blog 등)
│   └── (without-layout)/ # 최소 레이아웃 (/graph, /api 등)
├── content/              # 포트폴리오 콘텐츠 (projects, careers, skills)
├── blog/                 # 블로그 포스트 (MDX)
├── components/           # React 컴포넌트
├── icon/                 # 커스텀 아이콘 레지스트리
├── lib/                  # 서버 유틸리티 (Prisma, auth 등)
├── api/                  # 서버 사이드 API 레이어
├── hooks/                # 커스텀 React hooks
├── contexts/             # React contexts
├── types/                # TypeScript 타입 정의
├── utils/                # 유틸리티 함수
└── styles/               # 글로벌 CSS
scripts/
├── codegen/              # 코드 생성 스크립트 (_index.ts, _graph.json)
└── notion-to-local.ts    # Notion → 로컬 파일 변환
public/content/           # 정적 콘텐츠 에셋 (직접 URL 제공용)
```

## 콘텐츠 추가 방법

### 포트폴리오 콘텐츠 (projects / careers / skills)

각 콘텐츠는 `src/content/{category}/{slug}/` 폴더 구조:

```
src/content/projects/{slug}/
├── meta.tsx       # 메타데이터 (필수)
├── index.mdx      # 본문 (선택)
└── assets/        # 이미지 (icon.png, cover.jpg, content-*.png 등)
```

#### meta.tsx 작성법

```tsx
import icon from './assets/icon.png';
import cover from './assets/cover.jpg';
import type { ProjectMeta } from '@/content/types';

export const meta: ProjectMeta = {
  id: 'my-project',           // 폴더명과 반드시 일치
  title: '프로젝트 이름',
  visible: true,
  '설명': '한 줄 설명',
  '날짜': '2024-01-01',       // ISO 날짜
  '중요도': '높음',            // '높음' | '중간' | '낮음'
  '분류': ['개인 프로젝트'],
  '프로그래밍 언어': ['typescript', 'python'],  // skill slug
  '주요 기술': ['react', 'nextjs'],             // skill slug
  '갤러리에서 보기': true,
  icon,
  cover,
};
```

- 타입 정의: `src/content/types.ts` (`ProjectMeta`, `CareerMeta`, `SkillMeta`)
- `'프로그래밍 언어'`, `'주요 기술'` 등의 값은 `src/content/skills/` 폴더의 slug과 매칭

#### index.mdx 작성법

```mdx
import Image from 'next/image';
import { ImageGrid, PhoneScreens, SideBySide } from '@/components/ImageGrid';
import img1 from './assets/content-1.png';
import img2 from './assets/content-2.png';

## 프로젝트 제목

설명 텍스트...

<SideBySide>
  <Image src={img1} alt="설명" />
  <Image src={img2} alt="설명" />
</SideBySide>

<ImageGrid cols={3}>
  <Image src={img1} alt="" />
  <Image src={img2} alt="" />
  <Image src={img3} alt="" />
</ImageGrid>

<PhoneScreens>
  <Image src={screen1} alt="" />
  <Image src={screen2} alt="" />
</PhoneScreens>
```

MDX에서 사용 가능한 레이아웃 컴포넌트:
- `<ImageGrid cols={2|3|4}>` — 이미지 그리드
- `<PhoneScreens>` — 모바일 스크린샷 (폰 프레임)
- `<SideBySide ratio="1:1|1:2|2:1">` — 좌우 배치

#### 콘텐츠 추가 후 필수 작업

```bash
pnpm codegen   # _index.ts, _graph.json 재생성 (dev 모드에서는 자동)
```

이 명령은 다음 파일을 자동 생성함 (직접 수정 금지):
- `src/content/projects/_index.ts`
- `src/content/careers/_index.ts`
- `src/content/skills/_index.ts`
- `src/content/_graph.json`

### 블로그 포스트

폴더 구조: `src/blog/{YYYY-MM-DD-slug}/index.mdx`

```mdx
export const meta = {
  title: "글 제목",
  date: "2025-06-17",
  description: "설명",
  author: "Kim Jisub",
  tags: ["태그1", "태그2"],
  readingTime: "10분",
  category: "개발",
  published: true
}

## 본문 시작
```

- codegen 불필요 — 런타임에 디렉토리를 직접 읽음
- `published: false`로 설정하면 비공개

## 에셋 관리

- 콘텐츠 이미지: `src/content/{category}/{slug}/assets/`에 배치
- 이미지 네이밍: `icon.png`, `cover.jpg`, `content-1.png`, `content-2.png`, ...
- `meta.tsx`에서 `import`하여 Next.js 이미지 최적화 활용
- SVG는 `@svgr/webpack`을 통해 React 컴포넌트로 import 가능

## 배포

- **PM2**로 프로세스 관리 (`ecosystem.config.cjs`)
- 현재 dev 모드로 운영: `next dev --port 32957 --hostname 127.0.0.1`
- **Tailscale**을 통해 접근: `kimjisub-openclaw.tail07a0c6.ts.net`
- 별도 CI/CD 없음 — 서버에서 직접 실행

```bash
# 프로덕션 빌드 & 실행
pnpm build-and-start

# PM2로 재시작
pm2 restart kimjisub-web
```

## 라우팅 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 (히어로, 소개, 프로젝트, 기술, 블로그 미리보기 등 섹션) |
| `/projects` | 프로젝트 목록 |
| `/projects/[projectId]` | 프로젝트 상세 |
| `/careers` | 경력 목록 |
| `/careers/[careerId]` | 경력 상세 |
| `/skills` | 기술 스택 |
| `/skills/[skillId]` | 기술 상세 |
| `/blog` | 블로그 목록 |
| `/blog/[slug]` | 블로그 포스트 |
| `/graph` | D3 포스 그래프 시각화 |
| `/uses` | 사용 도구/장비 |

## 코드 컨벤션

- Path alias: `@/*` → `src/*`
- 한글 필드명 사용 (`'설명'`, `'날짜'` 등) — Notion 원본 필드명 유지
- `visible: false`인 콘텐츠는 목록에서 숨김
- ISR: 상세/목록 페이지는 `revalidate = 3600` (1시간)

## 환경 변수

`.env` 파일 필요 (커밋하지 않음):
- `DATABASE_URL` — Supabase 연결 (pgbouncer pooler)
- `DIRECT_URL` — Supabase 직접 연결 (마이그레이션용)
- `ANTHROPIC_API_KEY` — AI 터미널 기능용

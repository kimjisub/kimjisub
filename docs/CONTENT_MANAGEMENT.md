# 정적 콘텐츠 관리 시스템

이 문서는 kimjisub.com 포트폴리오 사이트의 정적 콘텐츠 관리 방법론을 설명합니다.

## 개요

- **SSG (Static Site Generation)**: 빌드 타임에 모든 페이지 생성
- **파일 기반 CMS**: Notion 대신 로컬 JSON/MD 파일 사용
- **관계 그래프**: prebuild에서 역방향 관계 자동 계산

---

## 콘텐츠 유형 (4종)

| 유형 | 위치 | 설명 |
|------|------|------|
| **Projects** | `src/content/projects/` | 프로젝트 포트폴리오 |
| **Skills** | `src/content/skills/` | 기술 스택 |
| **Careers** | `src/content/careers/` | 경력, 수상, 활동 |
| **Blog** | `src/blog/` | MDX 블로그 포스트 |

---

## 폴더 구조

### Source of Truth (SOT)

```
src/
├── content/                    # 정적 콘텐츠 (SOT)
│   ├── projects/
│   │   ├── _index.json        # 전체 목록 인덱스
│   │   └── [slug]/
│   │       ├── meta.json      # 메타데이터
│   │       ├── index.md       # 상세 콘텐츠 (마크다운)
│   │       ├── cover.webp     # 커버 이미지
│   │       └── icon.png       # 아이콘
│   │
│   ├── skills/
│   │   ├── _index.json
│   │   ├── _map.json          # ID → slug 매핑
│   │   └── [slug]/
│   │       ├── meta.json
│   │       └── icon.svg       # 아이콘 (skills는 index.md 없음)
│   │
│   ├── careers/
│   │   ├── _index.json
│   │   ├── _map.json
│   │   └── [slug]/
│   │       ├── meta.json
│   │       ├── index.md
│   │       ├── cover.jpg
│   │       └── icon.png
│   │
│   └── _graph.json            # 전체 관계 그래프 (prebuild 생성)
│
├── blog/                       # 블로그 (MDX)
│   └── YYYY-MM-DD-title.mdx
│
└── api/notion/                 # API 레이어 (로컬 파일 읽기)
    ├── index.ts
    ├── projects.ts
    ├── skills.ts
    └── careers.ts
```

### 이미지 서빙

```
public/
└── content -> ../src/content   # 심링크 (prebuild에서 생성)
```

- **심링크 방식**: `public/content`가 `src/content`를 가리킴
- **서빙 경로**: `/content/projects/unipad/icon.png`
- **Next.js Image 최적화**: 심링크를 통해 자동 적용

---

## 메타데이터 스키마

### Project (`meta.json`)

```json
{
  "id": "72fff05b-...",
  "slug": "unipad",
  "title": "UniPad",
  "description": "500+만 다운로드를 달성한 런치패드 기반의 연주형 리듬게임",
  "date": {
    "start": "2016-02-16",
    "end": null
  },
  "github": "https://github.com/kimjisub/unipad-android",
  "youtube": null,
  "url": "https://play.google.com/store/apps/details?id=...",
  "importance": "1",
  "tags": [{ "name": "오픈소스", "color": "default" }],
  "categories": [{ "name": "개인 프로젝트", "color": "red" }],
  "assignedTasks": [{ "name": "책임자", "color": "red" }],
  
  // 관계 (slug 배열)
  "techSkills": ["android", "nodejs", "firebase"],
  "languages": ["java", "kotlin", "javascript"],
  "relatedCareers": ["제-33회-정보올림피아드-공모-부문"]
}
```

### Skill (`meta.json`)

```json
{
  "id": "a18fd511-...",
  "slug": "android",
  "title": "Android",
  "iconSlug": "android",
  "iconColor": null,
  "description": null,
  "category": ["OS"],
  "proficiency": "3. 상급",
  "visible": true,
  
  // 관계 (ID 배열 - 레거시)
  "parentSkills": [],
  "childSkills": [],
  "relatedSkills": ["08bcbabe-..."],
  
  // 역방향 관계 (prebuild에서 추가, slug 배열)
  "projectsUsingAsSkill": ["unipad", "mopl", "stella"],
  "projectsUsingAsLanguage": []
}
```

### Career (`meta.json`)

```json
{
  "id": "cf1cc337-...",
  "slug": "제-33회-정보올림피아드-공모-부문",
  "title": "제 33회 정보올림피아드 공모 부문",
  "description": null,
  "date": { "start": "2016-07-01", "end": null },
  "institutions": [{ "name": "KOI", "color": "red" }],
  "categories": [{ "name": "공모전", "color": "orange" }],
  "awardsAndCertifications": "전국 금상",
  
  // 역방향 관계 (prebuild에서 추가)
  "relatedProjects": ["unipad"]
}
```

---

## 관계 모델링

### 정방향 관계 (마이그레이션 시 저장)

| From | To | Field | 저장 방식 |
|------|----|-------|----------|
| Project | Skill | `techSkills` | slug 배열 |
| Project | Skill | `languages` | slug 배열 |
| Project | Career | `relatedCareers` | slug 배열 |

### 역방향 관계 (prebuild에서 계산)

| From | To | Field | 설명 |
|------|----|-------|------|
| Skill | Project | `projectsUsingAsSkill` | 이 스킬을 기술로 사용하는 프로젝트 |
| Skill | Project | `projectsUsingAsLanguage` | 이 스킬을 언어로 사용하는 프로젝트 |
| Career | Project | `relatedProjects` | 이 커리어와 연결된 프로젝트 |

### 관계 그래프 (`_graph.json`)

```json
{
  "skillToProjects": {
    "firebase": ["alpaconnect", "unipad", "mopl", ...],
    "nodejs": ["alpaconnect", "hana", ...],
    ...
  },
  "languageToProjects": {
    "typescript": ["alpaconnect", "candid-erp", ...],
    ...
  },
  "careerToProjects": {
    "제-33회-정보올림피아드-공모-부문": ["unipad"],
    ...
  },
  "generatedAt": "2026-02-18T09:16:42.123Z"
}
```

---

## 빌드 파이프라인

### 1. prebuild (`npm run prebuild`)

```bash
npx tsx scripts/build-relations.ts
```

**수행 작업:**

1. **심링크 생성**: `public/content` → `../src/content`
2. **프로젝트 로드**: 모든 `projects/*/meta.json` 읽기
3. **역방향 관계 계산**:
   - project.techSkills → skill.projectsUsingAsSkill
   - project.languages → skill.projectsUsingAsLanguage  
   - project.relatedCareers → career.relatedProjects
4. **meta.json 업데이트**: 각 skill/career 파일에 역방향 관계 추가
5. **_graph.json 생성**: 전체 관계 그래프 저장

### 2. build (`npm run build`)

```bash
next build
```

**수행 작업:**

1. API 레이어가 `src/content/`에서 데이터 로드
2. `generateStaticParams()`로 모든 동적 라우트 생성
3. SSG로 모든 페이지 정적 생성
4. Next.js Image 최적화 적용

### 빌드 흐름도

```
┌─────────────────┐
│ npm run build   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌────────────────────────────┐
│    prebuild     │────▶│ 1. 심링크 생성              │
│                 │     │ 2. 역방향 관계 계산         │
│                 │     │ 3. meta.json 업데이트       │
│                 │     │ 4. _graph.json 생성         │
└────────┬────────┘     └────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌────────────────────────────┐
│   next build    │────▶│ 1. 로컬 파일에서 데이터 로드 │
│                 │     │ 2. SSG 페이지 생성 (321개)  │
│                 │     │ 3. 이미지 최적화            │
└─────────────────┘     └────────────────────────────┘
```

---

## Git 관리

### 커밋되는 파일

| 경로 | 설명 | Git |
|------|------|-----|
| `src/content/**` | 원본 콘텐츠 (SOT) | ✅ 커밋 |
| `src/content/_graph.json` | 관계 그래프 | ✅ 커밋 |
| `public/content` | 심링크 | ✅ 커밋 (심링크 자체) |
| `scripts/build-relations.ts` | prebuild 스크립트 | ✅ 커밋 |
| `scripts/migrate-notion.ts` | 1회성 마이그레이션 | ✅ 커밋 (참고용) |

### 커밋되지 않는 파일

| 경로 | 설명 |
|------|------|
| `.next/` | 빌드 결과물 |
| `node_modules/` | 의존성 |

### 작업 흐름

```
1. 콘텐츠 수정 (src/content/**/meta.json, index.md)
2. 로컬 빌드 테스트 (npm run build)
3. 커밋 & 푸시
4. Vercel 자동 배포 (prebuild → build)
```

---

## 스크립트

### `scripts/migrate-notion.ts`

Notion에서 데이터를 1회성으로 마이그레이션하는 스크립트.

```bash
NOTION_SECRET=xxx npx tsx scripts/migrate-notion.ts
```

**기능:**
- Notion API로 Projects/Skills/Careers 데이터 fetch
- 이미지 다운로드 (cover, icon)
- slug 기반 폴더 구조 생성
- `meta.json`, `index.md` 파일 생성

### `scripts/build-relations.ts`

prebuild에서 실행되는 관계 계산 스크립트.

```bash
npx tsx scripts/build-relations.ts
```

**기능:**
- `public/content` 심링크 생성
- 역방향 관계 계산 및 meta.json 업데이트
- `_graph.json` 전체 관계 그래프 생성

---

## API 레이어

### 위치

`src/api/notion/` (이름은 레거시, 실제로는 로컬 파일 읽기)

### 주요 함수

| 함수 | 파일 | 설명 |
|------|------|------|
| `getProjects()` | `projects.ts` | 전체 프로젝트 목록 |
| `getProject(id)` | `project.ts` | 단일 프로젝트 + 관계 해결 |
| `getProjectPage(id)` | `project.ts` | 프로젝트 마크다운 콘텐츠 |
| `getSkills()` | `skills.ts` | 전체 스킬 목록 |
| `getSkill(id)` | `skill.ts` | 단일 스킬 + 관계 해결 |
| `getCareers()` | `careers.ts` | 전체 커리어 목록 |
| `getCareer(id)` | `career.ts` | 단일 커리어 + 관계 해결 |

### ID = Slug

API에서 `id`는 실제로 `slug`와 동일합니다. URL 라우팅과 데이터 조회 모두 slug 기반.

```typescript
// URL: /projects/unipad
// id = "unipad" (= slug)
const { project } = await getProject("unipad");
```

---

## 블로그 (Blog)

블로그는 다른 콘텐츠와 별도로 MDX 파일 기반으로 관리됩니다.

### 위치

```
src/blog/
├── 2025-06-17-nextjs-blog.mdx
└── 2026-02-18-second-brain.mdx
```

### 프론트매터

```yaml
---
title: "제목"
description: "설명"
date: "2026-02-18"
tags: ["tag1", "tag2"]
---
```

### 특징

- MDX (마크다운 + React 컴포넌트)
- 파일 시스템 기반 라우팅
- 다른 콘텐츠(projects/skills/careers)와 관계 없음

---

## 콘텐츠 추가 가이드

### 새 프로젝트 추가

1. `src/content/projects/[slug]/` 폴더 생성
2. `meta.json` 작성 (위 스키마 참고)
3. `index.md` 작성 (상세 설명)
4. 이미지 추가 (`cover.*, icon.*`)
5. `npm run build`로 관계 자동 계산
6. 커밋 & 푸시

### 새 스킬 추가

1. `src/content/skills/[slug]/` 폴더 생성
2. `meta.json` 작성
3. 아이콘 추가 (`icon.*`)
4. 프로젝트의 `techSkills`/`languages`에 slug 추가
5. `npm run build`로 역방향 관계 자동 계산

### 새 커리어 추가

1. `src/content/careers/[slug]/` 폴더 생성
2. `meta.json` 작성
3. `index.md` 작성 (선택)
4. 이미지 추가 (선택)
5. 프로젝트의 `relatedCareers`에 slug 추가
6. `npm run build`로 역방향 관계 자동 계산

---

## 마이그레이션 히스토리

| 날짜 | 작업 | 커밋 |
|------|------|------|
| 2026-02-18 | Notion → 로컬 파일 전환 | `4d1b6f2` |
| 2026-02-18 | prebuild 역방향 관계 계산 추가 | `765cb15` |
| 2026-02-18 | API 레이어 로컬 파일 기반으로 변경 | `1250815` |
| 2026-02-18 | 이미지 서빙 심링크 방식 적용 | `7738230` |
| 2026-02-18 | NotionRenderer → MarkdownRenderer 교체 | `3144f90` |

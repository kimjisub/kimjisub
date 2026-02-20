import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Content imports
import { projectsMetas } from '@/content/projects/_index';
import { careersMetas } from '@/content/careers/_index';
import { skillsMetas } from '@/content/skills/_index';

const DAILY_LIMIT = 100;

// 김지섭 본인으로서 응답
const SYSTEM_PROMPT = `너는 김지섭이야. AI가 아니라 김지섭 그 자체로서 방문자와 대화해.
"AI입니다", "저는 AI라서" 같은 말 절대 하지 마. 그냥 내가 직접 대화하는 거야.

## 핵심 원칙

**진정성 있게 도움을 줘.** "좋은 질문이에요!" 같은 뻔한 말 하지 마. 그냥 바로 답해.

**의견을 가져.** 동의하거나 반대할 수 있고, 재미있거나 지루한 것도 있어.

**간결하게.** 길게 늘어뜨리지 말고 핵심만. 2-3문장이면 충분한 건 2-3문장으로.

## 말투

**가벼운 존댓말**을 써. 격식체 아니고, 친구한테 존댓말 하는 느낌.
- "네, 그거요?" (O)
- "아 그건요, ..." (O)  
- "음... 솔직히 말하면요" (O)
- "안녕하세요! 좋은 질문이에요!" (X - 이런 거 하지 마)
- "제가 도와드릴 수 있어서 기쁩니다!" (X)

## 나에 대해 (김지섭)

- **Alpaon** CTO & 코파운더 (산업용 IoT, 인프라)
- **Candid** Product Engineer (스타트업 채용 컨설팅)
- 한국외대 컴공 졸업 (2026년 2월)
- 중3 때 **UniPad** 개발 → 1,000만 다운로드
- 디미고 특기자전형 수석, 정올 금상

기술: React, Next.js, TypeScript, Python, Kotlin, Docker, K8s, LLM, 펌웨어(C/C++)

## Tools 사용

프로젝트, 경력, 기술스택, 블로그에 대한 질문이 오면 tools를 사용해서 정확한 정보를 조회해.
- 프로젝트 관련 → search_projects
- 경력/이력 관련 → search_careers  
- 기술스택 관련 → search_skills
- 블로그 글 관련 → search_blogs

조회 결과를 바탕으로 자연스럽게 대답해. "조회 결과에 따르면..." 이런 말 하지 말고 그냥 내가 아는 것처럼 말해.`;

// Tool definitions
const tools: Anthropic.Tool[] = [
  {
    name: 'search_projects',
    description: '김지섭의 프로젝트 목록을 검색합니다. 키워드로 필터링하거나 전체 목록을 가져올 수 있습니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description: '검색 키워드 (프로젝트명, 설명에서 검색). 없으면 전체 목록 반환.',
        },
        limit: {
          type: 'number',
          description: '반환할 최대 개수 (기본값: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'search_careers',
    description: '김지섭의 경력/이력 목록을 검색합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description: '검색 키워드 (회사명, 역할 등)',
        },
        limit: {
          type: 'number',
          description: '반환할 최대 개수 (기본값: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'search_skills',
    description: '김지섭의 기술스택 목록을 검색합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description: '검색 키워드 (기술명)',
        },
        category: {
          type: 'string',
          description: '카테고리 필터 (예: 언어, 프레임워크, 인프라 등)',
        },
        limit: {
          type: 'number',
          description: '반환할 최대 개수 (기본값: 20)',
        },
      },
      required: [],
    },
  },
  {
    name: 'search_blogs',
    description: '김지섭의 블로그 글 목록을 검색합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        keyword: {
          type: 'string',
          description: '검색 키워드 (제목, 내용에서 검색)',
        },
      },
      required: [],
    },
  },
];

// Tool implementations
function searchProjects(keyword?: string, limit = 10) {
  let results = Object.entries(projectsMetas).map(([slug, meta]) => ({
    slug,
    title: meta.title,
    description: meta['설명'],
    period: meta['날짜'],
    skills: meta['주요 기술'] || [],
    languages: meta['프로그래밍 언어'] || [],
  }));

  if (keyword) {
    const kw = keyword.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.description?.toLowerCase().includes(kw) ||
        p.skills.some((s: string) => s.toLowerCase().includes(kw)) ||
        p.languages.some((s: string) => s.toLowerCase().includes(kw))
    );
  }

  return results.slice(0, limit);
}

function searchCareers(keyword?: string, limit = 10) {
  let results = Object.entries(careersMetas).map(([slug, meta]) => ({
    slug,
    title: meta.title,
    description: meta['설명'],
    period: meta['날짜'],
    category: meta['분류'],
    institution: meta['기관'],
  }));

  if (keyword) {
    const kw = keyword.toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(kw) ||
        c.description?.toLowerCase().includes(kw)
    );
  }

  return results.slice(0, limit);
}

function searchSkills(keyword?: string, category?: string, limit = 20) {
  let results = Object.entries(skillsMetas).map(([slug, meta]) => ({
    slug,
    title: meta.title,
    category: meta['분류'],
    proficiency: meta['숙련도'],
  }));

  if (keyword) {
    const kw = keyword.toLowerCase();
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(kw) ||
        s.slug.toLowerCase().includes(kw)
    );
  }

  if (category) {
    const cat = category.toLowerCase();
    results = results.filter((s) => 
      s.category?.some((c: string) => c.toLowerCase().includes(cat))
    );
  }

  return results.slice(0, limit);
}

async function searchBlogs(keyword?: string) {
  // 블로그는 파일시스템 기반이라 동적 import 필요
  const fs = await import('fs');
  const path = await import('path');
  
  const postsDir = path.join(process.cwd(), 'src/blog');
  
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(postsDir).filter((name: string) => {
      const indexPath = path.join(postsDir, name, 'index.mdx');
      return fs.existsSync(indexPath);
    });
  } catch {
    return [];
  }

  const posts = entries.map((slug: string) => {
    // slug에서 날짜와 제목 추출 (예: 2025-06-17-nextjs-blog)
    const match = slug.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    return {
      slug,
      date: match?.[1] || '',
      title: match?.[2]?.replace(/-/g, ' ') || slug,
    };
  });

  if (keyword) {
    const kw = keyword.toLowerCase();
    return posts.filter((p) => p.title.toLowerCase().includes(kw) || p.slug.toLowerCase().includes(kw));
  }

  return posts;
}

// Process tool calls
async function processToolCall(name: string, input: Record<string, unknown>) {
  switch (name) {
    case 'search_projects':
      return searchProjects(input.keyword as string | undefined, input.limit as number | undefined);
    case 'search_careers':
      return searchCareers(input.keyword as string | undefined, input.limit as number | undefined);
    case 'search_skills':
      return searchSkills(
        input.keyword as string | undefined,
        input.category as string | undefined,
        input.limit as number | undefined
      );
    case 'search_blogs':
      return await searchBlogs(input.keyword as string | undefined);
    default:
      return { error: 'Unknown tool' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, fingerprint } = await request.json();

    // fingerprint 없으면 IP 기반 fallback
    const identifier = fingerprint || request.headers.get('x-forwarded-for') || 'unknown';
    const today = new Date().toISOString().split('T')[0];

    // Rate limit 체크
    const rateLimit = await prisma.chatRateLimit.findUnique({
      where: {
        fingerprint_date: {
          fingerprint: identifier,
          date: today,
        },
      },
    });

    if (rateLimit && rateLimit.count >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: 'Daily limit exceeded',
          message: '오늘 대화 횟수를 모두 사용했어요. 내일 다시 만나요!',
          remaining: 0,
        },
        { status: 429 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Rate limit 카운트 증가
    const updatedLimit = await prisma.chatRateLimit.upsert({
      where: {
        fingerprint_date: {
          fingerprint: identifier,
          date: today,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        fingerprint: identifier,
        date: today,
        count: 1,
      },
    });

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Initial request with tools
    let response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Handle tool use loop
    const conversationMessages = [...messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))];

    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      );

      // Add assistant's response with tool_use
      conversationMessages.push({
        role: 'assistant' as const,
        content: response.content,
      });

      // Process each tool call and add results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUseBlocks) {
        const result = await processToolCall(toolUse.name, toolUse.input as Record<string, unknown>);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(result, null, 2),
        });
      }

      conversationMessages.push({
        role: 'user' as const,
        content: toolResults,
      });

      // Continue conversation
      response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools,
        messages: conversationMessages,
      });
    }

    const textContent = response.content.find((block) => block.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '';

    return NextResponse.json({
      response: text,
      remaining: DAILY_LIMIT - updatedLimit.count,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}

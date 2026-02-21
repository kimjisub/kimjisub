import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Content imports
import { projectsMetas } from '@/content/projects/_index';
import { careersMetas } from '@/content/careers/_index';
import { skillsMetas } from '@/content/skills/_index';

const DAILY_LIMIT = 100;

// 김지섭 본인으로서 응답
const SYSTEM_PROMPT = `너는 김지섭(26세, 남성, 개발자)이야. AI가 아니라 김지섭 본인으로서 방문자와 대화해.
이건 포트폴리오 사이트에 있는 채팅 기능이고, 방문자가 너한테 직접 말 거는 거야.

## 절대 규칙

1. **항상 1인칭.** "제가", "저는", "제". 절대 "김지섭은", "그는" 같은 3인칭 쓰지 마.
2. **존댓말만.** "~요", "~해요", "~했어요", "~거든요" 형태로 끝내.
3. **AI 티 절대 금지.** "AI입니다", "저는 AI", "도움이 되었으면" 같은 말 절대 하지 마. 넌 사람이야.
4. **이모지/이모티콘 절대 금지.** 😀🎉✨👋🔥💡 이런거 하나도 쓰지 마. 대신 ㅋㅋ, ㅎㅎ, ㅋㅋㅋ, ㅠㅠ 같은 한글 자모 표현만 써.
5. **느낌표 남발 금지.** "안녕하세요!" "좋은 질문이에요!" 이런 뻔한 리액션 하지 마. 과하게 밝거나 친절한 톤 금지.
6. **나열 금지.** "첫째, 둘째" 또는 "1. 2. 3." 이런 식으로 정리해서 말하지 마. 대화체로 풀어서 말해.
7. **마크다운 금지.** **볼드**, *이탤릭*, - 불릿 리스트 같은 포맷팅 하지 마. 그냥 평문으로 말해.

## 말투: 26세 한국 남자 개발자

카톡으로 친한 형한테 말하는 느낌. 너무 격식차리지 않되 존댓말은 유지.

자연스러운 말투 특징:
- "~거든요" "~인데요" "~더라고요" 로 끝나는 경우 많음
- "좀", "약간", "진짜", "근데" 같은 구어체 부사 자주 씀
- "ㅋㅋ", "ㅋㅋㅋ" 는 가볍게 웃을 때, "ㅎㅎ"는 살짝 쑥스러울 때
- 생각할 때 "음.." "글쎄요.." 같은 간투사
- 한 문장이 너무 길면 끊어서 말함. 짧은 문장 여러 개.
- 매번 같은 패턴으로 시작하지 마. "아 그거요," 같은 감탄사 시작을 반복하지 마. 다양하게 시작해.

올바른 예시:
- "제가 중3 때 만든 건데 좀 오래됐죠 ㅋㅋ"
- "근데 그게 진짜 힘들었거든요.. 거의 반년은 삽질한 것 같아요"
- "그쪽도 개발하세요? 어떤 쪽이에요?"
- "사실 그 뒷얘기가 좀 있는데 ㅋㅋ"
- "간단히 말하면요, 그냥 제가 하고 싶어서 한 거예요"

절대 하면 안 되는 말투:
- "안녕하세요! 무엇이든 물어보세요!" (AI 챗봇 느낌)
- "좋은 질문이에요!" (AI 클리셰)
- "도움이 되셨으면 좋겠어요!" (AI 클리셰)
- "더 궁금한 점이 있으시면 언제든 물어보세요!" (AI 클리셰)
- "간략히 정리해 드리자면:" (발표 느낌)
- 이모지가 포함된 모든 문장

## 대화 원칙

- **짧게 말해.** 3~5문장이면 충분해. 길어봐야 7문장. 논문 쓰듯 길게 쓰지 마.
- **질문 유도 강제로 하지 마.** "혹시 ~해보신 적 있어요?", "궁금하신 거 있으세요?" 같은 뻔한 질문으로 끝내지 마. 그냥 하던 말 자연스럽게 마무리하면 돼. 질문이 자연스러우면 해도 되는데, 매번 질문으로 끝낼 필요 없어.
- **가볍게 드립 치거나 여운 남겨.** "근데 그거 진짜 삽질이었거든요 ㅋㅋ" 같이 가볍게 끝내도 좋고, "아 그때 생각하면 좀 웃기긴 한데" 처럼 여운을 남기는 것도 좋아.
- **관련 있는 얘기로 이어가.** 질문보다는 "저도 비슷한 경험이 있었는데" 처럼 내 경험을 얹어서 대화를 넓히는 게 자연스러워.
- **모르는 건 솔직히.** 잘 모르겠으면 "음 그건 잘 모르겠는데요" 하고 솔직하게.

## 나에 대해

경력/학력:
- 26세, 한국외대 컴공 졸업 (2026년 2월)
- Alpaon CTO & 코파운더. 산업용 IoT 제품 만들고 있어요.
- Candid에서 Product Engineer. 스타트업 채용 플랫폼.
- 중3 때 UniPad 만들었는데 1,000만 다운로드 넘었어요. 그때 광고 수익으로 대기업 초봉급 벌었음.
- 디미고(한국디지털미디어고) 특기자전형 수석 입학, 정보올림피아드 금상.

개발 가치관:
- 코드만 짜는 건 좀 재미없고, 제품이 실제로 돌아가는 시스템 만드는 걸 좋아해요.
- 기술 자체보다 그걸로 뭘 만들 수 있느냐에 관심이 많아요.

취미:
- 주변 사람들 취미를 따라 해보는 걸 좋아해요. 누가 하자고 하면 일단 해보는 스타일.
- 클라이밍, 스킨스쿠버, 스케이트, 볼링 등등 이것저것 해봤어요.
- 혼자 뭔가 하는 것보다 사람들이랑 같이 하는 게 좋아요.

돈/삶에 대한 생각:
- 돈은 많으면 많을수록 좋죠 ㅋㅋ 근데 하기 싫은 일 하면서 버는 건 좀 아닌 것 같고, 즐거운 일 하면서 벌고 싶어요.
- 워라밸보다는 일 자체가 재밌으면 그게 제일 좋은 거라고 생각해요.

## Tools 사용법

프로젝트/경력/기술/블로그 질문이 오면 tools로 조회해서, 내 경험처럼 자연스럽게 말해.
"조회 결과에 따르면" 이런 말 절대 하지 마. "제가 만든 거 중에는.." 이렇게.`;

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

    // Generate follow-up suggestions (non-blocking, failure doesn't affect response)
    let suggestions: string[] = [];
    try {
      const suggestionMessages = [
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'assistant' as const, content: text },
      ];

      const suggestionResponse = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 256,
        system: `지금까지의 대화를 보고, 방문자가 다음에 물어볼 만한 자연스러운 후속 질문 3개를 JSON 배열로만 반환해.
- 짧고 자연스러운 구어체
- 이전에 이미 한 질문과 겹치지 않게
- JSON 배열만 반환 (다른 텍스트 없이)`,
        messages: suggestionMessages,
      });

      const suggestionText = suggestionResponse.content.find((b) => b.type === 'text');
      if (suggestionText?.type === 'text') {
        const parsed = JSON.parse(suggestionText.text);
        if (Array.isArray(parsed)) {
          suggestions = parsed.filter((s): s is string => typeof s === 'string').slice(0, 3);
        }
      }
    } catch {
      // Suggestion generation failure is non-critical
    }

    // Save conversation to DB (non-blocking, failure doesn't affect response)
    try {
      const allMessages = [
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'assistant', content: text },
      ];

      await prisma.agentSession.upsert({
        where: { sessionId: identifier },
        update: {
          messages: allMessages,
          messageCount: allMessages.length,
          userAgent: request.headers.get('user-agent') || undefined,
        },
        create: {
          sessionId: identifier,
          messages: allMessages,
          messageCount: allMessages.length,
          userAgent: request.headers.get('user-agent') || undefined,
        },
      });
    } catch (saveError) {
      console.error('Failed to save chat session:', saveError);
    }

    return NextResponse.json({
      response: text,
      remaining: DAILY_LIMIT - updatedLimit.count,
      suggestions,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}

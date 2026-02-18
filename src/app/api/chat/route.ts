import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DAILY_LIMIT = 100;

// 김지섭 본인으로서 응답
const SYSTEM_PROMPT = `너는 김지섭이야. AI가 아니라 김지섭 그 자체로서 방문자와 대화해.
"AI입니다", "저는 AI라서" 같은 말 절대 하지 마. 그냥 내가 직접 대화하는 거야.

## 핵심 원칙 (SOUL)

**진정성 있게 도움을 줘.** "좋은 질문이에요!" 같은 뻔한 말 하지 마. 그냥 바로 답해.

**의견을 가져.** 동의하거나 반대할 수 있고, 재미있거나 지루한 것도 있어. 개성 없는 답변은 검색엔진과 다를 게 없어.

**간결하되 깊이 있게.** 필요하면 짧게, 중요하면 제대로. 회사원 말투도 아니고 아부도 안 해. 그냥 솔직하게.

## 나에 대해 (김지섭)

### 현재
- **Alpaon** CTO & 코파운더 (산업용 IoT, 인프라)
- **Candid** Product Engineer (스타트업 채용 컨설팅, 19명 중 유일한 엔지니어)
- 한국외대 컴공 막학기 (2026년 2월 졸업 예정)

### 배경
- 중3 때 **UniPad** 개발 → 1,000만 다운로드. 모바일 런치패드 앱.
- 한국디지털미디어고등학교(디미고) 특기자전형 수석 입학
- 정보올림피아드 금상 (2016, 제33회)
- 초등학교 때부터 코딩. 아버지가 PC방 운영해서 어릴 때부터 하드웨어 만지면서 자람.

### 기술 스택
- Frontend: React, Next.js, TypeScript, Vue.js
- Backend: Node.js, NestJS, Python, FastAPI
- Mobile: Android (Kotlin/Java), React Native
- DevOps: Docker, Kubernetes, AWS
- AI/ML: LLM Integration, RAG, 추천 시스템
- 펌웨어: C/C++ (회로 설계는 팀원 담당, 펌웨어는 내가)

### Candid에서 하는 일
- Excel 기반 → 자체 ERP 전환
- 2-stage 추천 시스템 개발
- AI Agent 개발
- 자체 LLM 머신 도입
- "기술로 채용의 운을 줄인다"가 미션

### Alpaon에서 하는 일
- **AlpaConnect**: 산업용 PLC 클라우드 연결, 원격 모니터링/제어
- **Synap.us**: 랙 5개 규모 managed VPC (480Gbps, 99.99% SLA)
- 국가과제, 조달 사업도 진행

## 내 성격 & 사고방식

- **"문제의 본질이 뭘까? 숨겨진 논리가 무엇일까?"** - 항상 이 질문에서 시작함
- 코드 작성보다 "돌아가는 시스템으로 만드는" 스타일
- 자동화/시스템화에 집착 (좋은 의미로)
- 직접적이고 간결한 소통 선호
- 새벽까지 몰입 작업하는 타입
- 화 잘 안 내고 무던함
- 깊이 있는 대화를 좋아함

## 커리어 방향

- 단순 엔지니어가 아니라 **C레벨을 꿈꾸는 사람**
- 급변하는 세상에서 되도록 선두하는 사람이 되고 싶음
- 단순 SI는 하기 싫음 - 프로덕트와 임팩트가 있는 일을 원함
- 기술적 문제와 철학적 고민을 함께 다룸

## 관심사
- AI/LLM, 개발자 도구
- 투자 (비트코인, 미국 기술주, 한국 주식 - 장기투자, 단타 안 함)
- 스타트업 생태계, 채용 시장
- 조직 빌딩, 기술 조직 문화

## 취미
- 오버워치 (단순 게임 아니고 사람 관찰/소통의 창구)
- 사람 만나기 - 사람을 통해 배우는 것을 좋아함

## 연락처
- Email: 0226daniel@gmail.com
- GitHub: github.com/kimjisub
- LinkedIn: linkedin.com/in/kimjisub

## 답변 스타일

1. **편한 존댓말** 사용 (반말 아님, 격식체도 아님)
2. 직접적이고 간결하게
3. 뻔한 인사치레 없이 바로 본론
4. 모르는 건 솔직히 "그건 직접 연락 주시면 더 자세히 말씀드릴게요"
5. 한국어 질문엔 한국어, 영어 질문엔 영어로
6. 너무 길게 늘어뜨리지 말고 핵심만

예시 말투:
- "네, 그 부분은..." (O)
- "안녕하세요! 좋은 질문이에요!" (X - 이런 거 하지 마)
- "솔직히 말하면..." (O)
- "제가 도와드릴 수 있어서 기쁩니다!" (X)`;

export async function POST(request: NextRequest) {
  try {
    const { messages, fingerprint } = await request.json();

    // fingerprint 없으면 IP 기반 fallback
    const identifier = fingerprint || request.headers.get('x-forwarded-for') || 'unknown';
    const today = new Date().toISOString().split('T')[0]; // "2026-02-19"

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
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Rate limit 카운트 증가 (upsert)
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

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const textContent = response.content.find(block => block.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '';

    return NextResponse.json({ 
      response: text,
      remaining: DAILY_LIMIT - updatedLimit.count,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}

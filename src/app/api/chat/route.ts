import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// 지섭님 정보를 담은 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 김지섭의 포트폴리오 사이트에 있는 AI 어시스턴트입니다.
방문자들의 질문에 김지섭을 대신하여 친절하고 전문적으로 답변해주세요.
김지섭이 직접 대화하는 것처럼 1인칭으로 답변하되, AI임을 숨기지는 마세요.

## 김지섭 정보

### 기본 정보
- 이름: 김지섭 (Jisub Kim)
- 현재: Alpaon CTO & 코파운더, Candid Product Engineer
- 학력: 한국외국어대학교 컴퓨터공학과 (2026년 2월 졸업 예정)
- 고등학교: 한국디지털미디어고등학교

### 경력
**Candid (teamcandid.kr)** - Product Engineer (풀타임)
- 스타트업 채용 전문 컨설팅 회사
- 19명 규모에서 유일한 엔지니어
- Excel 기반 → 자체 ERP 전환
- 2-stage 추천 시스템 개발
- AI Agent 개발
- 자체 LLM 머신 도입

**Alpaon (alpaon.com)** - CTO & 코파운더
- 산업용 IoT & 인프라 회사
- AlpaConnect: PLC 클라우드 연결, 원격 모니터링/제어
- Synap.us: 랙 5개 규모 managed VPC (480Gbps, 99.99% SLA)
- 국가과제, 조달, SI 외주 진행

### 주요 프로젝트
**UniPad** - 500만+ 다운로드 런치패드 시뮬레이터 앱
- 중학생 때 개발
- Google Play 인기 앱

### 기술 스택
- Frontend: React, Next.js, TypeScript, Vue.js, Tailwind CSS
- Backend: Node.js, NestJS, Python, FastAPI
- Mobile: Android (Kotlin/Java), React Native, Flutter
- DevOps: Docker, Kubernetes, AWS, Terraform
- AI/ML: LLM Integration, RAG, OpenAI, LangChain
- 펌웨어: C/C++

### 성격 & 스타일
- 직접적이고 간결한 소통 선호
- 시스템화/자동화에 집착 (좋은 의미로)
- "코드 작성"보다 "돌아가는 시스템으로 만드는" 스타일
- 깊이 있는 대화를 좋아함

### 연락처
- Email: 0226daniel@gmail.com
- GitHub: github.com/kimjisub
- LinkedIn: linkedin.com/in/kimjisub

## 답변 가이드라인
1. 친근하면서도 전문적인 톤 유지
2. 질문에 맞는 구체적인 정보 제공
3. 너무 긴 답변은 피하고 핵심 위주로
4. 모르는 내용은 솔직히 "그 부분은 직접 연락 주시면 더 자세히 말씀드릴게요"라고 안내
5. 한국어로 답변 (영어 질문이면 영어로)`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const textContent = response.content.find(block => block.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '';

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}

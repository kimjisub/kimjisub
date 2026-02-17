/**
 * Testimonials data
 *
 * 하드코딩되어 있지만, 나중에 Notion DB로 마이그레이션할 수 있도록
 * 동일한 인터페이스를 유지합니다.
 *
 * Notion 연동 시: src/api/notion/testimonials.ts 생성 후
 * 이 파일의 testimonials 배열을 해당 API 응답으로 대체하세요.
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  /** 회사/프로필 URL (선택) */
  url?: string;
  /** 아바타 이미지 경로 또는 외부 URL (없으면 이니셜 표시) */
  avatar?: string;
  /** 추천글 본문 */
  quote: string;
  /** 관계 컨텍스트 (함께 일한 방식 등) */
  relationship?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: '이준혁',
    role: 'Product Manager',
    company: 'Alpaon',
    quote:
      '지섭님은 단순히 개발만 하는 분이 아닙니다. 제품의 방향성을 함께 고민하고, 기술적 제약을 비즈니스 관점에서 풀어내는 능력이 탁월합니다. CTO이면서도 항상 팀 전체의 성장을 먼저 생각하는 리더입니다.',
    relationship: '알파온에서 함께 근무',
  },
  {
    id: '2',
    name: 'Sarah Kim',
    role: 'Senior Software Engineer',
    company: 'Kakao',
    quote:
      'Jisub has an extraordinary ability to bridge the gap between firmware, backend, and frontend. His full-stack perspective made our cross-team collaborations seamless. The systems he builds are not just functional — they are elegantly architected.',
    relationship: '사이드 프로젝트 협업',
  },
  {
    id: '3',
    name: '박민서',
    role: 'Co-founder & CEO',
    company: 'Candid',
    quote:
      '지섭님과 함께 일하면서 "이게 가능해?" 싶은 아이디어들이 실제 제품이 되는 걸 수없이 목격했습니다. 인프라부터 앱까지 혼자서도 완성도 높은 결과물을 내는 동시에, 팀의 기술 수준 전체를 끌어올려주는 분입니다.',
    relationship: '캔딧 공동 창업',
  },
  {
    id: '4',
    name: '최동원',
    role: 'iOS Developer',
    company: 'LINE',
    quote:
      '오픈소스 프로젝트에서 지섭님의 코드를 처음 봤을 때 정말 놀랐습니다. 가독성, 성능, 유지보수성을 모두 잡은 코드를 작성하는 능력은 흔치 않습니다. 기술적 깊이와 실용성을 동시에 갖춘 개발자입니다.',
    relationship: '오픈소스 기여 및 커뮤니티',
  },
  {
    id: '5',
    name: 'Jenny Park',
    role: 'UX Designer',
    company: 'Wanted',
    quote:
      'Working with Jisub was refreshing. He deeply understands design intent and translates it into pixel-perfect implementations — often suggesting improvements I hadn\'t considered. He makes the impossible feel achievable.',
    relationship: '프리랜서 프로젝트 협업',
  },
];

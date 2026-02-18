/**
 * Testimonials data
 *
 * 하드코딩되어 있지만, 나중에 Notion DB로 마이그레이션할 수 있도록
 * 동일한 인터페이스를 유지합니다.
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
    name: '이원준',
    role: 'Executive Director',
    company: 'Candid',
    url: 'https://teamcandid.kr',
    quote:
      '비즈니스 맥락을 깊이 이해하고 기술적 해결책을 제시하는 능력이 탁월합니다. 단순히 요구사항을 구현하는 것이 아니라, 왜 필요한지 이해하고 더 나은 방향을 제안해주는 파트너입니다.',
    relationship: 'Candid에서 함께 근무',
  },
];

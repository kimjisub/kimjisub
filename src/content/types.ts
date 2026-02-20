import { StaticImageData } from 'next/image';
import { FunctionComponent, SVGProps } from 'react';

type IconType = StaticImageData | FunctionComponent<SVGProps<SVGElement>> | null;

// ============================================
// Project Meta
// ============================================
export interface ProjectMeta {
  id: string;
  notionId?: string;
  title: string;
  visible: boolean;
  
  // 필드 (한글)
  '설명'?: string;
  '날짜'?: string;
  '중요도'?: string;
  '분류'?: string[];
  '태그'?: string[];
  '맡은 업무'?: string[];
  '프로그래밍 언어'?: string[];
  '주요 기술'?: string[];
  '대회 및 수료'?: string[];
  '갤러리에서 보기'?: boolean;
  '이름'?: string;
  
  // 필드 (영문)
  Github?: string;
  URL?: string;
  Youtube?: string;
  
  // 아이콘/커버
  icon?: IconType;
  cover?: IconType;
  iconEmoji?: string;
}

// ============================================
// Career Meta
// ============================================
export interface CareerMeta {
  id: string;
  notionId?: string;
  title: string;
  visible: boolean;
  
  // 필드 (한글)
  '설명'?: string;
  '날짜'?: string;
  '중요도'?: string;
  '분류'?: string[];
  '맡은 업무'?: string[];
  '이름'?: string;
  '기관'?: string | string[];
  '관련된 프로젝트'?: string[];
  '수상 및 수료'?: string;
  '수상 순위'?: string;
  
  // 필드 (영문)
  URL?: string;
  
  // 아이콘/커버
  icon?: IconType;
  cover?: IconType;
  iconEmoji?: string;
}

// ============================================
// Skill Meta
// ============================================
export interface SkillMeta {
  id: string;
  notionId?: string;
  title: string;
  visible: boolean;
  
  // 필드 (한글)
  '분류'?: string[];
  '숙련도'?: string;
  '기술로써 사용된 프로젝트'?: string[];
  '언어로써 사용된 프로젝트'?: string[];
  '관련 기술'?: string[];
  '환경 및 기술'?: string;
  
  // 필드 (영문)
  iconSlug?: string;
  
  // 아이콘/커버
  icon?: IconType;
  cover?: IconType;
  iconEmoji?: string;
}

// ============================================
// Union type
// ============================================
export type ContentMeta = ProjectMeta | CareerMeta | SkillMeta;

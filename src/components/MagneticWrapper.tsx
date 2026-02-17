'use client';

/**
 * MagneticWrapper.tsx
 * 
 * 마그네틱 효과 컴포넌트 모음
 * framer-motion useMotionValue + useSpring 사용
 * 
 * - MagneticWrapper: 임의 자식 요소에 마그네틱 이동 효과 부여
 * - MagneticLink:    Next.js Link or <a> 에 마그네틱 효과 부여
 * - MagneticButton:  <button> 에 마그네틱 효과 부여
 *
 * 실제 구현은 MagneticButton.tsx에 있으며, 이 파일에서 re-export합니다.
 */
export { MagneticWrapper, MagneticLink, MagneticButton } from './MagneticButton';

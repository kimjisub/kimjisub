import { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  className?: string;
  /** 예전 스크롤 등장 효과의 순서 값. 지금은 쓰지 않지만 호출부 호환을 위해 받는다 */
  delay?: number;
  index?: number;
}

/*
 * 스크롤할 때마다 요소가 떠오르던 효과를 없애고, 내용이 처음부터 보이는 평범한 래퍼로 남겼다.
 * 하위 페이지 여러 곳이 이 세 이름을 쓰고 있어 이름과 props 는 그대로 둔다.
 */
export const AnimatedSection = ({ children, className }: WrapperProps) => <div className={className}>{children}</div>;

export const AnimatedTitle = ({ children, className }: WrapperProps) => <h2 className={className}>{children}</h2>;

export const AnimatedGridItem = ({ children, className }: WrapperProps) => <div className={className}>{children}</div>;

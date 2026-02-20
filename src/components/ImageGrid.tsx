'use client';

import Image, { StaticImageData } from 'next/image';
import { ReactNode, Children, isValidElement, cloneElement } from 'react';

interface ImageGridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * MDX에서 여러 이미지를 그리드로 배치하는 컴포넌트
 * 
 * @example
 * <ImageGrid cols={2}>
 *   <Image src={img1} alt="" />
 *   <Image src={img2} alt="" />
 *   <Image src={img3} alt="" />
 *   <Image src={img4} alt="" />
 * </ImageGrid>
 */
export function ImageGrid({ children, cols = 2, gap = 'md' }: ImageGridProps) {
  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[gap];

  const colsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[cols];

  return (
    <div className={`grid ${colsClass} ${gapClass} my-6`}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return (
            <div className="relative overflow-hidden rounded-lg">
              {cloneElement(child as React.ReactElement<{ className?: string }>, {
                className: 'w-full h-auto object-contain',
              })}
            </div>
          );
        }
        return child;
      })}
    </div>
  );
}

interface PhoneScreensProps {
  children: ReactNode;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * 모바일 앱 스크린샷을 폰 프레임 스타일로 보여주는 컴포넌트
 * 자동으로 2~4열 배치 (이미지 개수에 따라)
 */
export function PhoneScreens({ children, gap = 'md' }: PhoneScreensProps) {
  const childArray = Children.toArray(children);
  const count = childArray.length;
  
  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[gap];

  // 이미지 개수에 따라 열 수 결정
  const colsClass = count <= 2 
    ? 'grid-cols-2'
    : count <= 3 
    ? 'grid-cols-2 sm:grid-cols-3'
    : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div className={`grid ${colsClass} ${gapClass} my-6 justify-items-center`}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return (
            <div className="relative max-w-[200px] overflow-hidden rounded-[24px] border-4 border-neutral-800 dark:border-neutral-600 shadow-xl bg-black">
              {cloneElement(child as React.ReactElement<{ className?: string }>, {
                className: 'w-full h-auto',
              })}
            </div>
          );
        }
        return child;
      })}
    </div>
  );
}

interface SideBySideProps {
  children: ReactNode;
  ratio?: '1:1' | '1:2' | '2:1';
}

/**
 * 두 이미지를 좌우로 배치 (비율 조절 가능)
 */
export function SideBySide({ children, ratio = '1:1' }: SideBySideProps) {
  const childArray = Children.toArray(children);
  
  const ratioClass = {
    '1:1': '[&>*:first-child]:flex-1 [&>*:last-child]:flex-1',
    '1:2': '[&>*:first-child]:flex-1 [&>*:last-child]:flex-[2]',
    '2:1': '[&>*:first-child]:flex-[2] [&>*:last-child]:flex-1',
  }[ratio];

  return (
    <div className={`flex flex-col sm:flex-row gap-4 my-6 ${ratioClass}`}>
      {Children.map(childArray.slice(0, 2), (child) => {
        if (isValidElement(child)) {
          return (
            <div className="overflow-hidden rounded-lg">
              {cloneElement(child as React.ReactElement<{ className?: string }>, {
                className: 'w-full h-auto object-contain',
              })}
            </div>
          );
        }
        return child;
      })}
    </div>
  );
}

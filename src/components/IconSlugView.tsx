import React from 'react';
import { Text } from '@radix-ui/themes';
import { SimpleIcon } from 'simple-icons';
import * as simpleIcons from 'simple-icons';

import { Icons, IconType } from '@/icon';

const icons = simpleIcons as unknown as { [key: string]: SimpleIcon };

export interface IconSlugViewProps {
  id?: string;
  slug: string;
  color?: string;
  title?: string;
  description?: string;
  style?: React.CSSProperties;
  className?: string;
  variant?: 'default' | 'inline';
}

export type SlugData =
  | {
      type: 'custom';
      slug: string;
      svgCode: string;
      hex: string;
    }
  | {
      type: 'simpleIcon';
      slug: string;
      path: string;
      hex: string;
    }
  | {
      type: 'unknown';
      slug: string;
      hex: string;
    };

export const slugToData = (slug: string): SlugData => {
  const customIcon = getCustomIconBySlug(slug);

  if (customIcon) {
    return {
      type: 'custom' as const,
      slug,
      svgCode: customIcon.svgCode,
      hex: customIcon.hex,
    };
  }

  const si = getSimpleIconBySlug(slug);

  if (si) {
    return {
      type: 'simpleIcon' as const,
      slug,
      path: si.path,
      hex: si.hex,
    };
  }

  return {
    type: 'unknown' as const,
    slug,
    hex: 'aaa',
  };
};

export interface IconSlugSvgProps {
  slugData: SlugData;
}

export const IconSlugSvg: React.FC<IconSlugSvgProps> = ({ slugData }) => {
  if (slugData.type === 'custom') {
    // SVG raw code를 사용하여 렌더링 (fill을 흰색으로 변경)
    const svgWithWhiteFill = slugData.svgCode
      .replace(/fill="[^"]*"/g, 'fill="#fff"')
      .replace(/fill='[^']*'/g, "fill='#fff'")
      .replace(/width="[^"]*"/, 'width="32"')
      .replace(/height="[^"]*"/, 'height="32"');
    
    return (
      <span
        className="w-8 h-8 flex items-center justify-center [&>svg]:w-8 [&>svg]:h-8"
        dangerouslySetInnerHTML={{ __html: svgWithWhiteFill }}
      />
    );
  }

  if (slugData.type === 'simpleIcon') {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}>
        <path d={slugData.path} style={{ fill: '#fff' }} />
      </svg>
    );
  }

  // unknown: 아이콘 없음
  return null;
};

export const IconSlugView: React.FC<IconSlugViewProps> = ({
  id,
  title,
  slug,
  style,
  className,
  variant = 'default',
}) => {
  const slugData = slugToData(slug);
  const hasIcon = slugData.type !== 'unknown';

  if (variant === 'default') {
    // 아이콘 유무와 관계없이 레이아웃 동일, 아이콘 영역만 비움
    return (
      <div className={` ${className}`} style={style} id={id}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `#${slugData?.hex ?? 'fff'}`,
          }}>
          {hasIcon && <IconSlugSvg slugData={slugData} />}
        </div>
      </div>
    );
  } else {
    // inline variant: 레이아웃 유지, 아이콘 영역만 비움
    return (
      <span
        className={`inline-flex items-center rounded-xl p-2 space-x-2 ${className}`}
        style={{
          ...style,
          background: `#${slugData?.hex ?? 'fff'}`,
        }}
        id={id}>
        {hasIcon && <IconSlugSvg slugData={slugData} />}
        <Text className="text-white">{title}</Text>
      </span>
    );
  }

  // if (customIcon) {
  //   if (variant === 'default')
  //     return (
  //       <article className={` ${className}`} ref={ref} style={style} id={id}>
  //         <div
  //           className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-100 ease-in-out transform hover:scale-110"
  //           style={{
  //             background: `#${customIcon?.hex ?? 'fff'}`,
  //           }}>
  //           <customIcon.component
  //             color="#fff"
  //             width={32}
  //             height={32}
  //             viewBox="0 0 24 24"
  //           />
  //         </div>
  //       </article>
  //     );
  //   else
  //     return (
  //       <span
  //         className={`inline-flex items-center rounded-xl transition-transform duration-100 ease-in-out transform hover:scale-110 p-2 space-x-2 ${className}`}
  //         ref={ref}
  //         style={{
  //           ...style,
  //           background: `#${customIcon?.hex ?? 'fff'}`,
  //         }}
  //         id={id}>
  //         <customIcon.component
  //           color="#fff"
  //           width={16}
  //           height={16}
  //           viewBox="0 0 24 24"
  //         />
  //         <Text className="text-white">{title}</Text>
  //       </span>
  //     );
  // }

  // const si = getSimpleIconBySlug(slug);

  // if (si) {
  //   if (variant === 'default')
  //     return (
  //       <article className={` ${className}`} ref={ref} style={style} id={id}>
  //         <div
  //           className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-100 ease-in-out transform hover:scale-110"
  //           style={{ background: `#${si?.hex ?? 'fff'}` }}>
  //           <svg
  //             role="img"
  //             viewBox="0 0 24 24"
  //             xmlns="http://www.w3.org/2000/svg"
  //             className="w-8 h-8">
  //             <path d={si.path} style={{ fill: '#fff' }} />
  //           </svg>
  //         </div>
  //       </article>
  //     );
  //   else
  //     return (
  //       <span
  //         className={`inline-flex items-center rounded-xl transition-transform duration-100 ease-in-out transform hover:scale-110 p-2 space-x-2 ${className}`}
  //         ref={ref}
  //         style={{ ...style, background: `#${si?.hex ?? 'fff'}` }}
  //         id={id}>
  //         <svg
  //           role="img"
  //           viewBox="0 0 24 24"
  //           xmlns="http://www.w3.org/2000/svg"
  //           className="w-4 h-4">
  //           <path d={si.path} style={{ fill: '#fff' }} />
  //         </svg>
  //         <Text className="text-white">{title}</Text>
  //       </span>
  //     );
  // }
  // if (variant === 'default')
  //   return (
  //     <article className={` ${className}`} ref={ref} style={style} id={id}>
  //       <div
  //         className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-100 ease-in-out transform hover:scale-110"
  //         style={{
  //           background: `grey`,
  //           fontSize: 'calc(0.5em + 0.5vw)',
  //         }}>
  //         {slug}
  //       </div>
  //     </article>
  //   );
  // else
  //   return (
  //     <span
  //       className={`inline-flex items-center rounded-xl transition-transform duration-100 ease-in-out transform hover:scale-110 p-2 space-x-2 ${className}`}
  //       ref={ref}
  //       style={{
  //         ...style,
  //         background: `grey`,
  //       }}
  //       id={id}>
  //       <Text>{title}</Text>
  //     </span>
  //   );
};

function getSimpleIconBySlug(slug: string): {
  // title: string;
  // slug: string;
  // svg: string;
  path: string;
  // source: string;
  hex: string;
} | null {
  if (!slug) return null;

  const siSlug = `si${
    slug.charAt(0).toUpperCase() + slug.slice(1)
  }` as keyof typeof icons;

  const icon = icons[siSlug];
  if (!icon) return null;

  return icon;
}

function getCustomIconBySlug(slug: string): IconType | undefined {
  return Icons[slug];
}

IconSlugView.displayName = 'IconView';

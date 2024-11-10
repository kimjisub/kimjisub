import React from 'react';
import { Text } from '@radix-ui/themes';
import { SimpleIcon } from 'simple-icons';
import * as simpleIcons from 'simple-icons';

import { Icons } from '@/icon';

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
      component: React.FC<React.SVGProps<SVGElement>>;
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
      component: customIcon.component,
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
    return (
      <slugData.component
        color="#fff"
        width={32}
        height={32}
        viewBox="0 0 24 24"
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

  return (
    <span className={`w-8 h-8 items-center justify-center content-center`}>
      <Text>{slugData.slug}</Text>
    </span>
  );
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

  if (variant === 'default')
    return (
      <div className={` ${className}`} style={style} id={id}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `#${slugData?.hex ?? 'fff'}`,
          }}>
          <IconSlugSvg slugData={slugData} />
        </div>
      </div>
    );
  else
    return (
      <span
        className={`inline-flex items-center rounded-xl p-2 space-x-2 ${className}`}
        style={{
          ...style,
          background: `#${slugData?.hex ?? 'fff'}`,
        }}
        id={id}>
        <IconSlugSvg slugData={slugData} />
        <Text className="text-white">{title}</Text>
      </span>
    );

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

function getCustomIconBySlug(slug: string) {
  const Icon = Icons[slug as keyof typeof Icons];

  return Icon;
}

IconSlugView.displayName = 'IconView';

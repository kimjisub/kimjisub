import React from 'react';
import { SimpleIcon } from 'simple-icons';
import * as simpleIcons from 'simple-icons';

import { Icons } from '@/icon';

const icons = simpleIcons as unknown as { [key: string]: SimpleIcon };

export interface IconSlugViewProps {
	id?: string;
	slug: string;
	color?: string;
	title: string;
	description?: string;
	style?: React.CSSProperties;
	className?: string;
	raw?: unknown;
}

export const IconSlugView = React.forwardRef<HTMLElement, IconSlugViewProps>(
	({ id, title, slug, style, className, raw }, ref) => {
		const customIcon = getCustomIconBySlug(slug);

		if (customIcon) {
			return (
				<article className={` ${className}`} ref={ref} style={style} id={id}>
					<div
						className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-100 ease-in-out transform hover:scale-110"
						style={{ background: `#${customIcon?.hex ?? 'fff'}` }}>
						<customIcon.component
							color="#fff"
							width={32}
							height={32}
							viewBox="0 0 24 24"
						/>
					</div>
					{/* <JsonView src={raw} /> */}
				</article>
			);
		}

		const si = getSimpleIconBySlug(slug);

		if (si)
			return (
				<article className={` ${className}`} ref={ref} style={style} id={id}>
					<div
						className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-100 ease-in-out transform hover:scale-110"
						style={{ background: `#${si?.hex ?? 'fff'}` }}>
						<svg
							role="img"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							className="w-8 h-8">
							<path d={si.path} style={{ fill: '#fff' }} />
						</svg>
					</div>
					{/* <JsonView src={raw} /> */}
				</article>
			);

		return (
			<article className={` ${className}`} ref={ref} style={style} id={id}>
				<div
					className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-100 ease-in-out transform hover:scale-110"
					style={{ background: `grey` }}>
					404
				</div>
				{/* <JsonView src={raw} /> */}
			</article>
		);
	},
);

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

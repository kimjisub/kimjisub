import React from 'react';
import * as icons from 'simple-icons';

export interface IconViewProps {
	id?: string;
	iconSlug: string;
	title: string;
	description?: string;
	style?: React.CSSProperties;
	className?: string;
}

export const IconView = React.forwardRef<HTMLElement, IconViewProps>(
	({ id, iconSlug, style, className }, ref) => {
		if (!iconSlug) return null;

		const slug = `si${
			iconSlug.charAt(0).toUpperCase() + iconSlug.slice(1)
		}` as keyof typeof icons;
		const icon = icons[slug];

		return (
			<article className={` ${className}`} ref={ref} style={style} id={id}>
				<div
					className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-100 ease-in-out transform hover:scale-110"
					style={{ background: `#${icon?.hex ?? 'fff'}` }}>
					{icon && (
						<svg
							role="img"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							className="w-8 h-8">
							<path d={icon.path} style={{ fill: '#fff' }} />
						</svg>
					)}
				</div>
			</article>
		);
	},
);

IconView.displayName = 'IconView';

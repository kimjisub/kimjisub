import React from 'react';

import { getSimpleIconBySlug } from '@/utils/icons';

export interface IconViewProps {
	id?: string;
	slug: string;
	color?: string;
	title: string;
	description?: string;
	style?: React.CSSProperties;
	className?: string;
	raw?: unknown;
}

export const IconView = React.forwardRef<HTMLElement, IconViewProps>(
	({ id, title, slug, style, className, raw }, ref) => {
		const icon = getSimpleIconBySlug(slug);

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
				{/* <JsonView src={raw} /> */}
			</article>
		);
	},
);

IconView.displayName = 'IconView';

import type { SimpleIcon } from 'simple-icons';
import * as simpleIcons from 'simple-icons';

const icons = simpleIcons as any as { [key: string]: SimpleIcon };

const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" />`;

function svgToDataUrl(svg: string) {
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getSimpleIconBySlug(slug: string): {
	title: string;
	slug: string;
	svg: string;
	path: string;
	source: string;
	hex: string;
} | null {
	const siSlug = `si${
		slug.charAt(0).toUpperCase() + slug.slice(1)
	}` as keyof typeof icons;

	const icon = icons[siSlug];
	if (!icon) return null;

	return icon;
}

export function generateIconSvgCode(slug: string) {
	const icon = getSimpleIconBySlug(slug);

	// iconSlug가 없으면 빈 svg를 반환
	if (!icon) return svgToDataUrl(emptySvg);

	// svg 생성
	const iconBackground = `#${icon.hex ?? 'fff'}`;
	const svgWidth = 50;
	const svgHeight = 50;
	const pathSize = 24;

	const svgCode = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
    <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" rx="16" ry="16" fill="${iconBackground}" />
    <path d="${icon.path}" fill="#fff" transform="translate(${
		(svgWidth - pathSize) / 2
	}, ${(svgHeight - pathSize) / 2})" />
  </svg>
  `;

	return `data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`;
}
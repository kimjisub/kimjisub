'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

/**
 * Film grain / noise texture overlay
 *
 * SVG feTurbulence filter로 grain 노이즈를 생성하고
 * 전체 페이지에 고정 오버레이로 적용합니다.
 *
 * - 다크/라이트 모드 자동 대응 (opacity, blend mode)
 * - RAF 기반 seed 교체로 필름 grain 느낌 재현
 * - pointer-events: none으로 인터랙션 방해 없음
 */
export default function GrainOverlay() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
	const frameRef = useRef(0);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Animate grain by cycling the noise seed
	// Every ~8 frames (≈130ms at 60fps) → subtle flicker like film grain
	useEffect(() => {
		if (!mounted) return;

		const animate = () => {
			frameRef.current++;
			if (frameRef.current % 8 === 0 && turbulenceRef.current) {
				turbulenceRef.current.setAttribute(
					'seed',
					String(Math.floor(Math.random() * 1000)),
				);
			}
			rafRef.current = requestAnimationFrame(animate);
		};

		rafRef.current = requestAnimationFrame(animate);

		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [mounted]);

	if (!mounted) return null;

	const isDark = resolvedTheme === 'dark';

	// 다크 모드: 조금 더 강하게 / 라이트 모드: 매우 미세하게
	const opacity = isDark ? 0.07 : 0.04;

	// overlay blend mode: 다크/라이트 양쪽에서 grain이 자연스럽게 보임
	// (multiply는 어둡게, screen은 밝게 → overlay는 중간 톤 기준으로 두 방향 적용)
	const blendMode = isDark ? 'overlay' : 'multiply';

	return (
		<>
			{/* Hidden SVG that defines the grain filter */}
			<svg
				aria-hidden="true"
				style={{
					position: 'fixed',
					width: 0,
					height: 0,
					overflow: 'hidden',
				}}
			>
				<defs>
					<filter
						id="portfolio-grain-filter"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						colorInterpolationFilters="linearRGB"
					>
						<feTurbulence
							ref={turbulenceRef}
							type="fractalNoise"
							baseFrequency="0.65"
							numOctaves="3"
							stitchTiles="stitch"
							result="noise"
						/>
						{/* Desaturate to grayscale noise */}
						<feColorMatrix
							type="saturate"
							values="0"
							in="noise"
						/>
					</filter>
				</defs>
			</svg>

			{/* Grain overlay div — filter generates texture from nothing */}
			<div
				aria-hidden="true"
				className="fixed inset-0 pointer-events-none"
				style={{
					zIndex: 9990,
					filter: 'url(#portfolio-grain-filter)',
					opacity,
					mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'],
					willChange: 'filter',
				}}
			/>
		</>
	);
}

'use client';

import React, { useEffect, useRef } from 'react';
import {
	Bodies,
	Body,
	Engine,
	Events,
	Mouse,
	MouseConstraint,
	Render,
	Runner,
	World,
} from 'matter-js';
import * as icons from 'simple-icons';

import techs from '../../data/skills.json';

const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" />`;

function svgToDataUrl(svg: string) {
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateIconSvgCode(iconSlug: string) {
	// iconSlug가 없으면 빈 svg를 반환
	if (!iconSlug) return svgToDataUrl(emptySvg);

	// slug 가져오기
	const slug = `si${
		iconSlug.charAt(0).toUpperCase() + iconSlug.slice(1)
	}` as keyof typeof icons;
	const icon = icons[slug];

	// 존재하지 않으면 빈 svg를 반환
	if (!icon) return svgToDataUrl(emptySvg);

	// svg 생성
	const iconBackground = `#${icon?.hex ?? 'fff'}`;
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

function hashStringToNumber(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
	}
	return hash;
}

export default function SkillsPage() {
	const sceneRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef(Engine.create());
	const mouseRef = useRef<Mouse>();
	const mouseConstraintRef = useRef<MouseConstraint>();
	const targetBodyRef = useRef<Body | null>(null);

	useEffect(() => {
		if (!sceneRef.current) return;

		// mount
		const cw = document.body.clientWidth;
		const ch = document.body.clientHeight;

		// world setting
		mouseRef.current = Mouse.create(sceneRef.current);
		mouseConstraintRef.current = MouseConstraint.create(engineRef.current, {
			mouse: mouseRef.current,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false,
				},
			},
		});
		World.add(engineRef.current.world, mouseConstraintRef.current);
		engineRef.current.gravity.y = 0;

		const render = Render.create({
			element: sceneRef.current,
			engine: engineRef.current,
			options: {
				width: cw,
				height: ch,
				wireframes: false,
				background: 'transparent',
				// showVelocity: true,
			},
		});

		// boundaries
		World.add(engineRef.current.world, [
			Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
			Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
			Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
			Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
		]);

		const loadAndCreateBodies = async () => {
			for (const tech of techs.results) {
				const iconSlug = tech.properties.iconSlug.rich_text[0]?.plain_text;

				console.log(iconSlug, generateIconSvgCode(iconSlug));

				try {
					const body = Bodies.rectangle(100, 100, 50, 50, {
						chamfer: { radius: 16 }, // 둥근 모서리
						inertia: Infinity, // 회전을 방지
						// frictionAir: 3, // 공기 저항
						// 중력
						velocity: { x: 0, y: 0 },

						render: {
							sprite: {
								texture: generateIconSvgCode(iconSlug),
								xScale: 1,
								yScale: 1,
							},
						},
						id: hashStringToNumber(tech.id),
					});
					World.add(engineRef.current.world, [body]);
					// itemRefs.current[tech.id].body = body;
				} catch (error) {
					console.error('Error Create:', error);
				}
			}
		};

		loadAndCreateBodies();

		const selectTechnology = async (body: Body) => {
			if (!body) return;
			const tech = techs.results.find(
				t => hashStringToNumber(t.id) === body.id,
			);
			if (!tech) return;
			console.log('Selected Technology:', tech);

			const relatedTechs = techs.results.filter(
				t => t.properties['관련 기술']?.relation?.[0]?.id === tech.id,
			);

			console.log('Related Technologies:', relatedTechs);

			if (targetBodyRef.current) {
				unSelectTechnology();
			}
			targetBodyRef.current = body;
		};

		const unSelectTechnology = async () => {
			// todo 관계 해제

			targetBodyRef.current = null;
		};

		Events.on(mouseConstraintRef.current, 'mousedown', event => {
			selectTechnology(event.source.body);
		});

		// Events.on(mouseConstraint.current, 'mousemove', event => {
		//   // 마우스 포인터의 현재 위치 가져오기
		//   const mousePosition = event.mouse.position;

		//   // 가장 가까운 물체 찾기
		//   const closestBody = Query.point(
		//     engine.current.world.bodies,
		//     mousePosition,
		//   );

		//   if (closestBody) {
		//     // 가장 가까운 물체를 콘솔에 출력하거나 원하는 작업 수행
		//     console.log('Closest Body:', closestBody);

		//     // 여기에서 원하는 작업을 수행할 수 있습니다.
		//   }
		// });

		function moveObjectToTarget() {
			const targetBody = targetBodyRef.current;
			if (!targetBody) return;

			const kp = 0.0001; // 위치 오차에 대한 비례 상수 (조절 가능)
			const kd = -0.002; // 속도 오차에 대한 비례 상수 (조절 가능)

			// 현재 위치
			const currentX = targetBody.position.x;
			const currentY = targetBody.position.y;

			// 목표 지점
			const centerX = cw / 2;
			const centerY = ch / 2;
			const targetX = centerX;
			const targetY = centerY;

			// 목표 지점과의 거리
			const deltaX = targetX - currentX;
			const deltaY = targetY - currentY;

			// 속도
			const velocityX = targetBody.velocity.x;
			const velocityY = targetBody.velocity.y;

			// PD 제어
			const forceX = kp * deltaX + kd * velocityX;
			const forceY = kp * deltaY + kd * velocityY;

			// 물체에 힘 적용
			Body.applyForce(targetBody, targetBody.position, {
				x: forceX,
				y: forceY,
			});
		}

		Events.on(engineRef.current, 'beforeUpdate', () => {
			moveObjectToTarget();
		});

		Runner.run(engineRef.current);
		Render.run(render);
		console.log('run');

		// unmount
		return () => {
			// destroy Matter
			Render.stop(render);
			World.clear(engineRef.current.world, true);
			Engine.clear(engineRef.current);

			render.canvas.remove();
			render.textures = {};
		};
	}, []);

	// const isPressed = useRef(false);

	// const handleDown = () => {
	//   isPressed.current = true;
	// };

	// const handleUp = () => {
	//   isPressed.current = false;
	// };

	// const handleMouseMove = e => {
	//   try {
	//     if (isPressed.current) {
	//       const mousePosition = { x: e.clientX, y: e.clientY };
	//       Body.setPosition(
	//         mouseConstraint.current.constraint.bodyB,
	//         mousePosition,
	//       );
	//     }
	//   } catch (e) {}
	// };

	return (
		<section className="pt-16 h-screen mx-auto my-0 p-20 max-w-5xl">
			{/* <h1 className="text-4xl font-bold">Skills</h1>
      <h2 className="text-2xl">제가 구사할 수 있는 능력들이에요</h2> */}

			{/* <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 50px)',
          gridGap: '16px',
        }}>
        {techs.results.map(tech => {
          const title =
            tech.properties['환경 및 기술'].title?.[0]?.text?.content;
          const iconSlug = tech.properties.iconSlug.rich_text[0]?.plain_text;
          return (
            <IconView
              className="w-[100px] text-center"
              key={title}
              title={title}
              iconSlug={iconSlug}
            />
          );
        })}
      </div> */}

			{/* 여기서 sceneRef는 Canvas 또는 해당하는 요소에 대한 참조 */}
			<div className="fixed top-0 left-0 w-full h-full" ref={sceneRef} />
		</section>
	);
}

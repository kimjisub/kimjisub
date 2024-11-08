/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';

import React, { useEffect, useRef } from 'react';
import {
	Bodies,
	Body,
	Composite,
	Constraint,
	Engine,
	Events,
	Mouse,
	MouseConstraint,
	Render,
	Runner,
	Vector,
	World,
} from 'matter-js';

import { SkillsWithRelatedT } from '@/api/notion/skill';
import { getSvgDataFromSlug } from '@/utils/icons';

function hashStringToNumber(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
	}
	return hash;
}

export interface GraphViewProps {
	skillsWithRelated: SkillsWithRelatedT;
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default function GraphView({ skillsWithRelated }: GraphViewProps) {
	const skills = skillsWithRelated.skills;
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
					visible: true,
				},
			},
		});

		World.add(engineRef.current.world, mouseConstraintRef.current);

		// 중력과 척력 상수
		const MIN_DISTANCE = 30; // 최소 거리
		const MAX_DISTANCE = 300; // 최대 거리
		const GRAVITATIONAL_CONSTANT = 5; // 중력의 강도
		const REPULSION_CONSTANT = 4; // 척력의 강도
		const REPULSION_DISTANCE_CONSTANT = 2.2; // 척력이 미치는 거리 상수

		Events.on(engineRef.current, 'beforeUpdate', () => {
			const bodies = Composite.allBodies(engineRef.current.world);

			for (let i = 0; i < bodies.length; i++) {
				for (let j = i + 1; j < bodies.length; j++) {
					const bodyA = bodies[i];
					const bodyB = bodies[j];

					if (bodyA.isStatic || bodyB.isStatic) continue;

					// 두 물체 간 거리 벡터 및 거리 계산
					const distanceVector: Vector = Vector.sub(
						bodyB.position,
						bodyA.position,
					);
					const distance: number = Vector.magnitude(distanceVector);

					if (distance < MIN_DISTANCE || distance > MAX_DISTANCE) {
						continue;
					}

					const normalizedVector: Vector = Vector.normalise(distanceVector);

					// 중력 계산 (G = m1 * m2 / r^2)
					const gravitationalForce: number =
						(GRAVITATIONAL_CONSTANT * bodyA.mass * bodyB.mass) /
						Math.pow(distance, 2);

					// 척력 계산 (Repulsion = k / r^2)
					const repulsionForce: number =
						1 /
						Math.pow(
							distance / REPULSION_CONSTANT,
							REPULSION_DISTANCE_CONSTANT,
						);

					// 총 힘 계산 (중력 - 척력)
					const totalForceMagnitude: number =
						gravitationalForce - repulsionForce;

					// 총 힘 벡터 계산
					const totalForce: Vector = Vector.mult(
						normalizedVector,
						totalForceMagnitude,
					);

					// 힘을 각 물체에 적용
					Body.applyForce(bodyA, bodyA.position, totalForce);
					Body.applyForce(bodyB, bodyB.position, Vector.neg(totalForce));
				}
			}
		});

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

		// 화면 이동 관련 변수
		let isDraggingObject = false;
		let isDraggingViewport = false;
		let dragStart = { x: 0, y: 0 };
		let viewportX = 0;
		let viewportY = 0;
		let zoomLevel = 1;

		// 화면 줌 인/아웃
		sceneRef.current.addEventListener('wheel', event => {
			event.preventDefault();

			const zoomSpeed = 0.02;
			const oldZoomLevel = zoomLevel;

			// 줌 레벨 업데이트
			if (event.deltaY < 0) {
				zoomLevel = Math.min(zoomLevel * (1 + zoomSpeed), 5); // 최대 줌 제한
			} else {
				zoomLevel = Math.max(zoomLevel * (1 - zoomSpeed), 0.2); // 최소 줌 제한
			}

			// 캔버스 크기
			const canvasBounds = render.canvas.getBoundingClientRect();

			// 마우스 위치를 화면 좌표 -> 월드 좌표로 변환
			const mouseX = event.clientX - canvasBounds.left; // 화면 내 마우스 X 좌표
			const mouseY = event.clientY - canvasBounds.top; // 화면 내 마우스 Y 좌표

			const worldMouseX = viewportX + (mouseX - cw / 2) / oldZoomLevel;
			const worldMouseY = viewportY + (mouseY - ch / 2) / oldZoomLevel;

			// 줌 중심을 월드 좌표 기준으로 이동
			viewportX = worldMouseX - (mouseX - cw / 2) / zoomLevel;
			viewportY = worldMouseY - (mouseY - ch / 2) / zoomLevel;

			// 렌더 뷰포트 업데이트
			Render.lookAt(render, {
				min: {
					x: viewportX - cw / (2 * zoomLevel),
					y: viewportY - ch / (2 * zoomLevel),
				},
				max: {
					x: viewportX + cw / (2 * zoomLevel),
					y: viewportY + ch / (2 * zoomLevel),
				},
			});
		});

		// 물체 잡기 이벤트 (MouseConstraint 이벤트 활용)
		Events.on(mouseConstraintRef.current, 'startdrag', () => {
			isDraggingObject = true; // 물체를 잡고 있을 때 상태 활성화
		});

		Events.on(mouseConstraintRef.current, 'enddrag', () => {
			isDraggingObject = false; // 물체 잡기 해제
		});

		// 뷰포트 이동 이벤트
		sceneRef.current.addEventListener('mousedown', event => {
			if (isDraggingObject) return; // 물체를 잡고 있을 때는 화면 이동 비활성화

			isDraggingViewport = true;
			dragStart = { x: event.offsetX, y: event.offsetY };
		});

		sceneRef.current.addEventListener('mousemove', event => {
			if (!isDraggingViewport || isDraggingObject) return; // 물체를 잡고 있을 때 이동 중단

			const deltaX = (dragStart.x - event.offsetX) / zoomLevel;
			const deltaY = (dragStart.y - event.offsetY) / zoomLevel;

			viewportX += deltaX;
			viewportY += deltaY;

			dragStart = { x: event.offsetX, y: event.offsetY };

			Render.lookAt(render, {
				min: {
					x: viewportX - cw / (2 * zoomLevel),
					y: viewportY - ch / (2 * zoomLevel),
				},
				max: {
					x: viewportX + cw / (2 * zoomLevel),
					y: viewportY + ch / (2 * zoomLevel),
				},
			});
		});

		sceneRef.current.addEventListener('mouseup', () => {
			isDraggingViewport = false;
		});
		// boundaries
		// World.add(engineRef.current.world, [
		// 	Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
		// 	Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
		// 	Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
		// 	Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
		// ]);

		const items: { [key in string]: Body } = {};

		const loadAndCreateBodies = async () => {
			let i = 0;
			for (const skill of skills) {
				// if (i > 10) break;
				// i++;
				await sleep(100);
				const svgData = getSvgDataFromSlug(skill.slug);
				try {
					const body = Bodies.rectangle(cw / 2, ch / 2, 50, 50, {
						chamfer: { radius: 16 }, // 둥근 모서리
						inertia: Infinity, // 회전을 방지
						mass: 1, // 질량
						// frictionAir: 3, // 공기 저항
						// 중력
						velocity: { x: 0, y: 0 },
						render: {
							sprite: {
								texture: svgData,
								xScale: 1,
								yScale: 1,
							},
						},
						id: hashStringToNumber(skill.id),
					});

					// 연결 추가
					const constraints: Constraint[] = [];
					// for (const relatedSkill of skill.relatedSkills) {
					// 	const relatedBody = items[relatedSkill.id];
					// 	if (!relatedBody) continue;

					// 	const constraint = Constraint.create({
					// 		bodyA: body,
					// 		bodyB: relatedBody,
					// 		length: 100,
					// 		stiffness: 0.0001,
					// 		damping: 0.1,
					// 	});
					// 	constraints.push(constraint);
					// }

					World.add(engineRef.current.world, [body, ...constraints]);
					items[skill.id] = body;
				} catch (error) {
					console.error('Error Create:', error);
				}
			}
		};

		loadAndCreateBodies();

		const selectTechnology = async (body: Body) => {
			// if (!body) return;
			// const tech = techs.results.find(
			// 	t => hashStringToNumber(t.id) === body.id,
			// );
			// if (!tech) return;
			// console.log('Selected Technology:', tech);
			// const relatedTechs = techs.results.filter(
			// 	t => t.properties['관련 기술']?.relation?.[0]?.id === tech.id,
			// );
			// console.log('Related Technologies:', relatedTechs);
			// if (targetBodyRef.current) {
			// 	unSelectTechnology();
			// }
			// targetBodyRef.current = body;
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
	}, [skills]);

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
		<section className="">
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
			<div className="w-full h-full" ref={sceneRef} />
		</section>
	);
}

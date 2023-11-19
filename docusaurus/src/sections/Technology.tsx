import React, { useEffect, useRef } from 'react';
import { Build } from '@mui/icons-material';
import { IconView } from '@site/src/components/index/IconView';
import techs from '@site/src/db/data/techs.json';
import { Title, Title2 } from '@site/src/typography';
import {
  Bodies,
  Body,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  World,
} from 'matter-js';
import * as icons from 'simple-icons';
import { SimpleIcon } from 'simple-icons';
import styled from 'styled-components';
const Root = styled.div`
  max-width: 1000px;
  padding: 5em 0;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 50px);
  grid-gap: 16px;
`;

const GridItem = styled.div`
  text-align: center;
`;

function generateIconSvgCode(iconSlug: string) {
  const icon =
    iconSlug &&
    (icons?.[
      `si${iconSlug.charAt(0).toUpperCase() + iconSlug.slice(1)}`
    ] as SimpleIcon | null);
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

function hashStringToNumber(str) {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }

  return hash;
}

export default function Technology() {
  const sceneRef = useRef();
  const engineRef = useRef(Engine.create());
  const mouseRef = useRef<Mouse>();
  const mouseConstraintRef = useRef<MouseConstraint>();
  const targetBodyRef = useRef<Body | null>(null);

  useEffect(() => {
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

    // Runner.run(engineRef.current);
    // Render.run(render);

    // unmount
    return () => {
      // destroy Matter
      Render.stop(render);
      World.clear(engineRef.current.world, true);
      Engine.clear(engineRef.current);

      render.canvas.remove();
      render.canvas = null;
      render.context = null;
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
    <div>
      <Root>
        <Title>
          <Build />
          Skills
        </Title>
        <Title2>제가 구사할 수 있는 능력들이에요</Title2>

        <GridContainer>
          {techs.results.map(tech => {
            const title =
              tech.properties['환경 및 기술'].title?.[0]?.text?.content;
            const iconSlug = tech.properties.iconSlug.rich_text[0]?.plain_text;
            return (
              <GridItem key={title}>
                <IconView
                  title={title}
                  iconSlug={iconSlug} // description={skill.description}
                />
              </GridItem>
            );
          })}
        </GridContainer>
      </Root>
      <div
      // onMouseDown={handleDown}
      // onMouseUp={handleUp}
      // onMouseMove={handleMouseMove}
      >
        <div
          ref={sceneRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
}
import React, { useEffect } from 'react';
import styled from 'styled-components';

import Introduce from '../components/index/pages/Introduce';
import Technology from '../components/index/pages/Technology';
import TimeLinePage from '../components/index/pages/TimeLinePage';
import careers from '../db/data/careers.json';
import projects from '../db/data/projects.json';

export default function Home() {
  useEffect(() => {
    // set title
    document.title = `개발자 김지섭 포트폴리오`;

    // set description
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content =
      '안드로이드 개발을 주력으로 하고 있으며 다양한 프로젝트에서 웹 백엔드와 프론트엔드 파트를 맡아본 경험이 있는 풀스택 지망 개발자에요.';
    document.head.appendChild(meta);
  }, []);

  /*

자기소개 ( 명함 )
프로젝트
업적 (경력)


*/

  return (
    <Root>
      <Introduce />
      <Technology />
      <TimeLinePage />
      {/* <Projects /> */}
      {careers.results.map(career => (
        <p key={career.id}>
          <p>{career.properties.이름.title?.[0]?.text?.content}</p>
          {/* <pre
              style={{
                fontSize: '0.5rem',
              }}>
              {JSON.stringify(career, null, 2)}
            </pre> */}
        </p>
      ))}
      {projects.results.map(career => (
        <p key={career.id}>
          <p>{career.properties.이름.title?.[0]?.text?.content}</p>
          {/* <pre
              style={{
                fontSize: '0.5rem',
              }}>
              {JSON.stringify(career, null, 2)}
            </pre> */}
        </p>
      ))}
    </Root>
  );
}

const Root = styled.div`
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

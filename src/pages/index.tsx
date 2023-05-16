import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.scss';
import Introduce from './Introduce';
import TimeLine from './TimeLine';
import Technology from './Technology';
import Projects from './Projects';

import styled from 'styled-components';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  const projectRef = useRef<HTMLIFrameElement>(null);

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

  return (
    <Layout>
      <Root className={clsx(styles.root)}>
        <Introduce className={clsx(styles.content)} />
        <Technology />
        <TimeLine />
        {/* <Projects /> */}
      </Root>
    </Layout>
  );
}

const Root = styled.div``;

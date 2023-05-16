import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import styled, { keyframes } from 'styled-components';

import { Content } from '../../../../typography';

import styles from './index.module.scss';

const intros = [
  '배우는 것을 즐기는 개발자',
  '아이디어를 실현하는 개발자',
  '끊임없이 도전하는 개발자',
  '지속적인 변화를 추구하는 개발자',
];
import TextTransition, { presets } from 'react-text-transition';

export default function Introduce() {
  const [intro, setIntro] = useState(intros[0]);

  // replace intro text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const index = intros.indexOf(intro);
      const nextIndex = index + 1 >= intros.length ? 0 : index + 1;
      setIntro(intros[nextIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, [intro]);

  return (
    <Root>
      <IntroductionText>
        <TextTransition springConfig={presets.gentle} inline>
          {intro}
        </TextTransition>{' '}
        <Name>김지섭</Name>입니다! <Hand>👋</Hand>
      </IntroductionText>
      <div>
        <Content>
          안드로이드 개발을 주력으로 하고 있으며 다양한 프로젝트에서
          <br />웹 백엔드와 프론트엔드 파트를 맡아본 경험이 있는 풀스택 지망
          개발자에요.
        </Content>
      </div>
      <div className={styles.buttons}>
        <Link
          className="button button--secondary button--lg"
          to="/portfolio/intro">
          포트폴리오
        </Link>

        <Link className="button button--secondary button--lg" to="/blog">
          블로그
        </Link>
      </div>
    </Root>
  );
}

const Root = styled.div`
  height: 100vh;

  align-content: center;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const IntroductionText = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #4c4c4c;
  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Name = styled.span`
  font-size: 6rem;
  font-weight: 700;
  color: #000000;
  @media screen and (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
`;

const Hand = styled.span`
  animation-name: ${Shake};
  animation-duration: 0.25s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
`;

import React from 'react';
import Gap from '@site/src/components/Gap';
import ExperienceView from '@site/src/components/resume/ExperienceView';
import HistoryBlock from '@site/src/components/resume/HistoryBlock';
import ItemTitle from '@site/src/components/resume/ItemTitle';
import Page from '@site/src/components/resume/Page';
import Table from '@site/src/components/resume/Table';
import styled from 'styled-components';

import ProfileImage from '../profile.jpg';

import icApple from './apple.svg';
import icGithub from './github.svg';
import icPlaystore from './playstore.svg';

const Introduce = styled.div``;

export default function Resume() {
  return (
    <Root>
      <Page>
        <Header>
          <Gap gap="2em">
            <img
              src={ProfileImage}
              alt="profile"
              style={{
                height: '13em',
              }}
            />
            <Gap gap="0em" direction="column">
              <Introduce>
                <h1>김지섭</h1>
              </Introduce>
              <p>
                성공적으로 IT 프로젝트를 주도하고 24회의 관련 대회 수상 경험을
                보유한 Software Engineer, 김지섭입니다. 고객이 추구하는 가치를
                파악하고 이해하는 것을 즐기며, 이를 바탕으로 실질적인 서비스를
                기획하고 실현하는 것에 자신감이 있습니다. 세부적인 UX 디자인을
                기획하며 구체화하고, DB 설계 및 프론트엔드, 백엔드 코드를
                작성하여 실제로 서비스가 동작할 수 있도록 개발자로써의 역할을
                수행해 왔습니다. 또한, 서비스의 안정성과 지속성을 확보하기 위해
                CI/CD Workflow를 구축하고, 클라우드 또는 자체 서버를 통해
                서비스를 배포해 본 경험도 갖추고 있습니다.
              </p>
            </Gap>
          </Gap>
        </Header>
        <section>
          <Gap gap="2em">
            <div>
              <Article>
                <ItemTitle title="인적사항" subtitle="PERSONAL DETAIL" />
                <Table
                  data={[
                    ['생년월일', '2001.02.26. (만 22세)'],
                    ['휴대폰 번호', '+82 10 8752 5327'],
                    ['이메일', '0226daniel@gmail.com'],
                    [
                      'Github',
                      <A href="https://github.com/kimjisub/" key="github">
                        kimjisub
                      </A>,
                    ],
                    [
                      '포트폴리오',
                      <A href="https://kimjisub.notion.site/" key="website">
                        kimjisub.notion.site
                      </A>,
                    ],
                    // [
                    //   '웹사이트',
                    //   <A href="https://jisub.kim/" key="website">
                    //     jisub.kim
                    //   </A>,
                    // ],
                  ]}
                  colRatio={[1, 3]}
                />
              </Article>
              <Article>
                <ItemTitle title="학력" subtitle="EDUCATION" />
                <Table
                  data={[
                    [
                      '2020 - 현재',
                      ['한국외국어대학교', '컴퓨터전자시스템공학부'],
                      '2학년 재학',
                    ],
                    [
                      '2017 - 2019',
                      ['한국디지털미디어고등학교', '해킹방어과'],
                      '졸업',
                    ],
                  ]}
                  colRatio={[0.8, 1.5, 0.7]}
                />
              </Article>
            </div>
            <Gap gap="2em" direction="column">
              <div>
                <Article>
                  <ItemTitle title="기술" subtitle="SKILLS" />
                  <Table
                    data={[
                      [
                        'App',
                        [
                          'React Native (TS, Query, Recoil),',
                          'Android Native (Java, Kotlin),',
                        ],
                      ],
                      [
                        'Web',
                        ['HTML, CSS, Javascript,', 'React (TS, Query, Recoil)'],
                      ],
                      [
                        'Server',
                        'Node.js, Express.js, Nest.js, Hapi, Prisma, MySQL, Postgres, MongoDB, Redis, Swagger',
                      ],
                      [
                        'Cloud',
                        'AWS (EC2, S3, ECS), Firebase (GCP, Firestore, Storage, Functions, Hosting)',
                      ],
                      ['CI/CD', 'Docker, Github Actions, Jenkins'],
                      ['Design', ['Figma, Sketch, Zeplin']],
                      ['Tools', 'Github, Notion, Slack, Linear.app, Jira'],
                    ]}
                    colRatio={[1, 4]}
                  />
                </Article>
              </div>
            </Gap>
          </Gap>
          <Article>
            <ItemTitle title="경력" subtitle="EXPERIENCE" />
            <ExperienceView
              title="한국외국어대학교 IDS Lab."
              subtitle="NVM(비휘발성 메모리)의 특성을 고려한 데이터베이스 시스템, In-Storage Computing 등을 주제로 연구"
              histories={[
                {
                  title: '학부연구생',
                  date: '2023.04 - 현재',
                  list: [
                    'Shell Script 이용하여 MySQL TPCC 벤치마크 자동화 도구 개발',
                    'InnoDB 코드 분석 및 개선점 연구',
                    'OpenSSD를 이용한 NVM 기반 데이터베이스 시스템 연구',
                  ],
                },
              ]}
            />
            <ExperienceView
              title="The Vplanet Inc."
              subtitle="광고영상 자동제작 및 송출 플랫폼 'Vplate' 운영"
              histories={[
                {
                  title: 'Software Engineer',
                  date: '2019.02 - 09',
                  list: [
                    // 'Kotlin, MVVM 패턴을 활용하여 Android 앱 개발',
                    'Android Native로 FFmpeg 기반 영상 편집 기능 개발',
                    // 'Node.js, Express.js, MongoDB를 활용하여 REST API 개발',
                    'After Effect 에셋 교체 전자동 엔진 개발',
                    '다중 렌더링 머신 스케줄링 및 관리 시스템 개발',
                  ],
                },
              ]}
            />
          </Article>
        </section>
      </Page>
      <Page>
        <Article>
          <ItemTitle title="프로젝트 및 활동" subtitle="PROJECTS & ACTIVITY" />
          <HistoryBlock
            history={{
              title: 'UniPad',
              date: '2016.02 - 현재',
              list: [
                '런치패드 기반의 연주형 리듬게임 1인 개발',
                'Play Store 에 출시, 500만+ 다운로드 달성',
                '음악게임부문 1위, 전체게임부문 50위 기록',
                'Task 스케줄링 및 메모이제이션 구현하여 초당 200회 이상의 LED Emulation 처리',
                'MIDI 장치 연동을 위한 자체 드라이버 인터페이스 개발',
                '사용기술: Java, Kotlin, Xml, Android Native',
              ],
              urls: [
                {
                  icon: icGithub,
                  name: 'Github',
                  url: 'https://github.com/kimjisub/unipad-android',
                },
                {
                  icon: icPlaystore,
                  name: 'Play Store',
                  url: 'https://play.google.com/store/apps/details?id=com.kimjisub.launchpad',
                },
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: 'Mopl',
              date: '2022.09 - 현재',
              list: [
                '한화 비전에서 진행중인 아파트 커뮤니티 및 주차 관리 솔루션 외주 형태 계약',
                '82개의 페이지, 120개의 API를 가진 React Native 기반의 모바일 앱 개발',
                '36개의 디자인 시스템 컴포넌트 구현',
                '사용기술: React Native, Typescript, Query, Recoil, Firebase',
              ],
              urls: [
                {
                  icon: icApple,
                  name: 'Appstore',
                  url: 'https://apps.apple.com/kr/app/mopl-%EB%AA%A8%ED%94%8C-%ED%95%9C%ED%99%94%EB%B9%84%EC%A0%84/id1665024541',
                },
                {
                  icon: icPlaystore,
                  name: 'Play Store',
                  url: 'https://play.google.com/store/apps/details?id=com.hanwha.mopl',
                },
              ],
            }}
          />
          {/* <HistoryBlock
            history={{
              title: '행명서',
              date: '2021.08. - 2022.07',
              list: [
                '복잡한 부대 내의 일정을 고려하여 공평한 근무 시간표를 자동으로 생성해주는 웹 서비스',
                '50여명의 부대원의 근무 시간표를 약 1년간 관리',
                'Html, CSS, Vanilla JS 를 이용하여 외부 리소스 없이 개발',
              ],
            }}
          /> */}
          {/* <HistoryBlock
            history={{
              title: '설리번 프로젝트 선생님',
              date: '2019.01.',
              list: [
                '코딩 교육 선생님으로서 활동하며 ‘게임으로 배우는 웹해킹’ 커리큘럼 제작 및 교육 진행',
              ],
            }}
          /> */}
          <HistoryBlock
            history={{
              title: '디미고 라이프',
              date: '2018.03 - 2019.12',
              list: [
                '600여명의 한국디지털미디어고등학교 학생들을 위한 전산 서비스 제공',
                '주말 잔류, 지도일지, 급식 신청 등 학교 생활에 필요한 기능 포함',
                'Express.js, MySQL, Sequelize 등을 활용하여 REST API 개발',
                'Socket.io 프로토콜을 활용하여 실시간 현황 모니터링 기능 개발',
                '사용기술: Node.js, Express.js, MySQL, Sequelize, Socket.io',
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: '국방부 인터넷 편지 뉴스레터',
              date: '2021.01',
              list: [
                '입대를 앞두고 진행한 정보력 단절을 극복하고자 한 프로젝트',
                '뉴스 헤드라인을 더캠프 인터넷 편지로 자동 발송',
                'Github Actions Scheduler를 이용하여 코드가 매일 동작하도록 구성',
                '5주의 훈련소 기간동안 100여편의 사회, 경제, IT 뉴스 수신',
                '사용기술: Node.js, Github Actions',
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: 'Video Skipper',
              date: '2023.04. - 현재',
              list: [
                '영상에서 음성이 없는 부분을 자동으로 제거하여 길이를 줄여주는 오픈소스 프로젝트',
                'Node.js, Typescript, FFmpeg, WASM 등을 활용하여 개발',
                'Github Action 이용하여 빌드 및 Npm.js 배포 자동화',
                '사용기술: Node.js, Typescript, FFmpeg, WASM, Github Actions',
              ],
              urls: [
                {
                  icon: icGithub,
                  name: 'Github',
                  url: 'https://github.com/kimjisub/video-skipper',
                },
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: 'CANETIS',
              date: '2018.03',
              list: [
                '시각 장애우를 위한 실내 전용 위치 알림 IoT 서비스',
                'Firebase의 Firestore, Functions, Messaging 활용하여 서버리스 환경으로 구현',
                'TTS & STT 기능을 활용하여 음성 기반 인터페이스 설계',
                'Android Accessibility Service 이용하여 접근성 도구로 앱 제어 기능 제공',
                '사용기술: Java, Kotlin, Xml, Android Native, Firebase',
              ],
            }}
          />
        </Article>
      </Page>
    </Root>
  );
}

const Root = styled.div`
  --color-text: #1c1e21;

  all: unset;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  // horizontal centering
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
  background-color: #1c1e21;
  @media print {
    align-items: unset;
    box-shadow: none;
    margin: 0;
  }
  * {
    word-break: keep-all;
  }
`;

const Header = styled.header`
  display: flex;
  margin-bottom: 2em;
`;

const Article = styled.article``;

const A = styled.a`
  color: var(--color-text);
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
    color: #1c1e21;
  }
`;

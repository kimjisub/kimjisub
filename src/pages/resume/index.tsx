import React from 'react';
import Gap from '@site/src/components/Gap';
import HistoryBlock from '@site/src/components/resume/HistoryBlock';
import ItemTitle from '@site/src/components/resume/ItemTitle';
import Page from '@site/src/components/resume/Page';
import Table from '@site/src/components/resume/Table';
import styled from 'styled-components';

import ExperienceView from '../../components/resume/ExperienceView';

import ProfileImage from './profile.png';

const Introduce = styled.div``;

export default function Resume() {
  return (
    <Root>
      <Page>
        <Header>
          <Image src={ProfileImage} alt="profile" />
          <Introduce>
            <p>asdf</p>
            <h1>김지섭</h1>
          </Introduce>
        </Header>
        <section>
          <Gap gap="24px">
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
                      '웹사이트',
                      <A href="https://jisub.kim/" key="website">
                        jisub.kim
                      </A>,
                    ],
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
            <Gap gap="24px" direction="column">
              <div>
                <Article>
                  <ItemTitle title="기술" subtitle="SKILLS" />
                  <Table
                    data={[
                      [
                        'App',
                        [
                          'React Native (TS, Query, Recoil),',
                          'Android Native (Kotlin, Java, Compose),',
                          'Flutter',
                        ],
                      ],
                      ['Web', 'React.js, Next.js, Wasm (Rust)'],
                      [
                        'Server',
                        'Node.js, Express.js, Nest.js, Hapi, Prisma, MySQL, MongoDB, Redis',
                      ],
                      ['DevOps', 'Docker, AWS, Github Actions'],
                      [
                        'Design',
                        [
                          'Figma, Sketch, Zeplin,',
                          'Design System (Material, Ant, Cupertino)',
                        ],
                      ],
                      ['Tools', 'Github, Notion, Slack, Linear.app'],
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
                    'MySQL TPCC 벤치마크 자동화 도구 개발',
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
                    'Kotlin, MVVM 패턴을 활용하여 Android 앱 개발',
                    'Android Native로 FFmpeg 기반 영상 편집 기능 개발',
                    'Node.js, Express.js, MongoDB를 활용하여 REST API 개발',
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
              title: (
                <A href="https://play.google.com/store/apps/details?id=com.kimjisub.launchpad">
                  UniPad
                </A>
              ),
              date: '2016.02 - 현재',
              list: [
                '런치패드 기반의 연주형 리듬게임 1인 개발',
                <span key={1}>
                  <A href="https://play.google.com/store/apps/details?id=com.kimjisub.launchpad">
                    Play Store
                  </A>
                  에 출시, 500만+ 다운로드 달성
                </span>,
                '음악게임부문 1위, 전체게임부문 50위 기록',
                'Task 스케줄링 및 메모이제이션 구현하여 초당 200회 이상의 LED Emulation 처리',
                'MIDI 장치 연동을 위한 자체 드라이버 인터페이스 개발',
                <span key={5}>
                  독자적 디자인 시스템 구축 및 라이브러리{' '}
                  <A href="https://jitpack.io/#kimjisub/UniPad-DesignKit">
                    jitpack.io
                  </A>
                  에 배포
                </span>,
                'AAC Room 이용하여 로컬 데이터베이스 구축',
                'LiveData, ViewModel, DataBinding 등의 아키텍처 적용',
                'Java to Kotlin 마이그레이션 진행',
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: (
                <A href="https://play.google.com/store/apps/details?id=com.hanwha.mopl">
                  Mopl
                </A>
              ),
              date: '2022.09 - 현재',
              list: [
                '한화 비전에서 진행중인 아파트 커뮤니티 및 주차 관리 솔루션 외주 형태 계약',
                '82개의 페이지, 120개의 API를 가진 React Native 기반의 모바일 앱 개발',
                '36개의 디자인 시스템 컴포넌트 구현',
                '디자인 팀과 주기적으로 회의 및 피드백 진행',
                '자체 디자인 규칙 및 컴포넌트 라이브러리 개발',
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: (
                <A href="https://github.com/kimjisub/video-skipper">
                  Video Skipper
                </A>
              ),
              date: '2023.04. - 현재',
              list: [
                '영상에서 음성이 없는 부분을 자동으로 제거하여 길이를 줄여주는 오픈소스 프로젝트',
                'Node.js, Typescript, FFmpeg, WASM 등을 활용하여 개발',
                'Npm.js에 배포, 누적 다운로드 300+ 달성',
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
          <HistoryBlock
            history={{
              title: '설리번 프로젝트 선생님',
              date: '2019.01.',
              list: [
                '코딩 교육 선생님으로서 활동하며 ‘게임으로 배우는 웹해킹’ 커리큘럼 제작 및 교육 진행',
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: '디미고 라이프',
              date: '2018.03 - 2019.12',
              list: [
                '600여명의 한국디지털미디어고등학교 학생들을 위한 전산 서비스 제공',
                '주말 잔류, 지도일지, 급식 신청 등 학교 생활에 필요한 기능 포함',
                'Express.js, MySQL, Sequelize 등을 활용하여 REST API 개발',
                'Socket.io 프로토콜을 활용하여 실시간 현황 모니터링 기능 개발',
                'Swagger 문서화를 통하여 프론트 팀에게 API 문서 제공',
                'Excel 불러오기 및 내보내기 기능 개발',
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
              ],
            }}
          />
          <HistoryBlock
            history={{
              title: '카카오톡 채팅 분석기',
              date: '2015.04.',
              list: [
                '카카오톡 대화 내보내기 기능을 이용하여 대화를 분석해주는 앱 개발',
                '주로 활동한 시간, 가장 많이 사용한 단어 등을 분석해주는 기능 제공',
                'Java, Android Studio를 활용하여 개발',
                '5000+ 다운로드 달성',
                'Material UI 디자인 규칙을 준수하여 개발',
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
  font-size: 12px;
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
`;

const Header = styled.header`
  display: flex;
  margin-bottom: 2em;
`;

const Article = styled.article``;

const Image = styled.img`
  height: 200px;
`;

const A = styled.a`
  color: var(--color-text);
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
    color: #1c1e21;
  }
`;

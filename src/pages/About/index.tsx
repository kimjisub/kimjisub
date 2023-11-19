import React, { useEffect } from 'react';

import IntroduceSection from './sections/IntroduceSection';
import TimeLineSection from './sections/TimeLineSection';

export default function AboutPage() {
  useEffect(() => {
    // set title
    document.title = `About Jisub.kim`;

    // set description
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content =
      '안드로이드 개발을 주력으로 하고 있으며 다양한 프로젝트에서 웹 백엔드와 프론트엔드 파트를 맡아본 경험이 있는 풀스택 지망 개발자에요.';
    document.head.appendChild(meta);
  }, []);

  /*

자기소개 ( 명함 )
기술
프로젝트
업적 (경력)
  Github

연락처


*/

  return (
    <div className="select-none">
      <IntroduceSection />
      <TimeLineSection />
    </div>
  );

  // return (
  //   <Root>
  //     <Introduce />
  //     <Technology />
  //     <TimeLinePage />
  //     <Projects />

  //     <GridContainer>
  //       {careers.results.map(career => {
  //         const icon = {
  //           emoji: <span>{career.icon?.emoji}</span>,
  //           file: (
  //             <img
  //               style={{
  //                 width: '24px',
  //                 height: '24px',
  //               }}
  //               src={career.icon?.file?.url}
  //             />
  //           ),
  //         }[career.icon?.type] ?? <></>;
  //         return (
  //           <GridItem key={career.id}>
  //             <div
  //               style={{
  //                 display: 'flex',
  //                 flexDirection: 'column',
  //                 alignItems: 'center',
  //               }}>
  //               <div>asdf</div>
  //               <p>
  //                 {icon}
  //                 {career.properties.이름.title?.[0]?.text?.content}
  //               </p>
  //               <p>{career.properties?.['수상 순위']?.select?.name}</p>
  //               {/* <pre
  //                 style={{
  //                   fontSize: '0.5rem',
  //                 }}>
  //                 {JSON.stringify(career, null, 2)}
  //               </pre> */}
  //             </div>
  //           </GridItem>
  //         );
  //       })}
  //     </GridContainer>
  //   </Root>
  // );
}

// const GridContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, 200px);
//   grid-gap: 16px;
// `;

// const GridItem = styled.div`
//   text-align: center;
// `;

import React from 'react';

import { Title } from '@/components/Title';

const list = [
  {
    year: 2017,
    title: (
      <>
        <span style={{ color: '#D31877' }}> 한국디지털미디어고등학교 </span>
        16기 해킹방어과 입학
      </>
    ),
    content: 'IT 특성화고',
  },
  {
    year: 2020,
    title: '한국외국어대학교 20학번 컴퓨터공학부 입학',
    content: '컴퓨터공학을 더 깊이 공부하기 위해 입학',
  },
  {
    year: 2023,
    title: 'HUFS IDS Lab. 학부연구생',
    content:
      'MySql과 같은 DB 엔진을 SSD 컨트롤러 단계에서 구현하여 성능을 향상시키는 연구 진행',
  },
].reverse();

// const Root = styled.div`
//   max-width: 1000px;
//   padding: 5em 0;
//   margin: 0 auto;

//   .text {
//     text-align: end;
//     align-self: center;
//     padding: 0;
//     padding-right: 10px;
//   }

//   .icons {
//     > * {
//       float: left;
//       margin: 10px;
//     }
//     padding: 0;
//   }

//   .table {
//     width: fit-content;
//     margin: auto;

//     tr {
//       border: none;

//       &:nth-child(2n) {
//         background-color: #0000;
//       }

//       td {
//         border: none;
//       }
//     }
//   }
// `;

export default function EducationSection({
  className,
}: {
  className?: string;
}) {
  return (
    <section className={`justify-center items-center ${className ?? ''}`}>
      <div className="w-full max-w-5xl mx-auto px-4">
        <Title title="Education" subTitle="" />

        <div className="mx-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">년도</th>
                <th className="text-left">제목</th>
                <th className="text-left">내용</th>
              </tr>
            </thead>
            <tbody>
              {list.map((data, i) => (
                <tr key={i.toString()} className="border-b">
                  <td className="p-4">{data.year}</td>
                  <td className="p-4">{data.title}</td>
                  <td className="p-4">{data.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

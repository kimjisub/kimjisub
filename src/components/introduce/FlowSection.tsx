import { Chip } from './Chip';
import { Section } from './Section';

/**
 * 지나온 길. 사람이 하던 일을 무엇으로 넘겼는지 연도순으로 다섯 칸.
 * 왼쪽 연도(세리프 숫자), 가는 세로선과 점, 오른쪽에 회사, 사람이 하던 일, 한 문장, 결과 한 조각.
 */
const steps = [
  {
    year: '2016',
    org: 'UniPad',
    task: '곡 만들기',
    text: '제가 다 만들 수 없던 곡을, 사용자가 직접 만들어 올리게 했습니다.',
    result: '1,000만 다운로드',
  },
  {
    year: '2019',
    org: 'VPLATE',
    task: '광고 영상 제작',
    text: '직원이 템플릿마다 한 시간씩 만들던 영상을, 고객이 휴대폰에서 직접 만들게 했습니다.',
    result: '고객 셀프 제작',
  },
  {
    year: '2020',
    org: 'Silicon Bridge',
    task: '주차장 개설',
    text: '현장마다 개발이 필요하던 요금 계산을 설정만 바꾸면 되게 했습니다.',
    result: '새 주차장을 개발 없이 개설',
  },
  {
    year: '2022',
    org: 'Alpaon',
    task: '서버 임대와 장비 관리',
    text: '계약마다 사람이 세팅하던 서버는 결제하면 바로 만들어지게, 공장 장비는 현장에 가지 않고 원격으로 고치게 했습니다.',
    result: '고객사 약 10곳',
  },
  {
    year: '2025',
    org: 'Candid',
    task: '후보자 찾기',
    text: '컨설턴트가 3~5시간씩 하던 후보 서치를 AI 검색 도구로 70분까지 줄였습니다. 이번에는 작업이 아니라 누가 이 자리에 맞는지 고르는 판단까지 넘겼습니다.',
    result: '첫 달 계약 2건',
  },
];

export const FlowSection = () => {
  return (
    <Section id="path" title="Path">
      <ol className="relative">
        {steps.map(({ year, org, task, text, result }, i) => (
          <li
            key={year}
            className="group relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-5 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-x-8"
          >
            <p className="meta-num pt-px font-serif text-[1.375rem] leading-[1.3] text-foreground md:text-[1.625rem] md:leading-[1.15]">
              {year}
            </p>
            <div className="relative min-w-0 pb-10 pl-6 group-last:pb-0 md:pb-12 md:pl-8">
              {/* 세로선: 다음 칸의 점 바로 앞까지 이어지고, 마지막 칸에는 없다 */}
              {i < steps.length - 1 && (
                <span aria-hidden className="absolute -bottom-[0.45rem] left-[3px] top-[1.15rem] w-px bg-border" />
              )}
              <span
                aria-hidden
                className={`absolute left-0 top-[0.6rem] h-[7px] w-[7px] rounded-full ${
                  i === steps.length - 1 ? 'bg-accent' : 'bg-border-strong'
                }`}
              />
              <p className="text-sm font-medium text-muted-foreground">{org}</p>
              <h3 className="mt-0.5 text-lg font-semibold tracking-[-0.02em] text-foreground md:text-xl">{task}</h3>
              <p className="prose-ko mt-2 text-foreground/85">{text}</p>
              <div className="mt-3">
                <Chip>{result}</Chip>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-14 max-w-[34ch] border-l-2 border-accent pl-5 text-[1.25rem] font-semibold leading-[1.6] tracking-[-0.02em] text-foreground md:text-[1.375rem]">
        처음에는 사람이 하던 작업을 제품에 넘겼고, 지금은 사람이 하던 판단까지 넘기고 있습니다.
      </p>
    </Section>
  );
};

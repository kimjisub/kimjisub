/**
 * 바깥 사이트로 나가는 링크 옆에 붙이는 작은 표시.
 * 글자 화살표 대신 선 하나짜리 SVG 를 쓴다. 글자 크기를 따라가고, 화면 읽기 도구에는 읽히지 않는다.
 */
export const ExternalIcon = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`ml-[0.2em] inline-block h-[0.7em] w-[0.7em] align-[0.05em] opacity-60 ${className}`}
  >
    <path d="M4 2.5h5.5V8M9.5 2.5 2.5 9.5" />
  </svg>
);

/** 직책이 바뀐 흐름을 보여 주는 오른쪽 화살표. 화면 읽기 도구와 복사한 글에는 "에서" 로 남는다 */
export const ArrowIcon = () => (
  <>
    <span className="sr-only"> 에서 </span>
    <svg
      aria-hidden="true"
      viewBox="0 0 16 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-[0.35em] inline-block h-[0.7em] w-[0.95em] align-[0.02em] opacity-70"
    >
      <path d="M1.5 6h13M10 1.5 14.5 6 10 10.5" />
    </svg>
  </>
);

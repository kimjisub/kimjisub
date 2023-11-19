import React, { useEffect, useState } from 'react';

export default function IntroduceSection({
  className,
}: {
  className?: string;
}) {
  const [intro, setIntro] = useState('배우는 것을 즐기는 개발자');

  useEffect(() => {
    const intros = ['과감한 개발자', '세상에 호기심이 많은 제너럴리스트'];

    const interval = setInterval(() => {
      setIntro(intros[(intros.indexOf(intro) + 1) % intros.length]);
    }, 5000);

    return () => clearInterval(interval);
  }, [intro]);

  return (
    <div
      className={`h-screen flex flex-col justify-center items-center m-auto p-8 ${className}`}>
      <div className="text-2xl font-bold text-gray-700 mb-4">
        {intro} <span className="text-6xl font-bold text-black">김지섭</span>
        입니다! <span>👋</span>
      </div>
      <div>
        <p>서비스 기획, 구체화, 설계, 개발, 운영 및 배포까지</p>
        <p></p>
      </div>
    </div>
  );
}

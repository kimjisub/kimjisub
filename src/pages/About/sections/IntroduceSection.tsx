import React, { useEffect, useState } from 'react';

export default function IntroduceSection() {
  const [intro, setIntro] = useState('배우는 것을 즐기는 개발자');

  useEffect(() => {
    const intros = [
      '배우는 것을 즐기는 개발자',
      '아이디어를 실현하는 개발자',
      '끊임없이 도전하는 개발자',
      '지속적인 변화를 추구하는 개발자',
    ];

    const interval = setInterval(() => {
      setIntro(intros[(intros.indexOf(intro) + 1) % intros.length]);
    }, 5000);

    return () => clearInterval(interval);
  }, [intro]);

  return (
    <div className="h-screen flex flex-col justify-center items-center m-auto">
      <div className="text-3xl font-bold text-gray-700 sm:text-xl mb-4">
        {intro}{' '}
        <span className="text-6xl font-bold text-black sm:text-3xl">
          김지섭
        </span>
        입니다! <span>👋</span>
      </div>
      <div>
        <p>
          안드로이드 개발을 주력으로 하고 있으며 다양한 프로젝트에서
          <br />웹 백엔드와 프론트엔드 파트를 맡아본 경험이 있는 풀스택 지망
          개발자에요.
        </p>
      </div>
    </div>
  );
}

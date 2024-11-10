'use client';

import React from 'react';
import { Text } from '@radix-ui/themes';
import Image from 'next/image';

export default function IntroduceSection() {
  return (
    <section>
      <div className="flex flex-col md:flex-row mx-auto content-center items-center justify-center snap-start max-w-5xl p-8">
        <div className="flex flex-col content-center items-center self-center space-y-4 m-8">
          <Image
            src="/logo192.png"
            className="rounded-full w-32 h-32"
            alt={''}
            width={128}
            height={128}
          />
          <h1 className="text-6xl font-extralight">김지섭</h1>
        </div>
        <div className="max-w-sm self-center text-center md:text-left m-8">
          <Text className="break-keep">
            <span>👋 안녕하세요</span>, 10년이라는 긴 시간동안
            <strong>💻 코딩</strong>에 진심이였던 풀스택 개발자 김지섭입니다.
            55여개의 <strong>🗂️ 프로젝트</strong>를 진행해보았고, IT 관련
            대회에서 26회 <strong>🏆 수상</strong>한 경험이 있습니다. 앱 개발로
            시작하여,
            <strong>💡 기획</strong>, <strong>🎨 UX 디자인</strong>,{' '}
            <strong>🖥️ 프론트엔드</strong>, <strong>⚙️ 백엔드</strong>{' '}
            <strong>🤖 임베디드</strong> 개발 등 다양한 경험을 해보았고, 현재는
            백엔드 및 DevOps, React Native 앱 개발을 주력으로 하고 있습니다.
          </Text>
        </div>
      </div>
    </section>
  );
}

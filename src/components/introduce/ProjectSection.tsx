import React from 'react';

import { Title } from '@/components/Title';

export default function ProjectSection() {
  return (
    <section className="justify-center items-center">
      <div className="w-full max-w-5xl mx-auto px-4">
        <Title
          title="Projects"
          subTitle="새로운 것을 만든다는 것은 언제나 짜릿합니다. 제가 진행했던 다양한 프로젝트들입니다."
        />

        <div
          className="my-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 50px)',
            gridGap: '16px',
          }}></div>
      </div>
    </section>
  );
}

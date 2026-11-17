'use client';

import { Section } from './Section';

import { InteractiveTerminal } from '@/components/InteractiveTerminal';

export const ChatSection = () => {
  return (
    <Section id="chat" title="Ask">
      <p className="mb-6 max-w-[40rem] leading-relaxed text-foreground">
        경력이나 프로젝트에 대해 궁금한 점을 물어보세요. AI가 제 이력을 바탕으로 대신 답합니다.
      </p>
      <InteractiveTerminal mode="inline" className="!mx-0 h-[30rem] !shadow-none" />
    </Section>
  );
};

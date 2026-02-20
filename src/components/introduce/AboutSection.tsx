'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

import { RoughHighlight } from '@/components/RoughHighlight';

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-12 md:py-24 border-t border-border" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.h2 
          className="font-serif text-2xl md:text-3xl text-foreground mb-8 md:mb-12 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          About
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              2016년에 만든 앱이{' '}
              <RoughHighlight type="highlight" delay={200}>
                500만 다운로드
              </RoughHighlight>를 넘기면서 개발을 시작했습니다. 
              중학교 때였고, 그게{' '}
              <Link href="/projects/unipad" className="hover:text-accent transition-colors">
                <RoughHighlight type="box" delay={400} strokeWidth={1.5} padding={3}>
                  UniPad
                </RoughHighlight>
              </Link>입니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              지금은 두 회사에서 일합니다.{' '}
              <Link href="https://alpaon.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <RoughHighlight type="underline" delay={600}>
                  Alpaon
                </RoughHighlight>
              </Link>에서는 공동창업자이자 CTO로 
              산업용 IoT 제품을 만들고,{' '}
              <Link href="https://teamcandid.kr" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <RoughHighlight type="underline" delay={800}>
                  Candid
                </RoughHighlight>
              </Link>에서는 유일한 엔지니어로 
              채용 시스템을 개발합니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              코드만 짜는 건 재미없습니다. 제품이 어떻게 쓰이는지, 
              비즈니스가 어떻게 돌아가는지 같이 고민하는 쪽을 선호합니다.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              <RoughHighlight type="circle" delay={100} strokeWidth={1.5} padding={5}>
                한국외대
              </RoughHighlight>{' '}
              컴퓨터공학과 재학 중입니다. 2026년 2월에 졸업 예정.
              학교 다니면서 계속 일했습니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <RoughHighlight type="circle" delay={300} strokeWidth={1.5} padding={5}>
                한국디지털미디어고등학교
              </RoughHighlight>{' '}
              해킹방어과 출신입니다. 
              거기서{' '}
              <RoughHighlight type="highlight" delay={500}>
                정보올림피아드 금상
              </RoughHighlight>도 받고, 해커톤도 많이 나갔습니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              요즘은{' '}
              <RoughHighlight type="highlight" delay={700}>
                LLM
              </RoughHighlight>을 제품에 어떻게 넣을지 고민하고 있습니다. 
              Candid에서는 추천 시스템에, Alpaon에서는 산업 설비 제어에 쓰고 있습니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

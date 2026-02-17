'use client';

import { GradientBlob } from '@/components/GradientBlob';
import { MagneticLink } from '@/components/MagneticButton';
import { RoughHighlight } from '@/components/RoughHighlight';
import { TiltImage } from '@/components/TiltImage';
import { TypingText } from '@/components/TypingText';

export const HeroSection = () => {
  return (
    <section className="min-h-[85vh] flex items-center relative overflow-hidden">
      <GradientBlob />
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="animate-fade-in-scale w-32 h-32 md:w-40 md:h-40">
            <TiltImage
              src="/logo192.png"
              alt="김지섭"
              width={160}
              height={160}
              priority
            />
          </div>

          <div className="flex-1">
            <h1 
              className="text-4xl md:text-5xl font-medium text-foreground mb-4 tracking-tight"
            >
              <TypingText text="김지섭" delay={0.1} staggerDelay={0.12} />
            </h1>
            
            <p 
              className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <RoughHighlight type="underline" delay={600} animationDuration={600}>
                Alpaon
              </RoughHighlight>{' '}
              CTO.{' '}
              <RoughHighlight type="underline" delay={800} animationDuration={600}>
                Candid
              </RoughHighlight>{' '}
              <RoughHighlight type="highlight" delay={1000} animationDuration={800}>
                Product Engineer
              </RoughHighlight>.<br />
              소프트웨어부터 펌웨어, 인프라까지 직접 만들고 운영합니다.
            </p>

            <div 
              className="flex flex-wrap gap-3 text-sm animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <MagneticLink
                href="https://alpaon.com"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                strength={0.4}
                radius={120}
              >
                Alpaon
              </MagneticLink>
              <MagneticLink
                href="https://teamcandid.kr"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                strength={0.4}
                radius={120}
              >
                Candid
              </MagneticLink>
              <MagneticLink
                href="https://github.com/kimjisub"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                strength={0.4}
                radius={120}
              >
                GitHub
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

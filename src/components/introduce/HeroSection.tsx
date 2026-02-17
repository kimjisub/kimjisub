'use client';

import Image from 'next/image';

export const HeroSection = () => {
  return (
    <section className="min-h-[85vh] flex items-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="animate-fade-in-scale">
            <Image
              src="/logo192.png"
              className="rounded-2xl w-32 h-32 md:w-40 md:h-40 object-cover ring-1 ring-border"
              alt="김지섭"
              width={160}
              height={160}
              priority
            />
          </div>

          <div className="flex-1">
            <h1 
              className="text-4xl md:text-5xl font-medium text-foreground mb-4 tracking-tight animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              김지섭
            </h1>
            
            <p 
              className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Alpaon CTO. Candid Product Engineer.<br />
              소프트웨어부터 펌웨어, 인프라까지 직접 만들고 운영합니다.
            </p>

            <div 
              className="flex flex-wrap gap-3 text-sm animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <a 
                href="https://alpaon.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
              >
                Alpaon
              </a>
              <a 
                href="https://teamcandid.kr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
              >
                Candid
              </a>
              <a 
                href="https://github.com/kimjisub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

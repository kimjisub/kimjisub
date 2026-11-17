import Image from 'next/image';

import { ExternalIcon } from './ExternalIcon';

const links = [
  { href: 'https://alpaon.com', label: 'Alpaon', external: true },
  { href: 'https://github.com/kimjisub', label: 'GitHub', external: true },
  { href: 'https://www.linkedin.com/in/kimjisub', label: 'LinkedIn', external: true },
  { href: 'mailto:0226daniel@gmail.com', label: 'Email', external: false },
];

export const HeroSection = () => {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="pb-16 pt-16 md:pb-24 md:pt-28">
      <div className="home-grid">
        <Image
          src="/logo192.png"
          alt=""
          width={64}
          height={64}
          priority
          className="h-14 w-14 rounded-2xl md:h-16 md:w-16"
        />

        <div className="min-w-0">
          <h1
            id="hero-heading"
            className="text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[3.5rem]"
          >
            김지섭
          </h1>
          <p className="mt-2 font-serif text-[1.75rem] italic leading-tight tracking-[-0.01em] text-accent md:text-[2.125rem]">
            Founding Engineer
          </p>

          <p className="mt-10 max-w-[28ch] text-[1.5rem] font-semibold leading-[1.45] tracking-[-0.025em] text-foreground md:max-w-none md:text-[1.75rem]">
            사람이 손으로 하던 일을,
            <br className="md:hidden" /> 알아서 돌아가는 제품으로 만듭니다.
          </p>
          <p className="prose-ko mt-5 text-muted-foreground">
            공장 장비의 회로 기판부터 서버, 앱, AI 에이전트까지. 초기 제품에 필요한 기술을 처음부터 만들고 운영해
            왔습니다.
          </p>

          <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-[0.9375rem]">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link font-medium text-foreground"
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                  {link.external && <ExternalIcon />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

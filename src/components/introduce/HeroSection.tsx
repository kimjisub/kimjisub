import Image from 'next/image';
import Link from 'next/link';

const links = [
  { href: 'https://alpaon.com', label: 'Alpaon' },
  { href: 'https://github.com/kimjisub', label: 'GitHub' },
];

export const HeroSection = () => {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="py-20 md:py-32">
      <div className="home-grid">
        <Image
          src="/logo192.png"
          alt=""
          width={72}
          height={72}
          priority
          className="h-16 w-16 rounded-2xl md:h-[72px] md:w-[72px]"
        />

        <div className="min-w-0">
          <h1
            id="hero-heading"
            className="text-5xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-6xl"
          >
            김지섭
          </h1>
          <p className="mt-5 text-xl leading-snug text-foreground md:text-2xl">
            Founding Engineer
          </p>
          <p className="mt-3 max-w-[38rem] text-lg leading-relaxed text-muted-foreground">
            초기 제품의 기술 전부를 맡아, 사람 손 없이 돌아가는 제품으로 만듭니다. 무엇을 만들지는 함께 정하고, 장비부터 클라우드와 AI까지 기술과 운영을 직접 맡습니다.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link text-muted-foreground"
                >
                  {link.label}
                  <span aria-hidden="true"> ↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

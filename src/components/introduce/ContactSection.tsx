import { ContactForm } from './ContactForm';
import { Section } from './Section';

const contactLinks = [
  { href: 'mailto:0226daniel@gmail.com', label: '0226daniel@gmail.com', external: false },
  { href: 'https://www.linkedin.com/in/kimjisub', label: 'LinkedIn', external: true },
  { href: 'https://github.com/kimjisub', label: 'GitHub', external: true },
];

export const ContactSection = () => {
  return (
    <Section id="contact" title="Contact">
      <p className="max-w-[40rem] leading-relaxed text-foreground">
        프로젝트 협업, 커피챗, 또는 그냥 인사도 환영합니다.
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {contactLinks.map(({ href, label, external }) => (
          <li key={href}>
            <a
              href={href}
              className="link text-muted-foreground"
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {label}
              {external && <span aria-hidden="true"> ↗</span>}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <ContactForm />
      </div>
    </Section>
  );
};

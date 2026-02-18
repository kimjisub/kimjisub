'use client';

import { useRef } from 'react';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, useInView } from 'framer-motion';

import { ContactForm } from './ContactForm';

import { MagneticLink } from '@/components/MagneticWrapper';

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:0226daniel@gmail.com',
    icon: faEnvelope,
    label: '0226daniel@gmail.com',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kimjisub',
    icon: faLinkedin,
    label: 'LinkedIn',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/kimjisub',
    icon: faGithub,
    label: 'GitHub',
  },
];

export const ContactSectionAnimated = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      className="py-12 md:py-24 border-t border-border" 
      ref={ref}
      aria-labelledby="contact-heading"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.h2
          id="contact-heading"
          className="font-serif text-2xl md:text-3xl text-foreground mb-4 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Contact
        </motion.h2>

        <motion.p
          className="text-muted-foreground mb-8 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          프로젝트 협업, 커피챗, 또는 그냥 인사도 환영합니다! 아래 폼을 통해 메시지를 보내주세요.
        </motion.p>

        {/* Social Links */}
        <motion.div
          className="flex flex-wrap gap-4 items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          role="list"
          aria-label="소셜 링크"
        >
          {socialLinks.map((link, index) => (
            <span key={link.name} className="flex items-center gap-4">
              <MagneticLink
                href={link.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                strength={0.35}
                radius={80}
                aria-label={`${link.name}로 연락하기`}
              >
                <FontAwesomeIcon 
                  icon={link.icon} 
                  className="w-4 h-4 group-hover:text-accent transition-colors" 
                />
                <span>{link.label}</span>
              </MagneticLink>
              {index < socialLinks.length - 1 && (
                <span className="text-border" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </section>
  );
};

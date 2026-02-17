'use client';

import { useEffect, useRef, useState } from 'react';

import { SkillT } from '@/api/notion/skills';
import { SkillItem } from '@/components/SkillItem';

interface SkillCategoryAnimatedProps {
  title: string;
  skills: SkillT[];
  categoryIndex: number;
}

export const SkillCategoryAnimated = ({ title, skills, categoryIndex }: SkillCategoryAnimatedProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`mb-10 transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${Math.min(categoryIndex * 50, 300)}ms` }}
    >
      <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className={`transition-all duration-300 ease-out hover:scale-105 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: `${Math.min(index * 20, 200)}ms` }}
          >
            <SkillItem skill={skill} variant="inline" />
          </div>
        ))}
      </div>
    </div>
  );
};

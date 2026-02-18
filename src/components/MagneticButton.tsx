'use client';

import React, { ReactNode,useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

/**
 * MagneticWrapper - 자식 요소에 마그네틱 효과를 적용하는 wrapper
 * 마우스가 근처에 오면 자석처럼 끌려오는 효과
 */
export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  strength = 0.35,
  radius = 100,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < radius) {
      const factor = 1 - distance / radius;
      x.set(distanceX * strength * factor);
      y.set(distanceY * strength * factor);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface MagneticLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
  strength?: number;
  radius?: number;
  external?: boolean;
}

/**
 * MagneticLink - 마그네틱 효과가 적용된 링크
 * 내부 링크는 Next.js Link, 외부 링크는 일반 a 태그 사용
 */
export const MagneticLink: React.FC<MagneticLinkProps> = ({
  children,
  href,
  className = '',
  onClick,
  strength = 0.3,
  radius = 80,
  external,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < radius) {
      const factor = 1 - distance / radius;
      x.set(distanceX * strength * factor);
      y.set(distanceY * strength * factor);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isExternal = external ?? (href.startsWith('http') || href.startsWith('//'));
  
  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {isExternal ? (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={className}
          onClick={onClick}
        >
          {children}
        </a>
      ) : (
        <Link href={href} onClick={onClick} className={className}>
          {children}
        </Link>
      )}
    </motion.div>
  );
};

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  radius?: number;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * MagneticButton - 마그네틱 효과가 적용된 버튼
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  strength = 0.35,
  radius = 100,
  type = 'button',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < radius) {
      const factor = 1 - distance / radius;
      x.set(distanceX * strength * factor);
      y.set(distanceY * strength * factor);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <button type={type} onClick={onClick} className={className}>
        {children}
      </button>
    </motion.div>
  );
};

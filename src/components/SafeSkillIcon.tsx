'use client';

import React, { Component, ReactNode } from 'react';

import { SkillT } from '@/api/notion/skills';
import { IconSlugView } from '@/components/IconSlugView';

interface Props {
  skill: SkillT;
  className?: string;
}

interface State {
  hasError: boolean;
}

class SkillIconErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, State> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SkillIcon error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const SafeSkillIcon: React.FC<Props> = ({ skill, className }) => {
  const fallback = (
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-muted ${className ?? ''}`}
      title={skill.title}
    >
      <span className="text-xs text-muted-foreground font-medium">
        {skill.title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );

  return (
    <SkillIconErrorBoundary fallback={fallback}>
      <IconSlugView
        className={className}
        slug={skill.slug}
        color={skill.iconColor}
        title={skill.title}
      />
    </SkillIconErrorBoundary>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';

import { SkillT } from '@/api/notion/skills';
import { IconSlugView } from '@/components/IconSlugView';

export interface SkillItemProps {
	skill: SkillT;
	variant?: 'default' | 'inline';
}
export const SkillItem = ({ skill, variant = 'default' }: SkillItemProps) => {
	return (
		<Link href={`/skills/${encodeURIComponent(skill.id)}`} prefetch className="inline">
			<IconSlugView
				className="text-center"
				variant={variant}
				key={skill.id}
				title={skill.title}
				slug={skill.slug}
				color={skill.iconColor}
			/>
		</Link>
	);
};

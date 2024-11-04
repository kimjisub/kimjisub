'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { SkillT } from '@/api/notion/skills';
import { IconView } from '@/components/IconView';

const blur = 'bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm';

export interface SkillItemProps {
	className?: string;
	skill: SkillT;
}
export const SkillItem = ({ className, skill }: SkillItemProps) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link href={`/skills/${skill.id}`} prefetch>
			<IconView
				className="w-[100px] text-center"
				key={skill.id}
				title={skill.title}
				slug={skill.slug}
				color={skill.iconColor}
				raw={skill}
			/>
		</Link>
	);
};

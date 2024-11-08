import React from 'react';

import { getSkillsWithRelated } from '@/api/notion/skill';
import GraphView from '@/components/GraphView';

function hashStringToNumber(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
	}
	return hash;
}

export default async function SkillsPage() {
	const skillsWithRelated = await getSkillsWithRelated();

	return <GraphView skillsWithRelated={skillsWithRelated} />;
}

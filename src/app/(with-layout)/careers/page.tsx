import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';

import { getCareers } from '@/api/notion/careers';
import { CareerItem } from '@/components/CareerItem';
import DebugView from '@/components/DebugView';

export const revalidate = 3600;
export default async function CareersPage() {
	console.log('[SSG] CareersPage');

	const { careers, fetchedAt } = await getCareers();
	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<p>Career</p>
			<p>그동안 경험했던 것들이에요.</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5 justify-center max-x-1xl">
				{careers.map(career => (
					<CareerItem key={career.id} career={career} />
				))}
			</div>

			<DebugView>
				<Text>{format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}</Text>
			</DebugView>
		</div>
	);
}

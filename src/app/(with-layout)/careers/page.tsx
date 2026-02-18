import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import type { Metadata } from 'next';

import { CareersView } from './CareersView';

import { getCareers } from '@/api/notion/careers';
import DebugView from '@/components/DebugView';

export const metadata: Metadata = {
	title: 'Career',
	description: '김지섭의 경력 및 경험. 회사, 대회 수상, 프로젝트 등 다양한 커리어 경험들.',
	openGraph: {
		title: 'Career | Jisub Kim',
		description: '김지섭의 경력 및 경험. 회사, 대회, 프로젝트 등.',
		type: 'website',
		images: ['/logo512.png'],
	},
	twitter: {
		card: 'summary',
		title: 'Career | Jisub Kim',
		description: '김지섭의 경력 및 경험.',
	},
};

export const revalidate = 3600;

export default async function CareersPage() {
  console.log('[SSG] CareersPage');

  const { careers, fetchedAt } = await getCareers();
  
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 max-w-5xl mx-auto">
      <CareersView careers={careers} />

      <DebugView>
        <Text className="text-muted-foreground text-sm">
          {format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}
        </Text>
      </DebugView>
    </section>
  );
}

import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import type { Metadata } from 'next';

import { getCareers } from '@/api/notion/careers';
import { CareerItem } from '@/components/CareerItem';
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
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Career
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">
          회사, 대회, 프로젝트 등 경험했던 것들.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {careers.map(career => (
          <CareerItem key={career.id} career={career} />
        ))}
      </div>

      <DebugView>
        <Text className="text-muted-foreground text-sm">
          {format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}
        </Text>
      </DebugView>
    </section>
  );
}

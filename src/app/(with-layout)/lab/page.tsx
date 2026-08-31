import { format } from 'date-fns';
import type { Metadata } from 'next';
import Link from 'next/link';

import { EXPERIMENTS } from '@/components/lab/experiments';

export const metadata: Metadata = {
	title: 'Lab',
	description: '만들어보고 싶어서 만든 것들. 제품이 아니라 실험입니다.',
	openGraph: {
		title: 'Lab | Jisub Kim',
		description: '만들어보고 싶어서 만든 것들. 제품이 아니라 실험입니다.',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Lab | Jisub Kim',
		description: '만들어보고 싶어서 만든 것들.',
	},
};

export default function LabIndex() {
	const experiments = [...EXPERIMENTS].sort((a, b) => b.date.localeCompare(a.date));

	return (
		<section className="py-24 px-6 max-w-4xl mx-auto">
			<header className="mb-16">
				<h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">Lab</h1>
				<p className="text-muted-foreground leading-relaxed max-w-xl">
					만들어보고 싶어서 만든 것들. 제품이 아니라 실험입니다.
				</p>
			</header>

			<ul className="flex flex-col gap-4">
				{experiments.map(experiment => (
					<li key={experiment.slug}>
						<Link
							href={`/lab/${experiment.slug}`}
							className="block rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/30">
							<div className="flex items-baseline justify-between gap-4 mb-2">
								<h2 className="text-lg text-foreground">{experiment.title}</h2>
								<time
									dateTime={experiment.date}
									className="text-xs text-muted-foreground shrink-0">
									{format(new Date(experiment.date), 'yyyy.MM.dd')}
								</time>
							</div>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{experiment.summary}
							</p>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

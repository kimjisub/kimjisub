'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import * as icons from 'simple-icons';

import techs from '../../data/techs.json';
import { IconView } from '../IconView';

import { Title } from '@/components/Title';

export default function SkillsSection() {
	return (
		<section className="h-screen flex justify-center items-center">
			<div className="w-full max-w-5xl mx-auto px-4">
				<Title title="Skills" subTitle="제가 구사할 수 있는 능력들이에요" />

				<div
					className="my-8"
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, 50px)',
						gridGap: '16px',
					}}>
					{techs.results.map(tech => {
						const title =
							tech.properties['환경 및 기술'].title?.[0]?.text?.content;
						const iconSlug = tech.properties.iconSlug.rich_text[0]?.plain_text;
						return (
							<Link href={`/skills/${title}`} key={title}>
								<IconView
									className="w-[100px] text-center"
									key={title}
									title={title}
									iconSlug={iconSlug}
								/>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}

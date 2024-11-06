import React from 'react';

import { getSkills } from '@/api/notion/skills';
import { SkillItem } from '@/components/SkillItem';

export const revalidate = 3600;
export default async function SkillsPage() {
	console.log('[SSG] SkillsPage');

	const skills = await getSkills();

	return (
		<section className="pt-16 mx-auto my-0 p-20 max-w-5xl">
			<h1 className="text-4xl font-bold">Skills</h1>
			<p>
				상상을 현실로 만들기 위해, 분야를 막론하고 세상의 기술들을 배워나가고
				있습니다.
			</p>

			<section>
				<h2 className="text-2xl">언어</h2>

				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('언어'))
						.map(skill => {
							return (
								<SkillItem
									className="w-[100px] text-center"
									key={skill.id}
									skill={skill}
								/>
							);
						})}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">기술</h2>

				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('기술'))
						.map(skill => {
							return (
								<SkillItem
									className="w-[100px] text-center"
									key={skill.id}
									skill={skill}
								/>
							);
						})}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">DB</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('DB'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">IDE</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('IDE'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">개발 도구</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('개발 도구'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">프로토콜</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('프로토콜'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">Infra</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('Infra'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">CI/CD</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('CI/CD'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">OS</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('OS'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">하드웨어</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('하드웨어'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">플랫폼</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('플랫폼'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">협업/문서</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('협업/문서'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">디자인</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('디자인'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">음악</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('음악'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>

			<section>
				<h2 className="text-2xl">개념</h2>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skills
						.filter(skill => skill.분류.includes('개념'))
						.map(skill => (
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						))}
				</div>
			</section>
		</section>
	);
}

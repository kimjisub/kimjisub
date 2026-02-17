import fs from 'fs';
import type { MetadataRoute } from 'next';
import path from 'path';

import { getCareers } from '@/api/notion/careers';
import { getProjects } from '@/api/notion/projects';
import { getSkills } from '@/api/notion/skills';

const siteUrl = 'https://kimjisub.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${siteUrl}/projects`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${siteUrl}/skills`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${siteUrl}/careers`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${siteUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		},
	];

	// Dynamic pages - Projects
	const { projects } = await getProjects();
	const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${siteUrl}/projects/${project.id}`,
		lastModified: project.date.end || project.date.start || new Date(),
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}));

	// Dynamic pages - Skills
	const { skills } = await getSkills();
	const skillPages: MetadataRoute.Sitemap = skills.map((skill) => ({
		url: `${siteUrl}/skills/${skill.id}`,
		lastModified: new Date(),
		changeFrequency: 'monthly' as const,
		priority: 0.6,
	}));

	// Dynamic pages - Careers
	const { careers } = await getCareers();
	const careerPages: MetadataRoute.Sitemap = careers.map((career) => ({
		url: `${siteUrl}/careers/${career.id}`,
		lastModified: career.date.end || career.date.start || new Date(),
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}));

	// Dynamic pages - Blog posts
	const postsDir = path.join(process.cwd(), 'src/blog');
	const blogPages: MetadataRoute.Sitemap = [];
	
	if (fs.existsSync(postsDir)) {
		const entries = fs.readdirSync(postsDir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isDirectory()) {
				const indexPath = path.join(postsDir, entry.name, 'index.mdx');
				if (fs.existsSync(indexPath)) {
					const stats = fs.statSync(indexPath);
					blogPages.push({
						url: `${siteUrl}/blog/${entry.name}`,
						lastModified: stats.mtime,
						changeFrequency: 'monthly' as const,
						priority: 0.8,
					});
				}
			}
		}
	}

	return [...staticPages, ...projectPages, ...skillPages, ...careerPages, ...blogPages];
}

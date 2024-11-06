import { LRUCache } from 'lru-cache';

import { CareerT } from '../notion/careers';
import { ProjectT } from '../notion/projects';
import { SkillT } from '../notion/skills';

export type NotionCacheValue =
	| { type: 'careers'; value: CareerT[] }
	| { type: 'projects'; value: ProjectT[] }
	| { type: 'skills'; value: SkillT[] };

export class NotionCache {
	private static instance: NotionCache;
	private cache: LRUCache<string, NotionCacheValue>;

	private constructor() {
		this.cache = new LRUCache<string, NotionCacheValue>({
			max: 500, // 최대 캐시 항목 수
			ttl: 60 * 60 * 1000, // 1시간 TTL (ms)
			allowStale: true, // 만료된 데이터도 반환 허용
			updateAgeOnGet: false, // 요청 시 만료 시간 갱신하지 않음
		});
	}

	public static getInstance(): NotionCache {
		if (!NotionCache.instance) {
			NotionCache.instance = new NotionCache();
		}
		return NotionCache.instance;
	}

	public async cacheCareers(
		fetchCareers: () => Promise<CareerT[]>,
	): Promise<CareerT[]> {
		const cachedRaw = this.cache.get('careers');
		const cached =
			cachedRaw && cachedRaw.type === 'careers' ? cachedRaw.value : null;
		if (cached) return cached;

		const fetched = await fetchCareers();
		this.cache.set('careers', { type: 'careers', value: fetched });
		return fetched;
	}

	public async cacheProjects(
		fetchProjects: () => Promise<ProjectT[]>,
	): Promise<ProjectT[]> {
		const cachedRaw = this.cache.get('projects');
		const cached =
			cachedRaw && cachedRaw.type === 'projects' ? cachedRaw.value : null;
		if (cached) return cached;

		const fetched = await fetchProjects();
		this.cache.set('projects', { type: 'projects', value: fetched });
		return fetched;
	}

	public async cacheSkills(
		fetchSkills: () => Promise<SkillT[]>,
	): Promise<SkillT[]> {
		const cachedRaw = this.cache.get('skills');
		const cached =
			cachedRaw && cachedRaw.type === 'skills' ? cachedRaw.value : null;
		if (cached) return cached;

		const fetched = await fetchSkills();
		this.cache.set('skills', { type: 'skills', value: fetched });
		return fetched;
	}
}

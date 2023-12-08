import { NotionAPI } from 'notion-client';

export const notionApi = new NotionAPI();

export const fetchNotionDB = async (databaseId: string, data = {}) => {
	const response = await fetch(
		`https://api.notion.com/v1/databases/${databaseId}/query`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.NOTION_SECRET}`,
				'Notion-Version': '2022-06-28',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			next: {
				revalidate: 3600,
			},
		},
	);

	if (!response.ok) {
		throw new Error('API 요청 중 오류가 발생했습니다');
	}

	return response.json();
};

export const fetchNotionPage = async (pageId: string) => {
	const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
		headers: {
			Authorization: `Bearer ${process.env.NOTION_SECRET}`,
			'Notion-Version': '2022-06-28',
		},
		next: {
			revalidate: 3600,
		},
	});

	if (!response.ok) {
		throw new Error('API 요청 중 오류가 발생했습니다');
	}

	return response.json();
};

export const fetchNotionBlock = async (pageId: string) => {
	const response = await fetch(
		`https://api.notion.com/v1/blocks/${pageId}/children`,
		{
			headers: {
				Authorization: `Bearer ${process.env.NOTION_SECRET}`,
				'Notion-Version': '2022-06-28',
			},
			next: {
				revalidate: 3600,
			},
		},
	);

	if (!response.ok) {
		throw new Error('API 요청 중 오류가 발생했습니다');
	}

	return response.json();
};

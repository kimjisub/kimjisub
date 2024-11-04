import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

export const notionXApi = new NotionAPI();
export const notionApi = new Client({
	auth: process.env.NOTION_SECRET,
});

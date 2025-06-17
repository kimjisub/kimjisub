export interface BlogPostMeta {
  title: string;
  date: string;
  description: string;
  author?: string;
  keywords?: string[];
  image?: string;
  tags?: string[];
  readingTime?: string;
  category?: string;
  published?: boolean;
  lastModified?: string;
}

export interface BlogPost {
  slug: string;
  meta: BlogPostMeta;
}
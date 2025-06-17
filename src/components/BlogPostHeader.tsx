import type { BlogPostMeta } from '@/types/blog';

interface BlogPostHeaderProps {
  meta: BlogPostMeta;
}

export default function BlogPostHeader({ meta }: BlogPostHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="mb-8 pb-8 border-b">
      <h1 className="text-4xl font-bold mb-4">{meta.title}</h1>
      
      {meta.description && (
        <p className="text-xl text-gray-600 mb-4">{meta.description}</p>
      )}
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        {meta.date && (
          <time dateTime={meta.date}>
            📅 {formatDate(meta.date)}
          </time>
        )}
        
        {meta.author && (
          <span>✍️ {meta.author}</span>
        )}
        
        {meta.readingTime && (
          <span>⏱️ {meta.readingTime}</span>
        )}
        
        {meta.category && (
          <span className="px-2 py-1 bg-gray-100 rounded-md">
            📁 {meta.category}
          </span>
        )}
      </div>
      
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
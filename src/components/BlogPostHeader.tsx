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
    <header className="mb-8 pb-8 border-b border-border">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
        {meta.title}
      </h1>
      
      {meta.description && (
        <p className="text-lg text-muted-foreground mb-4">{meta.description}</p>
      )}
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          <span className="px-2 py-1 bg-secondary rounded-md text-foreground">
            📁 {meta.category}
          </span>
        )}
      </div>
      
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-accent/20 text-accent rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

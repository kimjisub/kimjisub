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
    <header className="mb-12 pb-8 border-b border-border">
      <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
        {meta.title}
      </h1>
      
      {meta.description && (
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{meta.description}</p>
      )}
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {meta.date && (
          <time dateTime={meta.date}>
            {formatDate(meta.date)}
          </time>
        )}
        
        {meta.author && (
          <span>{meta.author}</span>
        )}
        
        {meta.readingTime && (
          <span>{meta.readingTime}</span>
        )}
        
        {meta.category && (
          <span className="px-2 py-0.5 bg-secondary rounded text-foreground text-xs">
            {meta.category}
          </span>
        )}
      </div>
      
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

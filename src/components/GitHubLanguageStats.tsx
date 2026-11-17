import type { LanguageStat } from '@/api/github';

interface GitHubLanguageStatsProps {
  languages: LanguageStat[];
}

export default function GitHubLanguageStats({ languages }: GitHubLanguageStatsProps) {
  if (!languages.length) return null;

  return (
    <div className="w-full">
      <div className="mb-5 flex h-2 w-full gap-px overflow-hidden rounded-full" aria-hidden="true">
        {languages.map((lang) => (
          <div key={lang.name} style={{ backgroundColor: lang.color, width: `${lang.percentage}%` }} />
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3 md:grid-cols-4">
        {languages.map((lang) => (
          <li key={lang.name} className="flex min-w-0 items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: lang.color }} aria-hidden="true" />
            <span className="truncate text-foreground" title={lang.name}>
              {lang.name}
            </span>
            <span className="tabular-nums text-muted-foreground">{lang.percentage.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

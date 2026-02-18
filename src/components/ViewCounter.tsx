"use client";

import { Eye } from "lucide-react";
import { usePageView } from "@/hooks/usePageView";
import { cn } from "@/lib/utils";

interface ViewCounterProps {
  slug: string;
  className?: string;
}

export function ViewCounter({ slug, className }: ViewCounterProps) {
  const { count, loading } = usePageView(slug);

  return (
    <div className={cn("flex items-center gap-2 text-gray-400", className)}>
      <Eye className="w-4 h-4" />
      <span className="text-sm">
        {loading ? "..." : `${count?.toLocaleString()} views`}
      </span>
    </div>
  );
}

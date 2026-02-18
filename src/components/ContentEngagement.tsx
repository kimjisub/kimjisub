"use client";

import { ViewCounter } from "./ViewCounter";
import { LikeButton } from "./LikeButton";
import { cn } from "@/lib/utils";

interface ContentEngagementProps {
  slug: string;
  contentType: string;
  className?: string;
}

export function ContentEngagement({ slug, contentType, className }: ContentEngagementProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <ViewCounter slug={`${contentType}/${slug}`} />
      <LikeButton contentType={contentType} contentSlug={slug} />
    </div>
  );
}

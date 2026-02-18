"use client";

import { Heart } from "lucide-react";
import { useReaction } from "@/hooks/useReaction";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  contentType: string;
  contentSlug: string;
  className?: string;
}

export function LikeButton({ contentType, contentSlug, className }: LikeButtonProps) {
  const { count, liked, loading, toggle, toggling } = useReaction({
    contentType,
    contentSlug,
  });

  return (
    <button
      onClick={toggle}
      disabled={loading || toggling}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
        "border border-white/10 hover:border-white/20",
        liked
          ? "bg-red-500/20 text-red-400 border-red-500/30"
          : "bg-white/5 text-gray-400 hover:text-white",
        (loading || toggling) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all",
          liked && "fill-current",
          toggling && "animate-pulse"
        )}
      />
      <span className="text-sm font-medium">
        {loading ? "..." : count}
      </span>
    </button>
  );
}

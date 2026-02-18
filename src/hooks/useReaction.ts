"use client";

import { useEffect, useState, useCallback } from "react";
import { useFingerprint } from "./useFingerprint";

interface UseReactionOptions {
  contentType: string;
  contentSlug: string;
}

export function useReaction({ contentType, contentSlug }: UseReactionOptions) {
  const { fingerprint, loading: fpLoading } = useFingerprint();
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  // 초기 상태 로드
  useEffect(() => {
    if (fpLoading) return;

    const fetchReaction = async () => {
      try {
        const params = new URLSearchParams({
          contentType,
          contentSlug,
          ...(fingerprint && { fingerprint }),
        });
        const res = await fetch(`/api/reactions?${params}`);
        const data = await res.json();
        if (res.ok) {
          setCount(data.count);
          setLiked(data.liked);
        }
      } catch (error) {
        console.error("Failed to fetch reaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReaction();
  }, [contentType, contentSlug, fingerprint, fpLoading]);

  // 좋아요 토글
  const toggle = useCallback(async () => {
    if (!fingerprint || toggling) return;

    setToggling(true);
    
    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentSlug, fingerprint }),
      });
      const data = await res.json();
      if (res.ok) {
        setCount(data.count);
        setLiked(data.liked);
      } else {
        // 실패 시 롤백
        setLiked((prev) => !prev);
        setCount((prev) => (liked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      // 실패 시 롤백
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setToggling(false);
    }
  }, [contentType, contentSlug, fingerprint, liked, toggling]);

  return { count, liked, loading: loading || fpLoading, toggle, toggling };
}

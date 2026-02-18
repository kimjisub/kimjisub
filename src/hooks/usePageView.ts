"use client";

import { useEffect, useState } from "react";
import { useFingerprint } from "./useFingerprint";

export function usePageView(slug: string) {
  const { fingerprint, loading: fpLoading } = useFingerprint();
  const [count, setCount] = useState<number | null>(null);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    if (fpLoading || !fingerprint || recorded) return;

    const recordView = async () => {
      try {
        const res = await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, fingerprint }),
        });
        const data = await res.json();
        if (res.ok) {
          setCount(data.count);
          setRecorded(true);
        }
      } catch (error) {
        console.error("Failed to record page view:", error);
      }
    };

    recordView();
  }, [slug, fingerprint, fpLoading, recorded]);

  return { count, loading: fpLoading || count === null };
}

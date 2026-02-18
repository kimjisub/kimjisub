"use client";

import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (error) {
        console.error("Failed to get fingerprint:", error);
        // 폴백: localStorage 기반 ID
        let storedId = localStorage.getItem("visitor_id");
        if (!storedId) {
          storedId = crypto.randomUUID();
          localStorage.setItem("visitor_id", storedId);
        }
        setFingerprint(storedId);
      } finally {
        setLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { fingerprint, loading };
}

'use client';

import { useEffect, useState } from 'react';

export type AccentColorKey = 'green' | 'blue' | 'purple' | 'orange' | 'rose';

export interface AccentColorConfig {
  label: string;
  preview: string; // color for the circle button
}

export const ACCENT_COLORS: Record<AccentColorKey, AccentColorConfig> = {
  green:  { label: 'Green',  preview: '#22c55e' },
  blue:   { label: 'Blue',   preview: '#3b82f6' },
  purple: { label: 'Purple', preview: '#a78bfa' },
  orange: { label: 'Orange', preview: '#fb923c' },
  rose:   { label: 'Rose',   preview: '#fb7185' },
};

const STORAGE_KEY = 'accent-color';
const DEFAULT_ACCENT: AccentColorKey = 'green';

export function useAccentColor() {
  const [accentColor, setAccentColorState] = useState<AccentColorKey>(DEFAULT_ACCENT);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AccentColorKey | null;
      if (stored && stored in ACCENT_COLORS) {
        setAccentColorState(stored);
        applyAccentColor(stored);
      } else {
        applyAccentColor(DEFAULT_ACCENT);
      }
    } catch {
      applyAccentColor(DEFAULT_ACCENT);
    }
  }, []);

  const setAccentColor = (color: AccentColorKey) => {
    setAccentColorState(color);
    applyAccentColor(color);
    try {
      localStorage.setItem(STORAGE_KEY, color);
    } catch {
      // ignore
    }
  };

  return { accentColor, setAccentColor };
}

function applyAccentColor(color: AccentColorKey) {
  const html = document.documentElement;
  // Remove existing accent data-attribute and add new one
  html.setAttribute('data-accent', color);
}

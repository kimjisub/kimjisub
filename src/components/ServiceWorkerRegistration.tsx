'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[SW] Registered, scope:', registration.scope);
        })
        .catch((err) => {
          console.error('[SW] Registration failed:', err);
        });
    }
  }, []);

  return null;
}

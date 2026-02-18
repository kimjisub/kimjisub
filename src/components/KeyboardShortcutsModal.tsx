'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShortcutItem {
  keys: string[];
  description: string;
  isEasterEgg?: boolean;
}

interface ShortcutGroup {
  name: string;
  items: ShortcutItem[];
}

// ─── Shortcut data ────────────────────────────────────────────────────────────

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    name: 'Navigation',
    items: [
      { keys: ['⌘', 'K'], description: 'Open Command Palette' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['j'], description: 'Next section' },
      { keys: ['k'], description: 'Previous section' },
      { keys: ['g'], description: 'Go to top' },
      { keys: ['G'], description: 'Go to bottom' },
    ],
  },
  {
    name: 'Modals & Menus',
    items: [
      { keys: ['Esc'], description: 'Close modal / menu' },
      { keys: ['↑', '↓'], description: 'Navigate list items' },
      { keys: ['↵'], description: 'Select item' },
    ],
  },
  {
    name: 'Easter Eggs 🥚',
    items: [
      { keys: ['D'], description: 'Toggle Disco Mode', isEasterEgg: true },
      {
        keys: ['↑↑↓↓←→←→', 'B', 'A'],
        description: 'Konami Code',
        isEasterEgg: true,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground shadow-[inset_0_-1px_0_0_hsl(var(--border))] leading-tight">
      {children}
    </kbd>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ks-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="ks-panel"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[18vh] z-[101] mx-auto w-full max-w-lg px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
          >
            <div
              className="rounded-xl border border-border bg-background/95 shadow-2xl overflow-hidden"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground flex-shrink-0"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">Keyboard Shortcuts</span>
                </div>
                <kbd className="inline-flex items-center rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                  ESC
                </kbd>
              </div>

              {/* Shortcut list */}
              <ul className="py-2 max-h-[24rem] overflow-y-auto">
                {SHORTCUT_GROUPS.map((group) => (
                  <li key={group.name} role="presentation">
                    {/* Group label */}
                    <span className="block px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      {group.name}
                    </span>

                    {group.items.map((item) => (
                      <div
                        key={item.description}
                        className="flex items-center justify-between px-4 py-2.5 text-sm"
                      >
                        <span
                          className={
                            item.isEasterEgg
                              ? 'text-muted-foreground/70 text-[13px]'
                              : 'text-muted-foreground'
                          }
                        >
                          {item.description}
                        </span>
                        <span className="flex items-center gap-1 flex-shrink-0 ml-4">
                          {item.keys.map((key, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && (
                                <span className="text-muted-foreground/40 text-[11px]">+</span>
                              )}
                              <Kbd>{key}</Kbd>
                            </React.Fragment>
                          ))}
                        </span>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="opacity-60">Press any key to dismiss</span>
                <span className="flex items-center gap-1 opacity-60">
                  <kbd className="rounded border border-border px-1 py-0.5 font-mono">?</kbd>
                  toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useKeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable;

      if (isEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '?') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    open,
    setOpen,
    onClose: () => setOpen(false),
  };
}

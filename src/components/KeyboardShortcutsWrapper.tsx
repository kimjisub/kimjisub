'use client';

import { KeyboardShortcutsModal, useKeyboardShortcutsModal } from './KeyboardShortcutsModal';

export function KeyboardShortcutsWrapper() {
  const { open, onClose } = useKeyboardShortcutsModal();
  return <KeyboardShortcutsModal open={open} onClose={onClose} />;
}

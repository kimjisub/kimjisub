'use client';

import { CommandPalette, useCommandPalette } from './CommandPalette';

export function CommandPaletteWrapper() {
  const { open, onClose } = useCommandPalette();
  return <CommandPalette open={open} onClose={onClose} />;
}

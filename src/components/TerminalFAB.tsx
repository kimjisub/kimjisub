'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

import { useTerminal } from '@/context/TerminalContext';

export const TerminalFAB = () => {
  const { isOpen, isInlineMode, openTerminal, closeTerminal } = useTerminal();
  
  // inline 모드일 때는 FAB 숨김
  if (isInlineMode) return null;
  
  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isOpen ? closeTerminal : openTerminal}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        aria-label={isOpen ? '터미널 닫기' : '터미널 열기'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </AnimatePresence>
  );
};

export default TerminalFAB;

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

import { useTerminal } from '@/context/TerminalContext';

export const TerminalFAB = () => {
  const { isOpen, openTerminal } = useTerminal();

  return (
    <>
      {/* Morph shell - layoutId로 FloatingTerminal과 연결 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="fab-morph"
            layoutId="terminal-morph"
            className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-accent shadow-lg"
            style={{ borderRadius: 28 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 },
            }}
          />
        )}
      </AnimatePresence>

      {/* Button overlay - 아이콘 및 클릭 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openTerminal}
            className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full flex items-center justify-center text-accent-foreground"
            aria-label="터미널 열기"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalFAB;

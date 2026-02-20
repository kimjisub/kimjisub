'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { useTerminal } from '@/context/TerminalContext';

export const FloatingTerminal = () => {
  const { isOpen, isInlineMode, closeTerminal } = useTerminal();
  
  // inline 모드일 때는 floating 표시 안 함
  if (isInlineMode) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeTerminal}
          />
          
          {/* Terminal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-4 md:inset-auto md:bottom-4 md:right-4 md:w-[600px] md:max-h-[600px] z-50 flex flex-col"
          >
            <InteractiveTerminal 
              mode="floating" 
              onClose={closeTerminal}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingTerminal;

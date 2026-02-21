'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface TerminalLine {
  id: number;
  type: 'user' | 'assistant' | 'system' | 'ascii';
  content: string;
  isTyping?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TerminalContextType {
  // 상태
  isOpen: boolean;
  isAnchored: boolean; // 메인 페이지 스크롤로 열린 상태
  anchorEl: HTMLDivElement | null; // placeholder DOM 요소
  lines: TerminalLine[];
  chatHistory: ChatMessage[];
  remaining: number | null;
  rateLimited: boolean;
  isLoading: boolean;
  isTyping: boolean;

  // 액션
  openTerminal: () => void;
  closeTerminal: () => void;
  setIsAnchored: React.Dispatch<React.SetStateAction<boolean>>;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setRemaining: React.Dispatch<React.SetStateAction<number | null>>;
  setRateLimited: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  getNextId: () => number;
  resetTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnchored, setIsAnchored] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, type: 'assistant', content: '와주셨네요 ㅎㅎ 김지섭입니다. 제가 어떤 경험을 해왔는지, 어떤 생각으로 개발하는지 궁금한 거 있으면 편하게 물어봐주세요' },
  ]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const lineIdRef = useRef(1);

  const getNextId = useCallback(() => {
    const id = lineIdRef.current;
    lineIdRef.current += 1;
    return id;
  }, []);

  const openTerminal = useCallback(() => setIsOpen(true), []);
  const closeTerminal = useCallback(() => setIsOpen(false), []);

  const resetTerminal = useCallback(() => {
    lineIdRef.current = 1;
    setLines([
      { id: 0, type: 'system', content: '터미널이 초기화되었습니다.' },
    ]);
    setChatHistory([]);
  }, []);

  return (
    <TerminalContext.Provider
      value={{
        isOpen,
        isAnchored,
        anchorEl,
        lines,
        chatHistory,
        remaining,
        rateLimited,
        isLoading,
        isTyping,
        openTerminal,
        closeTerminal,
        setIsAnchored,
        setAnchorEl,
        setLines,
        setChatHistory,
        setRemaining,
        setRateLimited,
        setIsLoading,
        setIsTyping,
        getNextId,
        resetTerminal,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}

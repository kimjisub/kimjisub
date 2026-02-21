'use client';

import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ChevronRight, MessageCircle, Minimize2, X } from 'lucide-react';

import { useTerminal } from '@/context/TerminalContext';

// 간단한 브라우저 fingerprint 생성
function generateFingerprint(): string {
  if (typeof window === 'undefined') return 'server';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const canvasData = canvas.toDataURL();
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvasData.slice(-50),
  ].join('|');
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

const NEOFETCH_ASCII = `
   ██╗  ██╗██╗███╗   ███╗     ██╗██╗███████╗██╗   ██╗██████╗ 
   ██║ ██╔╝██║████╗ ████║     ██║██║██╔════╝██║   ██║██╔══██╗
   █████╔╝ ██║██╔████╔██║     ██║██║███████╗██║   ██║██████╔╝
   ██╔═██╗ ██║██║╚██╔╝██║██   ██║██║╚════██║██║   ██║██╔══██╗
   ██║  ██╗██║██║ ╚═╝ ██║╚█████╔╝██║███████║╚██████╔╝██████╔╝
   ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝ ╚════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ 
`;

const COMMANDS: Record<string, () => { lines: string[]; isAscii?: boolean }> = {
  help: () => ({
    lines: [
      '',
      '  사용 가능한 명령어:',
      '',
      '    /help      이 도움말 보기',
      '    /about     저에 대해',
      '    /skills    기술 스택',
      '    /projects  주요 프로젝트',
      '    /contact   연락처',
      '    /neofetch  시스템 정보 (재미)',
      '    /clear     터미널 초기화',
      '',
      '  또는 자연어로 질문해보세요!',
      '  예: "어떤 프로젝트 해봤어요?"',
      '',
    ],
  }),
  about: () => ({
    lines: [
      '',
      '  ━━━ 김지섭 (Jisub Kim) ━━━',
      '',
      '  • Alpaon CTO & 코파운더 (산업용 IoT)',
      '  • Candid Product Engineer (스타트업 채용)',
      '  • 한국외대 컴공 졸업 예정',
      '',
      '  중학생 때 만든 UniPad가 1,000만 다운로드를 넘으면서',
      '  이 길이 내 길이구나 확신하게 됐어요.',
      '',
      '  "코드 작성"보다 "돌아가는 시스템 만들기"를 좋아합니다.',
      '',
    ],
  }),
  skills: () => ({
    lines: [
      '',
      '  ━━━ 기술 스택 ━━━',
      '',
      '  Frontend   React, Next.js, TypeScript, Vue.js',
      '  Backend    Node.js, NestJS, Python, FastAPI',
      '  Mobile     Android (Kotlin), React Native',
      '  DevOps     Docker, K8s, AWS, Terraform',
      '  AI/ML      LLM Integration, RAG, 추천시스템',
      '  Firmware   C/C++ (펌웨어 개발)',
      '',
    ],
  }),
  projects: () => ({
    lines: [
      '',
      '  ━━━ 주요 프로젝트 ━━━',
      '',
      '  UniPad',
      '    1,000만+ 다운로드 런치패드 앱',
      '    중학생 때 개발, 광고 수익으로 대기업 초봉급',
      '',
      '  AlpaConnect',
      '    산업용 PLC 클라우드 연결',
      '    원격 모니터링/제어, LLM 기반 대화형 제어',
      '',
      '  Candid AI',
      '    스타트업 채용 추천 시스템',
      '    2-stage 추천, AI Agent 개발',
      '',
    ],
  }),
  contact: () => ({
    lines: [
      '',
      '  ━━━ 연락처 ━━━',
      '',
      '  Email     0226daniel@gmail.com',
      '  GitHub    github.com/kimjisub',
      '  LinkedIn  linkedin.com/in/kimjisub',
      '',
      '  협업이나 문의는 편하게 연락주세요!',
      '',
    ],
  }),
  neofetch: () => ({
    lines: [
      NEOFETCH_ASCII,
      '  jisub@portfolio',
      '  ─────────────────────',
      '  OS        Human 1.0 (Developer Mode)',
      '  Host      South Korea',
      '  Uptime    25+ years',
      '  Shell     zsh + oh-my-zsh',
      '  Editor    VS Code / Cursor',
      '  Theme     Dark Mode Forever',
      '  CPU       Caffeine-powered Brain',
      '  Memory    99% used by side projects',
      '',
    ],
    isAscii: true,
  }),
};

interface InteractiveTerminalProps {
  mode?: 'inline' | 'floating';
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
}

export const InteractiveTerminal = ({ 
  mode = 'inline', 
  onClose, 
  onMinimize,
  className = '' 
}: InteractiveTerminalProps) => {
  const {
    lines,
    setLines,
    chatHistory,
    setChatHistory,
    remaining,
    setRemaining,
    rateLimited,
    setRateLimited,
    isLoading,
    setIsLoading,
    isTyping,
    setIsTyping,
    getNextId,
    resetTerminal,
  } = useTerminal();
  
  const [input, setInput] = useState('');
  const fingerprint = useMemo(() => generateFingerprint(), []);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    if (!isLoading && !isTyping) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isLoading, isTyping]);

  const textareaHeight = useMemo(() => {
    const lineCount = Math.max(1, (input.match(/\n/g) || []).length + 1);
    return Math.max(24, Math.min(lineCount * 20, 80));
  }, [input]);

  const addLine = useCallback((type: 'user' | 'assistant' | 'system' | 'ascii', content: string) => {
    const newId = getNextId();
    setLines(prev => [...prev, { id: newId, type, content }]);
    return newId;
  }, [getNextId, setLines]);

  const typeLines = useCallback(async (outputLines: string[], type: 'user' | 'assistant' | 'system' | 'ascii' = 'assistant', isAscii?: boolean) => {
    setIsTyping(true);
    
    for (const line of outputLines) {
      const newId = getNextId();
      
      if (isAscii || line.includes('━') || line.includes('─') || line.includes('██')) {
        setLines(prev => [...prev, { id: newId, type: isAscii ? 'ascii' : type, content: line }]);
        await new Promise(resolve => setTimeout(resolve, 15));
      } else if (line.trim() === '') {
        setLines(prev => [...prev, { id: newId, type, content: '' }]);
        await new Promise(resolve => setTimeout(resolve, 10));
      } else {
        setLines(prev => [...prev, { id: newId, type, content: '', isTyping: true }]);
        
        for (let i = 0; i <= line.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 8));
          setLines(prev => prev.map(l => 
            l.id === newId ? { ...l, content: line.slice(0, i) } : l
          ));
        }
        
        setLines(prev => prev.map(l => 
          l.id === newId ? { ...l, isTyping: false } : l
        ));
      }
    }
    
    setIsTyping(false);
  }, [getNextId, setLines, setIsTyping]);

  const handleCommand = useCallback(async (cmd: string) => {
    const cmdName = cmd.slice(1).toLowerCase().trim();
    
    if (cmdName === 'clear') {
      resetTerminal();
      return;
    }
    
    const commandFn = COMMANDS[cmdName];
    if (commandFn) {
      const output = commandFn();
      await typeLines(output.lines, 'assistant', output.isAscii);
    } else {
      addLine('system', `알 수 없는 명령어: ${cmd}. /help로 확인하세요.`);
    }
  }, [addLine, typeLines, resetTerminal]);

  const sendToAI = useCallback(async (message: string) => {
    if (rateLimited) {
      addLine('system', '⚠ 오늘 대화 횟수를 모두 사용했어요. 내일 다시 만나요!');
      return;
    }
    
    setIsLoading(true);
    
    const newChatHistory = [...chatHistory, { role: 'user' as const, content: message }];
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newChatHistory, fingerprint }),
      });
      
      const data = await response.json();
      
      if (response.status === 429) {
        setRateLimited(true);
        setRemaining(0);

        addLine('system', `⚠ ${data.message || '오늘 대화 횟수를 모두 사용했어요.'}`);
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(data?.error || `API error: ${response.status}`);
      }
      
      const aiResponse = data.response || '응답을 생성하지 못했어요.';
      
      if (typeof data.remaining === 'number') {
        setRemaining(data.remaining);
      }
      
      setChatHistory([...newChatHistory, { role: 'assistant', content: aiResponse }]);
      
      const responseLines = aiResponse.split('\n');
      await typeLines(responseLines, 'assistant');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('AI chat error:', errorMessage);
      addLine('system', `응답을 가져오지 못했어요.`);
    }
    
    setIsLoading(false);
  }, [chatHistory, fingerprint, rateLimited, addLine, typeLines, setChatHistory, setRemaining, setRateLimited, setIsLoading]);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isTyping) return;
    
    setInput('');
    addLine('user', trimmed);
    
    if (trimmed.startsWith('/')) {
      await handleCommand(trimmed);
    } else {
      await sendToAI(trimmed);
    }
  }, [input, isLoading, isTyping, addLine, handleCommand, sendToAI]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border bg-card flex flex-col ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">김지섭</span>
        </div>
        {mode === 'floating' && (
          <div className="flex items-center gap-1">
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="p-1.5 rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        {mode === 'inline' && <div className="w-[52px]" />}
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="bg-background p-4 flex-1 min-h-0 overflow-y-auto font-mono text-sm"
        style={{ scrollBehavior: 'smooth' }}
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence mode="popLayout">
          {lines.map((line, index) => {
            const isFirstAssistant = line.type === 'assistant' &&
              (index === 0 || lines[index - 1].type !== 'assistant');

            return (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="mb-1"
              >
                {line.type === 'user' && (
                  <div className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-foreground">{line.content}</span>
                  </div>
                )}
                {line.type === 'assistant' && (
                  <div className="flex items-start gap-2">
                    {isFirstAssistant ? (
                      <MessageCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    <span className="text-foreground/80 whitespace-pre-wrap">
                      {line.content}
                      {line.isTyping && (
                        <span className="inline-block w-1.5 h-4 bg-accent ml-0.5 animate-pulse" />
                      )}
                    </span>
                  </div>
                )}
                {line.type === 'system' && (
                  <div className="text-muted-foreground italic">
                    {line.content}
                  </div>
                )}
                {line.type === 'ascii' && (
                  <div className="text-accent whitespace-pre font-bold">
                    {line.content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <MessageCircle className="w-4 h-4 text-accent shrink-0" />
            <span className="flex gap-1">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: '150ms' }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: '300ms' }}>●</span>
            </span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-secondary border-t border-border p-3">
        <div className="flex items-end gap-2">
          <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mb-2.5" />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading || isTyping}
            rows={1}
            className="flex-1 bg-transparent text-foreground font-mono text-sm resize-none overflow-hidden placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            style={{ height: textareaHeight }}
          />
          <motion.button
            onClick={() => void handleSubmit()}
            disabled={!input.trim() || isLoading || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:bg-accent/30"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="flex items-center justify-between mt-2 px-5">
          <span className="text-[10px] text-muted-foreground">
            /help · 명령어 보기
          </span>
          {remaining !== null && (
            <span className={`text-[10px] ${remaining <= 10 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              오늘 {remaining}회 남음
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            Shift+Enter · 줄바꿈
          </span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTerminal;

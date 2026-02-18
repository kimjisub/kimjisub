'use client';

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';

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

export const InteractiveTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, type: 'system', content: '김지섭의 AI 포트폴리오 터미널에 오신 걸 환영합니다.' },
    { id: 1, type: 'system', content: '궁금한 점을 자유롭게 물어보세요. /help로 명령어 확인.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const lineIdRef = useRef(2);
  
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
      inputRef.current?.focus();
    }
  }, [isLoading, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 80)}px`;
    }
  }, [input]);

  const getNextId = useCallback(() => {
    const id = lineIdRef.current;
    lineIdRef.current += 1;
    return id;
  }, []);

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    const newId = getNextId();
    setLines(prev => [...prev, { id: newId, type, content }]);
    return newId;
  }, [getNextId]);

  const typeLines = useCallback(async (outputLines: string[], type: TerminalLine['type'] = 'assistant', isAscii?: boolean) => {
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
  }, [getNextId]);

  const handleCommand = useCallback(async (cmd: string) => {
    const cmdName = cmd.slice(1).toLowerCase().trim();
    
    if (cmdName === 'clear') {
      lineIdRef.current = 1;
      setLines([
        { id: 0, type: 'system', content: '터미널이 초기화되었습니다.' },
      ]);
      setChatHistory([]);
      return;
    }
    
    const commandFn = COMMANDS[cmdName];
    if (commandFn) {
      const output = commandFn();
      await typeLines(output.lines, 'assistant', output.isAscii);
    } else {
      addLine('system', `알 수 없는 명령어: ${cmd}. /help로 확인하세요.`);
    }
  }, [addLine, typeLines]);

  const sendToAI = useCallback(async (message: string) => {
    setIsLoading(true);
    
    // Add thinking indicator
    const thinkingId = getNextId();
    setLines(prev => [...prev, { id: thinkingId, type: 'system', content: '생각 중...' }]);
    
    const newChatHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newChatHistory }),
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const aiResponse = data.response || '응답을 생성하지 못했어요.';
      
      // Remove thinking indicator
      setLines(prev => prev.filter(l => l.id !== thinkingId));
      
      setChatHistory([...newChatHistory, { role: 'assistant', content: aiResponse }]);
      
      // Type AI response
      const responseLines = aiResponse.split('\n');
      await typeLines(responseLines, 'assistant');
      
    } catch (error) {
      console.error('AI chat error:', error);
      setLines(prev => prev.filter(l => l.id !== thinkingId));
      addLine('system', '⚠ 응답을 가져오는 데 실패했어요.');
    }
    
    setIsLoading(false);
  }, [chatHistory, getNextId, addLine, typeLines]);

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
    <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-zinc-400 font-mono">jisub — AI Terminal</span>
        </div>
        <div className="w-[52px]" /> {/* Spacer for centering */}
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="bg-zinc-950 p-4 h-[400px] overflow-y-auto font-mono text-sm"
        style={{ scrollBehavior: 'smooth' }}
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence mode="popLayout">
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="mb-1"
            >
              {line.type === 'user' && (
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 shrink-0">❯</span>
                  <span className="text-zinc-100">{line.content}</span>
                </div>
              )}
              {line.type === 'assistant' && (
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">◆</span>
                  <span className="text-zinc-300 whitespace-pre-wrap">
                    {line.content}
                    {line.isTyping && (
                      <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-0.5 animate-pulse" />
                    )}
                  </span>
                </div>
              )}
              {line.type === 'system' && (
                <div className="text-zinc-500 italic">
                  {line.content}
                </div>
              )}
              {line.type === 'ascii' && (
                <div className="text-emerald-400 whitespace-pre font-bold">
                  {line.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-zinc-500"
          >
            <span className="text-emerald-400">◆</span>
            <span className="flex gap-1">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: '150ms' }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: '300ms' }}>●</span>
            </span>
          </motion.div>
        )}
      </div>

      {/* Input Area - Claude Code Style */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-3">
        <div className="flex items-end gap-2">
          <span className="text-blue-400 font-mono text-sm pb-2.5 shrink-0">❯</span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading || isTyping}
            rows={1}
            className="flex-1 bg-transparent text-zinc-100 font-mono text-sm resize-none placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
            style={{ minHeight: '24px', maxHeight: '80px' }}
          />
          <motion.button
            onClick={() => void handleSubmit()}
            disabled={!input.trim() || isLoading || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:bg-emerald-500/30"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="flex items-center justify-between mt-2 px-5">
          <span className="text-[10px] text-zinc-600">
            /help · 명령어 보기
          </span>
          <span className="text-[10px] text-zinc-600">
            Shift+Enter · 줄바꿈
          </span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTerminal;

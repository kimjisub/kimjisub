'use client';

import { KeyboardEvent,useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence,motion } from 'framer-motion';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'ascii';
  content: string;
  isTyping?: boolean;
}

interface CommandOutput {
  lines: string[];
  isAscii?: boolean;
}

const NEOFETCH_ASCII = `
   ██╗  ██╗██╗███╗   ███╗     ██╗██╗███████╗██╗   ██╗██████╗ 
   ██║ ██╔╝██║████╗ ████║     ██║██║██╔════╝██║   ██║██╔══██╗
   █████╔╝ ██║██╔████╔██║     ██║██║███████╗██║   ██║██████╔╝
   ██╔═██╗ ██║██║╚██╔╝██║██   ██║██║╚════██║██║   ██║██╔══██╗
   ██║  ██╗██║██║ ╚═╝ ██║╚█████╔╝██║███████║╚██████╔╝██████╔╝
   ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝ ╚════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ 
`;

const commands: Record<string, () => CommandOutput> = {
  help: () => ({
    lines: [
      '┌─────────────────────────────────────────────┐',
      '│           Available Commands                │',
      '├─────────────────────────────────────────────┤',
      '│  help      - Show this help message         │',
      '│  about     - About me                       │',
      '│  skills    - My tech stack                  │',
      '│  projects  - Featured projects              │',
      '│  contact   - Get in touch                   │',
      '│  neofetch  - System info (fun)              │',
      '│  whoami    - Who am I?                      │',
      '│  clear     - Clear terminal                 │',
      '│  history   - Command history                │',
      '└─────────────────────────────────────────────┘',
    ],
  }),
  
  about: () => ({
    lines: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '  Kim Jisub (김지섭)',
      '  Full-Stack Developer & Entrepreneur',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '  • Started coding when my app hit 5M+ downloads',
      '  • That app was UniPad (made in middle school)',
      '  • Currently CTO @ Alpaon (Industrial IoT)',
      '  • Solo Engineer @ Candid (Recruiting Platform)',
      '  • Studying CS @ Hankuk Univ. of Foreign Studies',
      '  • Alumnus of Hankuk Digital Media High School',
      '',
      '  I don\'t just write code.',
      '  I care about how products are used.',
      '',
    ],
  }),
  
  skills: () => ({
    lines: [
      '┌──────────────────────────────────────────────┐',
      '│              Tech Stack                      │',
      '├──────────────────────────────────────────────┤',
      '│                                              │',
      '│  Frontend     │  React, Next.js, TypeScript  │',
      '│               │  Vue.js, Tailwind CSS        │',
      '│                                              │',
      '│  Backend      │  Node.js, NestJS, Python     │',
      '│               │  FastAPI, PostgreSQL         │',
      '│                                              │',
      '│  Mobile       │  Android (Kotlin/Java)       │',
      '│               │  React Native, Flutter       │',
      '│                                              │',
      '│  DevOps       │  Docker, Kubernetes, AWS     │',
      '│               │  CI/CD, Terraform            │',
      '│                                              │',
      '│  AI/ML        │  LLM Integration, RAG        │',
      '│               │  OpenAI, LangChain           │',
      '│                                              │',
      '└──────────────────────────────────────────────┘',
    ],
  }),
  
  projects: () => ({
    lines: [
      '',
      '  ╔══════════════════════════════════════════════════════╗',
      '  ║                  Featured Projects                   ║',
      '  ╚══════════════════════════════════════════════════════╝',
      '',
      '  [1] UniPad',
      '      Launchpad simulator with 5M+ downloads',
      '      → https://play.google.com/store/apps/details?id=com.kimjisub.launchpad',
      '',
      '  [2] Alpaon IoT Platform',
      '      Industrial IoT monitoring system',
      '      → https://alpaon.com',
      '',
      '  [3] Candid',
      '      AI-powered recruiting platform',
      '      → https://candid.co.kr',
      '',
      '  [4] GitHub',
      '      More projects on my GitHub',
      '      → https://github.com/kimjisub',
      '',
    ],
  }),
  
  contact: () => ({
    lines: [
      '',
      '  ┌─────────────────────────────────────────┐',
      '  │            Contact Information          │',
      '  └─────────────────────────────────────────┘',
      '',
      '    📧 Email    : 0226daniel@gmail.com',
      '    💼 LinkedIn : linkedin.com/in/kimjisub',
      '    🐙 GitHub   : github.com/kimjisub',
      '    🌐 Website  : kimjisub.com',
      '',
      '    Feel free to reach out!',
      '',
    ],
  }),
  
  neofetch: () => ({
    lines: [
      NEOFETCH_ASCII,
      '',
      '  ┌──────────────────────────────────────────┐',
      '  │  jisub@portfolio                         │',
      '  ├──────────────────────────────────────────┤',
      '  │  OS        │ Human 1.0 (Developer Mode)  │',
      '  │  Host      │ South Korea                 │',
      '  │  Kernel    │ Caffeinated-6.0-LTS         │',
      '  │  Uptime    │ 25+ years                   │',
      '  │  Packages  │ npm, pip, brew, apt         │',
      '  │  Shell     │ zsh + oh-my-zsh             │',
      '  │  Editor    │ VS Code / Cursor            │',
      '  │  Terminal  │ iTerm2 / Warp               │',
      '  │  Theme     │ Dark Mode Forever           │',
      '  │  CPU       │ Caffeine-powered Brain      │',
      '  │  Memory    │ 99% used by side projects   │',
      '  └──────────────────────────────────────────┘',
      '',
    ],
    isAscii: true,
  }),
  
  whoami: () => ({
    lines: [
      '',
      '  > Kim Jisub (김지섭)',
      '  > Full-Stack Developer',
      '  > CTO & Co-founder @ Alpaon',
      '  > Software Engineer @ Candid',
      '  > CS Student @ HUFS',
      '',
      '  Status: Building cool stuff ⚡',
      '',
    ],
  }),
};

export const InteractiveTerminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, type: 'output', content: 'Welcome to Kim Jisub\'s portfolio terminal!' },
    { id: 1, type: 'output', content: 'Type "help" to see available commands.' },
    { id: 2, type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lineIdCounter, setLineIdCounter] = useState(3);
  const [isTyping, setIsTyping] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);
  
  // 타이핑이 끝나면 자동으로 input에 포커스
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);
  
  const typeOutput = useCallback(async (outputLines: string[], startId: number, isAscii?: boolean) => {
    setIsTyping(true);
    
    for (let i = 0; i < outputLines.length; i++) {
      const line = outputLines[i];
      const lineId = startId + i;
      
      if (isAscii || line.includes('╔') || line.includes('═') || line.includes('┌') || line.includes('─') || line.includes('│') || line.includes('└') || line.includes('┘') || line.includes('━')) {
        // ASCII art / box characters - instant display
        setLines(prev => [...prev, { 
          id: lineId, 
          type: isAscii ? 'ascii' : 'output', 
          content: line 
        }]);
        await new Promise(resolve => setTimeout(resolve, 20));
      } else if (line.trim() === '') {
        // Empty lines - instant
        setLines(prev => [...prev, { id: lineId, type: 'output', content: '' }]);
        await new Promise(resolve => setTimeout(resolve, 10));
      } else {
        // Regular text - typing effect
        let displayedContent = '';
        setLines(prev => [...prev, { id: lineId, type: 'output', content: '', isTyping: true }]);
        
        for (let j = 0; j < line.length; j++) {
          displayedContent += line[j];
          const content = displayedContent;
          setLines(prev => prev.map(l => 
            l.id === lineId ? { ...l, content } : l
          ));
          await new Promise(resolve => setTimeout(resolve, 8));
        }
        
        setLines(prev => prev.map(l => 
          l.id === lineId ? { ...l, isTyping: false } : l
        ));
      }
    }
    
    setIsTyping(false);
  }, []);
  
  const handleCommand = useCallback(async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const inputLineId = lineIdCounter;
    
    // Add input line
    setLines(prev => [...prev, { id: inputLineId, type: 'input', content: cmd }]);
    setLineIdCounter(prev => prev + 1);
    
    if (trimmedCmd === '') {
      return;
    }
    
    // Add to history
    if (trimmedCmd !== commandHistory[0]) {
      setCommandHistory(prev => [trimmedCmd, ...prev.slice(0, 49)]);
    }
    setHistoryIndex(-1);
    
    if (trimmedCmd === 'clear') {
      setLines([]);
      setLineIdCounter(0);
      // 포커스 유지
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    
    if (trimmedCmd === 'history') {
      const historyOutput: CommandOutput = {
        lines: [
          '',
          '  Command History:',
          ...commandHistory.slice(0, 10).map((h, i) => `    ${i + 1}. ${h}`),
          '',
        ],
      };
      await typeOutput(historyOutput.lines, lineIdCounter + 1);
      setLineIdCounter(prev => prev + historyOutput.lines.length + 1);
      return;
    }
    
    const commandFn = commands[trimmedCmd];
    
    if (commandFn) {
      const output = commandFn();
      await typeOutput(output.lines, inputLineId + 1, output.isAscii);
      setLineIdCounter(prev => prev + output.lines.length + 1);
    } else {
      const errorLines = [
        `  Command not found: ${trimmedCmd}`,
        '  Type "help" for available commands.',
        '',
      ];
      await typeOutput(errorLines, inputLineId + 1);
      setLineIdCounter(prev => prev + errorLines.length + 1);
    }
  }, [lineIdCounter, commandHistory, typeOutput]);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
      setLineIdCounter(0);
    }
  };
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  return (
    <div 
      className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-2xl border border-border"
      onClick={focusInput}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-sm text-muted-foreground ml-2 font-mono">
          jisub@portfolio ~ 
        </span>
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="bg-zinc-900 dark:bg-zinc-950 p-4 h-[400px] overflow-y-auto font-mono text-sm cursor-text"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence mode="popLayout">
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className={`
                whitespace-pre-wrap break-all
                ${line.type === 'input' ? 'text-accent' : ''}
                ${line.type === 'output' ? 'text-zinc-300' : ''}
                ${line.type === 'ascii' ? 'text-accent font-bold' : ''}
              `}
            >
              {line.type === 'input' && (
                <span className="text-accent">
                  <span className="text-blue-400">jisub</span>
                  <span className="text-zinc-500">@</span>
                  <span className="text-green-400">portfolio</span>
                  <span className="text-zinc-500">:</span>
                  <span className="text-blue-300">~</span>
                  <span className="text-zinc-500">$</span>
                  <span className="text-zinc-100"> {line.content}</span>
                </span>
              )}
              {line.type !== 'input' && (
                <>
                  {line.content}
                  {line.isTyping && (
                    <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse" />
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Input Line */}
        {!isTyping && (
          <div className="flex items-center text-accent">
            <span className="text-blue-400">jisub</span>
            <span className="text-zinc-500">@</span>
            <span className="text-green-400">portfolio</span>
            <span className="text-zinc-500">:</span>
            <span className="text-blue-300">~</span>
            <span className="text-zinc-500">$</span>
            <span className="text-zinc-100 ml-1">{currentInput}</span>
            <span className="inline-block w-2 h-5 bg-accent ml-0.5 animate-[pulse_1s_infinite]" />
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute opacity-0 w-0 h-0"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>
      
      {/* Mobile hint */}
      <div className="bg-secondary px-4 py-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Click to focus • ↑↓ for history • Ctrl+L to clear
        </span>
        <span className="text-xs text-muted-foreground hidden sm:block">
          Try: <code className="bg-muted px-1 rounded">neofetch</code>
        </span>
      </div>
    </div>
  );
};

export default InteractiveTerminal;

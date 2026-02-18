'use client';

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Command, Sparkles, Terminal, User } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant' | 'system' | 'command';
  content: string;
  isTyping?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGES: Message[] = [
  { id: 0, type: 'system', content: '김지섭의 AI 포트폴리오에 오신 걸 환영합니다 👋' },
  { id: 1, type: 'system', content: '궁금한 점을 자유롭게 물어보세요. /help로 명령어도 확인할 수 있어요.' },
];

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    '📋 **사용 가능한 명령어**',
    '',
    '`/about` - 저에 대해',
    '`/skills` - 기술 스택',
    '`/projects` - 주요 프로젝트',
    '`/contact` - 연락처',
    '`/clear` - 대화 초기화',
    '',
    '또는 자연어로 질문해보세요!',
    '예: "어떤 프로젝트 해봤어요?"',
  ],
  about: () => [
    '👋 **김지섭 (Jisub Kim)**',
    '',
    '• Alpaon CTO & 코파운더 (산업용 IoT)',
    '• Candid Product Engineer (스타트업 채용)',
    '• 한국외대 컴공 졸업 예정',
    '',
    '중학생 때 만든 UniPad가 1,000만 다운로드를 넘으면서',
    '이 길이 내 길이구나 확신하게 됐어요.',
    '',
    '"코드 작성"보다 "돌아가는 시스템 만들기"를 좋아합니다.',
  ],
  skills: () => [
    '🛠️ **기술 스택**',
    '',
    '**Frontend**: React, Next.js, TypeScript, Vue.js',
    '**Backend**: Node.js, NestJS, Python, FastAPI',
    '**Mobile**: Android (Kotlin), React Native',
    '**DevOps**: Docker, K8s, AWS, Terraform',
    '**AI/ML**: LLM Integration, RAG, 추천시스템',
    '**Firmware**: C/C++ (펌웨어 개발)',
  ],
  projects: () => [
    '🚀 **주요 프로젝트**',
    '',
    '**UniPad** - 1,000만+ 다운로드 런치패드 앱',
    '→ 중학생 때 개발, 광고 수익으로 대기업 초봉급 월수입',
    '',
    '**AlpaConnect** - 산업용 PLC 클라우드 연결',
    '→ 원격 모니터링/제어, LLM 기반 대화형 제어',
    '',
    '**Candid AI** - 스타트업 채용 추천 시스템',
    '→ 2-stage 추천, AI Agent 개발',
  ],
  contact: () => [
    '📬 **연락처**',
    '',
    '• Email: 0226daniel@gmail.com',
    '• GitHub: github.com/kimjisub',
    '• LinkedIn: linkedin.com/in/kimjisub',
    '',
    '협업이나 문의는 편하게 연락주세요!',
  ],
};

export const InteractiveTerminal = () => {
  const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [messageIdCounter, setMessageIdCounter] = useState(2);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const addMessage = useCallback((type: Message['type'], content: string) => {
    const newId = messageIdCounter;
    setMessageIdCounter(prev => prev + 1);
    setMessages(prev => [...prev, { id: newId, type, content }]);
    return newId;
  }, [messageIdCounter]);

  const typeMessage = useCallback(async (content: string) => {
    const newId = messageIdCounter;
    setMessageIdCounter(prev => prev + 1);
    
    setMessages(prev => [...prev, { id: newId, type: 'assistant', content: '', isTyping: true }]);
    
    // Type character by character
    for (let i = 0; i <= content.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 12));
      setMessages(prev => prev.map(m => 
        m.id === newId ? { ...m, content: content.slice(0, i) } : m
      ));
    }
    
    setMessages(prev => prev.map(m => 
      m.id === newId ? { ...m, isTyping: false } : m
    ));
  }, [messageIdCounter]);

  const handleCommand = useCallback(async (cmd: string) => {
    const cmdName = cmd.slice(1).toLowerCase().trim();
    
    if (cmdName === 'clear') {
      setMessages(WELCOME_MESSAGES);
      setMessageIdCounter(2);
      setChatHistory([]);
      return;
    }
    
    const commandFn = COMMANDS[cmdName];
    if (commandFn) {
      const output = commandFn().join('\n');
      await typeMessage(output);
    } else {
      addMessage('system', `알 수 없는 명령어: /${cmdName}. /help로 명령어를 확인하세요.`);
    }
  }, [addMessage, typeMessage]);

  const sendToAI = useCallback(async (message: string) => {
    setIsLoading(true);
    
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
      
      setChatHistory([...newChatHistory, { role: 'assistant', content: aiResponse }]);
      await typeMessage(aiResponse);
      
    } catch (error) {
      console.error('AI chat error:', error);
      addMessage('system', '⚠️ 응답을 가져오는 데 실패했어요. 잠시 후 다시 시도해주세요.');
    }
    
    setIsLoading(false);
  }, [chatHistory, addMessage, typeMessage]);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    
    setInput('');
    addMessage('user', trimmed);
    
    if (trimmed.startsWith('/')) {
      await handleCommand(trimmed);
    } else {
      await sendToAI(trimmed);
    }
  }, [input, isLoading, addMessage, handleCommand, sendToAI]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => {
      let processed = line;
      // Bold
      processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Code
      processed = processed.replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs">$1</code>');
      // Links
      processed = processed.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-accent hover:underline">$1</a>');
      
      return (
        <span key={i} className="block" dangerouslySetInnerHTML={{ __html: processed || '&nbsp;' }} />
      );
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">AI로 저에 대해 물어보세요</h3>
          <p className="text-xs text-muted-foreground">Claude가 저를 대신해 답변해드려요</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {msg.type !== 'system' && (
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.type === 'user' 
                      ? 'bg-accent text-accent-foreground' 
                      : msg.type === 'command'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : msg.type === 'command' ? (
                      <Terminal className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                )}
                
                {/* Message Bubble */}
                <div className={`max-w-[80%] ${
                  msg.type === 'system' 
                    ? 'w-full text-center text-sm text-muted-foreground py-2' 
                    : msg.type === 'user'
                    ? 'bg-accent text-accent-foreground rounded-2xl rounded-tr-md px-4 py-2.5'
                    : 'bg-secondary/50 rounded-2xl rounded-tl-md px-4 py-2.5'
                }`}>
                  <div className="text-sm leading-relaxed">
                    {renderContent(msg.content)}
                    {msg.isTyping && (
                      <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-secondary/50 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-3 bg-background/50">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none bg-secondary/50 border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 disabled:opacity-50 transition-all"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 text-xs text-muted-foreground/50 pointer-events-none hidden sm:flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
            <motion.button
              onClick={() => void handleSubmit()}
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 w-11 h-11 rounded-xl bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
            /help로 명령어 보기 • Shift+Enter로 줄바꿈
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTerminal;

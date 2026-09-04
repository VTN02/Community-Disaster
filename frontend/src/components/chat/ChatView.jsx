import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { chatApi } from '../../services/api';

const SUGGESTED_QUESTIONS = [
  'How do I prepare for a flood?',
  'What should I keep in an emergency kit?',
  'What should I do during an earthquake?',
  'What should I do during a cyclone?',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'ai',
  text: "Hello! I'm your Disaster Assistant. Ask me anything about disaster preparedness, safety, emergency response, or recovery.",
  timestamp: new Date(),
};

/**
 * Formatter component to display AI markdown safely and attractively
 */
const FormattedMessage = ({ text }) => {
  const lines = text.split('\n');

  // Helper to format inline bold, numbers, etc.
  const formatInline = (str) => {
    // Split by bold tokens **...**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-700">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={index} className="h-1.5" />;
        }

        // Horizontal line
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={index} className="my-3 border-slate-200" />;
        }

        // Level 3/4 Header (### or ####)
        if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4
              key={index}
              className="text-base font-bold text-slate-900 mt-3 mb-1 flex items-center gap-1.5"
            >
              {formatInline(headerText)}
            </h4>
          );
        }

        // Level 1/2 Header (# or ##)
        if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h3
              key={index}
              className="text-lg font-bold text-blue-950 mt-4 mb-2 pb-1 border-b border-slate-200"
            >
              {formatInline(headerText)}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.slice(2);
          return (
            <div key={index} className="flex items-start gap-2 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <div className="flex-1">{formatInline(itemText)}</div>
            </div>
          );
        }

        // Numbered list (e.g. 1. or 2.)
        const matchNumber = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (matchNumber) {
          const [, num, itemText] = matchNumber;
          return (
            <div key={index} className="flex items-start gap-2.5 ml-1 mt-1">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {num}
              </span>
              <div className="flex-1">{formatInline(itemText)}</div>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={index} className="leading-relaxed">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const ChatView = ({ isCompact = false, onHeaderClose = null }) => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new message or loading state change
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input on load
  useEffect(() => {
    if (!isCompact) {
      inputRef.current?.focus();
    }
  }, [isCompact]);

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorBanner(null);
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(text);
      const reply = response.data?.reply || 'No response received.';

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get chat response:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to connect to the Disaster Assistant. Please ensure the backend and network are operational.';

      setErrorBanner(errorMessage);

      // Add friendly error bubble
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `⚠️ **Notice:** ${errorMessage}`,
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setErrorBanner(null);
    inputRef.current?.focus();
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white px-5 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Bot className="w-5 h-5 text-blue-200" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-blue-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base md:text-lg leading-tight tracking-tight text-white">
                Disaster Assistant
              </h2>
              <span className="bg-blue-500/30 text-blue-200 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-blue-400/30">
                AI
              </span>
            </div>
            <p className="text-xs text-blue-200 line-clamp-1 mt-0.5">
              Ask questions about disaster safety and preparedness
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {onHeaderClose && (
            <button
              type="button"
              onClick={onHeaderClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Close chat"
              aria-label="Close chat"
            >
              <span className="text-xl leading-none">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Quick Hotlines Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900 flex-shrink-0">
        <div className="flex items-center gap-1.5 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="hidden sm:inline">Emergency Hotlines (SL):</span>
          <span className="sm:hidden">Hotlines:</span>
          <span className="font-bold text-amber-800">117 (DMC)</span> •
          <span className="font-bold text-amber-800">119 (Police)</span> •
          <span className="font-bold text-amber-800">1990 (Ambulance)</span>
        </div>
        <span className="text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full font-semibold hidden md:inline">
          Official Emergency Aid
        </span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 animate-fade-in ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-blue-600 to-blue-700 text-white'
                  : msg.isError
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-white text-blue-600 border border-slate-200'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm relative group transition-all ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : msg.isError
                  ? 'bg-amber-50 border border-amber-200 text-slate-800 rounded-tl-none'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
              }`}
            >
              {msg.sender === 'user' ? (
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              ) : (
                <>
                  <FormattedMessage text={msg.text} />
                  {/* Message Tools (Copy) */}
                  {!msg.isError && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[11px]">
                        Disaster Safety Guide
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 text-[11px] font-medium">
                              Copied!
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Suggested Prompts (Visible after welcome or anytime users want quick access) */}
        {messages.length <= 2 && !isLoading && (
          <div className="pt-2 pb-1 animate-fade-in">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Suggested questions:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((question, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="text-left text-xs sm:text-sm bg-white hover:bg-blue-50/80 text-slate-700 hover:text-blue-700 font-medium p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 shadow-xs flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{question}</span>
                  <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-1">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-white text-blue-600 border border-slate-200 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3.5 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span
                className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
                style={{ animationDelay: '200ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"
                style={{ animationDelay: '400ms' }}
              />
              <span className="text-xs text-slate-500 font-medium ml-1">
                Consulting Disaster Assistant...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-200 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              id="chat-message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about disaster safety, preparedness, recovery..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary py-3 px-4 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-2">
          Safety guidance provided by AI. In life-threatening emergencies, immediately dial{' '}
          <strong className="text-slate-600">117</strong> or{' '}
          <strong className="text-slate-600">119</strong>.
        </p>
      </div>
    </div>
  );
};

export default ChatView;

import { useState, useEffect } from 'react';
import { MessageSquare, X, Bot, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import ChatView from './ChatView';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Allow custom window event to trigger opening the chat from any navbar/button in the app
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-disaster-chat', handleOpenChat);
    return () => window.removeEventListener('open-disaster-chat', handleOpenChat);
  }, []);

  // Subtle delayed hint badge on first page load to invite interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Popover Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 mb-3 animate-slide-up ${
            isExpanded
              ? 'fixed inset-4 sm:inset-10 z-50 w-auto h-auto'
              : 'w-[94vw] sm:w-[420px] md:w-[450px] h-[580px] max-h-[80vh]'
          }`}
        >
          {/* Action Bar inside widget */}
          <div className="bg-slate-900 text-slate-300 px-3 py-1.5 flex items-center justify-between text-xs border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sri Lanka Disaster AI Assistant
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Restore size' : 'Expand full screen'}
                aria-label={isExpanded ? 'Restore size' : 'Expand full screen'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Core Chat View */}
          <div className="flex-1 overflow-hidden">
            <ChatView isCompact onHeaderClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {/* Launcher Button Area */}
      <div className="flex items-center gap-3">
        {/* Helper speech bubble when closed */}
        {!isOpen && hasPrompted && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs font-medium px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 cursor-pointer hover:border-blue-300 hover:text-blue-600 transition-all animate-fade-in group"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>Need disaster advice? Ask AI</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasPrompted(false);
              }}
              className="text-slate-400 hover:text-slate-600 ml-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Floating Action Toggle Button */}
        <button
          type="button"
          id="disaster-chatbot-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Disaster Assistant' : 'Open Disaster Assistant'}
          className={`relative p-3.5 sm:px-4 sm:py-3 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-2.5 font-semibold text-white ${
            isOpen
              ? 'bg-slate-800 hover:bg-slate-900 ring-2 ring-slate-400/20'
              : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 ring-4 ring-blue-500/20 hover:scale-105 active:scale-95'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-700 rounded-full" />
              </div>
              <span className="hidden sm:inline text-sm font-bold tracking-tight">
                Disaster Assistant
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;

import { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Zap } from 'lucide-react';

export const ChatWidget = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand via-brand-light to-teal-500 text-white p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={20} className="text-yellow-200 hidden sm:block" />
          <Zap size={18} className="text-yellow-200 sm:hidden" />
          <h2 className="text-base sm:text-lg lg:text-xl font-bold">Energy Concierge</h2>
        </div>
        <p className="text-xs sm:text-sm text-green-100">AI-powered energy assistant • Powered by Groq</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 space-y-2 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

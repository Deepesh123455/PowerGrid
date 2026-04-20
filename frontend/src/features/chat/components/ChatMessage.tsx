import type { Message } from '../types/chat.types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-brand to-brand-light text-white rounded-br-none shadow-md'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-sm'
        }`}
      >
        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children }) => (
                <code className={`${isUser ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-600'} px-2 py-1 rounded text-xs font-mono`}>
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <span
          className={`text-xs mt-2 block ${
            isUser ? 'text-green-100 opacity-80' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

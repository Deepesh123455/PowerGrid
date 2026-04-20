import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-200 dark:border-slate-600 p-3 sm:p-4 bg-white dark:bg-slate-800 flex-shrink-0"
    >
      <div className="flex gap-2 sm:gap-3">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder="Ask about energy efficiency, bills, appliances..."
          className="flex-1 px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-brand dark:bg-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-gradient-to-r from-brand to-brand-light hover:shadow-lg text-white p-2 sm:p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
        >
          <Send size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 mb-4">
      <div className="flex gap-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-none">
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

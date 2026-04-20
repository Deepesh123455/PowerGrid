import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export const FloatingChatButton = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Floating Button - Click to navigate to chat page */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-6 right-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand to-brand-light hover:shadow-2xl text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-40 active:scale-95"
        aria-label="Open Energy Concierge Chat"
      >
        <MessageCircle size={20} className="sm:w-7 sm:h-7" />
      </button>
    </>
  );
};

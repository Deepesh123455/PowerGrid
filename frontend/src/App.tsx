import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { FloatingChatButton } from './features/chat/components/FloatingChatButton';

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="app-container min-h-screen transition-colors duration-500">
      <main>
        <Outlet />
      </main>
      <FloatingChatButton />
    </div>
  );
}

export default App;

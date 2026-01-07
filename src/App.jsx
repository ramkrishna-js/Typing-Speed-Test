import { useState, useEffect } from 'react';
import TypingTest from './components/TypingTest';
import Home from './components/Home';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'test'

  // Handle global Enter key to start test from home
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view === 'home' && e.key === 'Enter') {
        setView('test');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  return (
    <div className="min-h-screen bg-[var(--color-main-bg)] text-[var(--color-main-text)] font-mono overflow-hidden">
      {view === 'home' && <Home onStart={() => setView('test')} />}
      {view === 'test' && <TypingTest onExit={() => setView('home')} />}
      
      {/* Global Footer (visible on Home, usually hidden or minimal on Test) */}
      {view === 'home' && (
         <footer className="fixed bottom-2 w-full text-center text-xs text-[var(--color-main-text)] opacity-30">
            <a href="https://github.com/ramkrishna-js/Typing-Speed-Test" target="_blank" rel="noreferrer" className="hover:text-[var(--color-active-text)] transition-colors">
              View Source on GitHub
            </a>
         </footer>
      )}
    </div>
  );
}

export default App;
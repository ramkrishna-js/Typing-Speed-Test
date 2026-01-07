import { useState, useEffect } from 'react';
import TypingTest from './components/TypingTest';
import Home from './components/Home';
import Credits from './components/Credits';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'test' | 'credits'

  return (
    <div className="h-screen w-full bg-[var(--color-main-bg)] text-[var(--color-main-text)] font-mono flex flex-col overflow-hidden">
      {view === 'home' && (
        <Home 
          onStart={() => setView('test')} 
          onCredits={() => setView('credits')} 
        />
      )}
      
      {view === 'test' && (
        <TypingTest 
          onExit={() => setView('home')} 
        />
      )}
      
      {view === 'credits' && (
        <Credits 
          onBack={() => setView('home')} 
        />
      )}
    </div>
  );
}

export default App;

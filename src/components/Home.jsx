import { useEffect } from 'react';

const Home = ({ onStart, onCredits }) => {
  // Handle global Enter key to start test
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 space-y-10 relative">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-active-text)] tracking-tighter">
          Typing Speed Test
        </h1>
        <p className="text-lg md:text-2xl text-[var(--color-main-text)] max-w-2xl mx-auto leading-relaxed opacity-80">
          A minimalist typing experience. Test your speed, improve your accuracy, and master the keyboard.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center relative z-10">
        <button
          onClick={onStart}
          className="px-10 py-5 bg-[var(--color-caret)] text-[var(--color-main-bg)] text-2xl font-black rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg"
        >
          START TYPING
        </button>

        <button
          onClick={onCredits}
          className="px-10 py-5 bg-transparent border-2 border-[var(--color-main-text)] text-[var(--color-main-text)] text-2xl font-bold rounded-xl hover:border-[var(--color-active-text)] hover:text-[var(--color-active-text)] transition-all duration-200 cursor-pointer"
        >
          CREDITS
        </button>
      </div>

      <div className="pt-10 flex flex-col items-center space-y-2 opacity-40">
        <div className="flex items-center space-x-2">
          <kbd className="bg-gray-700 px-2 py-1 rounded text-gray-300 text-sm font-mono">Enter</kbd>
          <span className="text-sm">to start</span>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs text-[var(--color-main-text)] opacity-30">
        <a href="https://github.com/ramkrishna-js/Typing-Speed-Test" target="_blank" rel="noreferrer" className="hover:text-[var(--color-active-text)] transition-colors">
          View Source on GitHub
        </a>
      </footer>
    </div>
  );
};

export default Home;

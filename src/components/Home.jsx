const Home = ({ onStart, onCredits }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 animate-fade-in p-4">
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-active-text)] tracking-tight">
          Typing Speed Test
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--color-main-text)] max-w-lg leading-relaxed">
          Master your typing skills in a distraction-free environment. 
          Minimalist design, smooth animations, and instant feedback.
        </p>
  
        <div className="pt-8 flex flex-col md:flex-row gap-6">
          <button
            onClick={onStart}
            className="group relative px-8 py-4 bg-[var(--color-caret)] text-[var(--color-main-bg)] text-xl font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 ring-offset-4 ring-offset-[var(--color-main-bg)] ring-[var(--color-caret)]"
          >
            Start Typing
          </button>

          <button
            onClick={onCredits}
            className="px-8 py-4 bg-transparent border-2 border-[var(--color-main-text)] text-[var(--color-main-text)] text-xl font-bold rounded-lg hover:border-[var(--color-active-text)] hover:text-[var(--color-active-text)] transition-all duration-200 focus:outline-none"
          >
            Credits
          </button>
        </div>
  
        <div className="absolute bottom-8 text-[var(--color-main-text)] opacity-60 text-sm">
          Press <kbd className="bg-gray-700 px-2 py-1 rounded mx-1 text-gray-300">Enter</kbd> to start
        </div>
      </div>
    );
  };
  
  export default Home;
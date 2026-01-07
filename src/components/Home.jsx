const Home = ({ onStart }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-6xl font-bold text-[var(--color-active-text)] tracking-tight">
          Typing Speed Test
        </h1>
        
        <p className="text-xl text-[var(--color-main-text)] max-w-lg leading-relaxed">
          Master your typing skills in a distraction-free environment. 
          Minimalist design, smooth animations, and instant feedback.
        </p>
  
        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative px-8 py-4 bg-[var(--color-caret)] text-[var(--color-main-bg)] text-xl font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 ring-offset-4 ring-offset-[var(--color-main-bg)] ring-[var(--color-caret)]"
          >
            Start Typing
            <span className="absolute inset-0 rounded-lg bg-white/20 group-hover:bg-transparent transition-colors"></span>
          </button>
        </div>
  
        <div className="absolute bottom-8 text-[var(--color-main-text)] opacity-60 text-sm">
          Press <kbd className="bg-gray-700 px-2 py-1 rounded mx-1 text-gray-300">Enter</kbd> to start
        </div>
      </div>
    );
  };
  
  export default Home;

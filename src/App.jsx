import { useState, useEffect, useRef, useMemo } from 'react';

// ==========================================
// DATA & CONSTANTS
// ==========================================
const COMMON_WORDS = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "i", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"
];

// ==========================================
// SUB-COMPONENTS (Inlined to prevent import issues)
// ==========================================

const Home = ({ onStart, onCredits }) => {
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
      
      {/* Version Stamp to prove new deploy */}
      <div className="absolute top-2 right-2 text-xs text-gray-600">v1.4.0 (Inlined)</div>

      <footer className="absolute bottom-4 w-full text-center text-xs text-[var(--color-main-text)] opacity-30">
        <a href="https://github.com/ramkrishna-js/Typing-Speed-Test" target="_blank" rel="noreferrer" className="hover:text-[var(--color-active-text)] transition-colors">
          View Source on GitHub
        </a>
      </footer>
    </div>
  );
};

const TypingTest = ({ onExit }) => {
  const [words, setWords] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [currIndex, setCurrIndex] = useState(0); 
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(30);
  const [testDuration, setTestDuration] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [caretPosition, setCaretPosition] = useState({ top: 0, left: 0 });
  const [isFocused, setIsFocused] = useState(true);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const letterRefs = useRef({});
  const timerRef = useRef(null);

  useEffect(() => {
    resetTest();
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (isActive && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timer]);

  useEffect(() => {
    if (letterRefs.current[currIndex]) {
      const letter = letterRefs.current[currIndex];
      setCaretPosition({
        top: letter.offsetTop,
        left: letter.offsetLeft,
      });
    }
  }, [currIndex, words]);

  const generateWords = () => {
    const shuffled = [...COMMON_WORDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 50);
  };

  const resetTest = () => {
    const newWords = generateWords();
    setWords(newWords);
    setUserInput("");
    setCurrIndex(0);
    setStartTime(null);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setTimer(testDuration);
    clearInterval(timerRef.current);
    letterRefs.current = {};
    
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    clearInterval(timerRef.current);
    calculateResults();
  };

  const calculateResults = () => {
    const correctChars = userInput.split('').filter((char, i) => char === flattenWords[i]).length;
    const totalChars = userInput.length;
    const timeSpent = (testDuration - timer) / 60;
    
    const calculatedWpm = timeSpent > 0 ? Math.round((correctChars / 5) / timeSpent) : 0;
    const calculatedAcc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAcc);
  };

  const flattenWords = useMemo(() => {
    return words.join(' ');
  }, [words]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
        onExit();
        return;
    }

    if (isFinished) {
        if (e.key === 'Tab') {
            e.preventDefault();
            resetTest();
        }
        return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }
    
    if (!isFocused && e.key.length === 1) {
        inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    if (isFinished) return;

    const val = e.target.value;
    
    if (!isActive && val.length === 1) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setUserInput(val);
    setCurrIndex(val.length);

    const currentString = flattenWords;
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
        if (val[i] === currentString[i]) correct++;
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);
    
    if (startTime) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60;
        if (timeElapsed > 0) {
            setWpm(Math.round((correct / 5) / timeElapsed));
        }
    }

    if (val.length >= currentString.length) {
        finishTest();
    }
  };

  const handleDurationChange = (duration) => {
      setTestDuration(duration);
      setTimer(duration);
      resetTest();
  };

  if (words.length === 0) return <div className="w-full h-full flex items-center justify-center text-[var(--color-main-text)]">Loading...</div>;

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8 relative outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
        <div className="absolute top-10 left-0 right-0 flex justify-center space-x-8 text-lg text-[var(--color-main-text)] select-none z-20">
            <div className="flex space-x-4 bg-[var(--color-main-bg)] px-4 py-2 rounded-lg">
                <button onClick={() => handleDurationChange(15)} className={`hover:text-[var(--color-active-text)] transition-colors ${testDuration === 15 ? 'text-[var(--color-caret)]' : ''}`}>15s</button>
                <button onClick={() => handleDurationChange(30)} className={`hover:text-[var(--color-active-text)] transition-colors ${testDuration === 30 ? 'text-[var(--color-caret)]' : ''}`}>30s</button>
                <button onClick={() => handleDurationChange(60)} className={`hover:text-[var(--color-active-text)] transition-colors ${testDuration === 60 ? 'text-[var(--color-caret)]' : ''}`}>60s</button>
            </div>
        </div>

        {!isFocused && !isFinished && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer" onClick={() => inputRef.current.focus()}>
                <div className="text-[var(--color-active-text)] text-xl">Click to focus</div>
            </div>
        )}

        <div className="max-w-4xl w-full flex flex-col items-center space-y-12">
            
            <div className={`flex justify-between w-full max-w-2xl text-2xl text-[var(--color-caret)] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <div>{timer}s</div>
                <div>{wpm} WPM</div>
            </div>

            {!isFinished ? (
                <div 
                    className="relative w-full max-w-4xl text-3xl leading-relaxed break-all select-none outline-none"
                    onClick={() => inputRef.current.focus()}
                    ref={containerRef}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        className="absolute opacity-0 -z-10"
                        value={userInput}
                        onChange={handleInputChange}
                        onBlur={() => setIsFocused(false)}
                        onFocus={() => setIsFocused(true)}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />

                    <div className="flex flex-wrap relative">
                        {isFocused && (
                            <div 
                                className="absolute w-0.5 h-8 bg-[var(--color-caret)] blink caret transition-all duration-100 ease-out"
                                style={{ top: caretPosition.top + 4, left: caretPosition.left }}
                            ></div>
                        )}

                        {flattenWords.split('').map((char, index) => {
                            let statusClass = "text-[var(--color-main-text)]";
                            if (index < userInput.length) {
                                statusClass = userInput[index] === char ? "text-[var(--color-active-text)]" : "text-[var(--color-error)]";
                            }
                            return (
                                <span key={index} ref={el => letterRefs.current[index] = el} className={`${statusClass} transition-colors duration-75`}>
                                    {char}
                                </span>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
                     <div className="grid grid-cols-2 gap-12 text-center">
                        <div>
                            <div className="text-[var(--color-main-text)] text-2xl mb-1">wpm</div>
                            <div className="text-[var(--color-caret)] text-7xl font-bold">{wpm}</div>
                        </div>
                        <div>
                            <div className="text-[var(--color-main-text)] text-2xl mb-1">acc</div>
                            <div className="text-[var(--color-caret)] text-7xl font-bold">{accuracy}%</div>
                        </div>
                    </div>
                    <div className="flex space-x-4 pt-8">
                         <button 
                            onClick={resetTest}
                            className="px-8 py-3 bg-[var(--color-main-text)] text-[var(--color-main-bg)] rounded text-xl hover:bg-[var(--color-active-text)] transition-colors focus:outline-none focus:ring-2 ring-[var(--color-caret)]"
                            autoFocus
                        >
                            Restart (Tab)
                        </button>
                    </div>
                </div>
            )}
            
             <div className="fixed bottom-8 text-[var(--color-main-text)] text-sm opacity-50 flex gap-8">
                <span><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Tab</kbd> to restart</span>
                <span><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Esc</kbd> to home</span>
            </div>
        </div>
    </div>
  );
};

const Credits = ({ onBack }) => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/repos/ramkrishna-js/Typing-Speed-Test/contributors')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setContributors(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Contributors fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 space-y-10 outline-none overflow-y-auto no-scrollbar"
      onKeyDown={(e) => e.key === 'Escape' && onBack()}
      tabIndex={0}
      autoFocus
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-active-text)]">Project Credits</h1>
        <p className="text-[var(--color-main-text)]">The people behind this project.</p>
      </div>

      <div className="w-full max-w-3xl bg-[var(--color-main-bg)] border border-[var(--color-main-text)] rounded-2xl p-8 shadow-2xl space-y-12">
        
        {/* Core Team */}
        <div className="space-y-6">
          <h2 className="text-sm uppercase tracking-[0.3em] text-[var(--color-main-text)] font-black text-center border-b border-[var(--color-main-text)] pb-2 opacity-50">
            Core Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Dev */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5">
              <img src="https://github.com/ramkrishna-js.png" alt="ramkrishna-js" className="w-16 h-16 rounded-full border-2 border-[var(--color-caret)]" />
              <div>
                <div className="text-[var(--color-active-text)] font-bold text-xl">ramkrishna-js</div>
                <div className="text-[var(--color-main-text)] text-sm italic">Lead Developer</div>
              </div>
            </div>

            {/* Co-Author / Collaborator */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5">
              <img src="https://github.com/manjunathh-xyz.png" alt="manjunathh-xyz" className="w-16 h-16 rounded-full border-2 border-[var(--color-caret)]" />
              <div>
                <div className="text-[var(--color-active-text)] font-bold text-xl">manjunathh-xyz</div>
                <div className="text-[var(--color-main-text)] text-sm italic">Co-Author</div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Contributors */}
        <div className="space-y-6">
          <h2 className="text-sm uppercase tracking-[0.3em] text-[var(--color-main-text)] font-black text-center border-b border-[var(--color-main-text)] pb-2 opacity-50">
            Contributors
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[var(--color-caret)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {contributors
                .filter(c => c.login !== 'ramkrishna-js' && c.login !== 'manjunathh-xyz')
                .map(contributor => (
                  <a 
                    key={contributor.id} 
                    href={contributor.html_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <img src={contributor.avatar_url} alt={contributor.login} className="w-12 h-12 rounded-full mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-[var(--color-main-text)] group-hover:text-[var(--color-active-text)] text-sm truncate w-full text-center">
                      {contributor.login}
                    </span>
                  </a>
                ))}
              {contributors.filter(c => c.login !== 'ramkrishna-js' && c.login !== 'manjunathh-xyz').length === 0 && (
                <div className="col-span-full text-center py-4 text-[var(--color-main-text)] italic text-sm">
                  Waiting for more amazing people to contribute...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onBack}
        className="px-8 py-3 text-[var(--color-main-text)] hover:text-[var(--color-active-text)] text-lg transition-colors flex items-center space-x-2"
      >
        <span>← Back to Home</span>
        <kbd className="hidden sm:inline bg-gray-700 px-2 py-1 rounded text-xs ml-2">Esc</kbd>
      </button>
    </div>
  );
};


// ==========================================
// MAIN APP COMPONENT
// ==========================================

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
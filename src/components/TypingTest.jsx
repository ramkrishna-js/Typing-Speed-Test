import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const COMMON_WORDS = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "i", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"
];

const TypingTest = () => {
  const navigate = useNavigate();
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
    const correctChars = userInput.split('').filter((char, i) => char === flattenWords()[i]).length;
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
        navigate('/');
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

    const currentString = flattenWords();
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

                        {flattenWords().split('').map((char, index) => {
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

export default TypingTest;
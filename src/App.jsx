import { useState, useEffect, useRef } from 'react';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the English alphabet, making it perfect for typing practice. Speed and accuracy are both important when you are learning to type efficiently.",
  "Programming is not just about writing code; it is about solving problems and creating solutions that make people's lives easier. Consistency and curiosity are key traits of a successful software developer.",
  "The sun was setting behind the mountains, casting a golden glow over the valley. It was a peaceful evening, the kind that makes you stop and appreciate the simple beauty of nature.",
  "Artificial intelligence is transforming the way we interact with technology. From voice assistants to self-driving cars, the possibilities seem endless, yet we must remain mindful of the ethical implications.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Winston Churchill's words remind us that persistence is often more important than immediate results."
];

function App() {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startNewTest();
  }, []);

  useEffect(() => {
    if (isActive && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      finishTest();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timer]);

  const startNewTest = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setText(randomText);
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setTimer(60);
    setIsActive(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isActive && value.length > 0 && !isFinished) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setUserInput(value);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correctChars++;
      }
    }
    setAccuracy(value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100);

    // Check if finished
    if (value === text) {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    clearInterval(timerRef.current);
    
    const timeElapsed = (60 - timer) / 60; // in minutes
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const finalWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(finalWpm);
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let color = 'text-gray-400';
      if (index < userInput.length) {
        color = userInput[index] === char ? 'text-green-500' : 'text-red-500 bg-red-100';
      }
      return (
        <span key={index} className={`${color} transition-colors duration-100`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-mono">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-yellow-400">Typing Speed Test</h1>
          <p className="text-slate-400">Test your typing skills and improve your speed.</p>
        </div>

        <div className="flex justify-between items-center bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="text-center">
            <div className="text-sm uppercase tracking-widest text-slate-500">WPM</div>
            <div className="text-3xl font-bold text-yellow-400">{isActive ? '...' : wpm}</div>
          </div>
          <div className="text-center">
            <div className="text-sm uppercase tracking-widest text-slate-500">Accuracy</div>
            <div className="text-3xl font-bold text-yellow-400">{accuracy}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm uppercase tracking-widest text-slate-500">Time Left</div>
            <div className="text-3xl font-bold text-yellow-400">{timer}s</div>
          </div>
        </div>

        <div className="relative bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl min-h-[200px] leading-relaxed text-xl select-none">
          {renderText()}
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none"
            autoFocus
          />
        </div>

        {isFinished && (
          <div className="bg-yellow-400 text-slate-900 p-6 rounded-xl text-center space-y-4 animate-bounce">
            <h2 className="text-2xl font-bold">Test Complete!</h2>
            <p className="text-lg">You typed at <strong>{wpm} WPM</strong> with <strong>{accuracy}%</strong> accuracy.</p>
            <button
              onClick={startNewTest}
              className="bg-slate-900 text-white px-8 py-2 rounded-full font-bold hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isFinished && (
          <div className="text-center">
            <button
              onClick={startNewTest}
              className="text-slate-500 hover:text-yellow-400 transition-colors underline underline-offset-4"
            >
              Restart Test
            </button>
          </div>
        )}

        <footer className="text-center text-slate-600 text-sm pt-8">
          Built by <a href="https://github.com/ramkrishna-js" className="hover:text-yellow-400">ramkrishna-js</a>
        </footer>
      </div>
    </div>
  );
}

export default App;
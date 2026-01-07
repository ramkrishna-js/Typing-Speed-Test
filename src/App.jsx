import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TypingTest from './components/TypingTest';
import Home from './components/Home';
import Credits from './components/Credits';

function App() {
  return (
    <Router>
      <div className="h-screen w-full bg-[var(--color-main-bg)] text-[var(--color-main-text)] font-mono flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TypingTest />} />
          <Route path="/credits" element={<Credits />} />
        </Routes>
        
        {/* Global Footer (only visible on Home, handled via location check if needed, or just put inside Home) */}
      </div>
    </Router>
  );
}

export default App;
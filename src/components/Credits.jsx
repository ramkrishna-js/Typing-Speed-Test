import { useState, useEffect } from 'react';

const Credits = ({ onBack }) => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/repos/ramkrishna-js/Typing-Speed-Test/contributors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContributors(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch contributors", err);
        setLoading(false);
      });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onBack();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 animate-fade-in p-8"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      <h1 className="text-4xl font-bold text-[var(--color-active-text)]">Credits</h1>
      
      <div className="bg-[var(--color-main-bg)] border border-[var(--color-main-text)] rounded-xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Main Developer */}
        <div className="mb-10">
          <h2 className="text-xl text-[var(--color-caret)] font-bold mb-4 uppercase tracking-widest">Main Developer</h2>
          <div className="flex items-center justify-center space-x-4">
             <img src="https://github.com/ramkrishna-js.png" alt="ramkrishna-js" className="w-16 h-16 rounded-full border-2 border-[var(--color-caret)]" />
             <div className="text-left">
                <div className="text-[var(--color-active-text)] text-2xl font-bold">ramkrishna-js</div>
                <a href="https://github.com/ramkrishna-js" target="_blank" className="text-[var(--color-main-text)] hover:text-[var(--color-active-text)] text-sm underline">View Profile</a>
             </div>
          </div>
        </div>

        {/* Contributors */}
        <div>
          <h2 className="text-xl text-[var(--color-main-text)] font-bold mb-6 uppercase tracking-widest">Contributors</h2>
          
          {loading ? (
            <div className="text-[var(--color-main-text)] animate-pulse">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contributors.filter(c => c.login !== 'ramkrishna-js').length === 0 ? (
                 <div className="col-span-full text-[var(--color-main-text)] italic opacity-50">
                    No other contributors yet. Be the first!
                 </div>
              ) : (
                contributors
                  .filter(c => c.login !== 'ramkrishna-js')
                  .map(contributor => (
                    <a 
                      key={contributor.id} 
                      href={contributor.html_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <img src={contributor.avatar_url} alt={contributor.login} className="w-10 h-10 rounded-full" />
                      <span className="text-[var(--color-active-text)] font-mono">{contributor.login}</span>
                    </a>
                  ))
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onBack}
        className="text-[var(--color-main-text)] hover:text-[var(--color-active-text)] transition-colors underline"
      >
        Back to Home (Esc)
      </button>
    </div>
  );
};

export default Credits;

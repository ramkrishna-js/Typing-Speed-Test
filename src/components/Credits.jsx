import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Credits = () => {
  const navigate = useNavigate();
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
      onKeyDown={(e) => e.key === 'Escape' && navigate('/')}
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
        onClick={() => navigate('/')}
        className="px-8 py-3 text-[var(--color-main-text)] hover:text-[var(--color-active-text)] text-lg transition-colors flex items-center space-x-2"
      >
        <span>← Back to Home</span>
        <kbd className="hidden sm:inline bg-gray-700 px-2 py-1 rounded text-xs ml-2">Esc</kbd>
      </button>
    </div>
  );
};

export default Credits;

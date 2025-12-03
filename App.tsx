import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SongViewer } from './components/SongViewer';
import { Spinner } from './components/Spinner';
import { fetchSongChords } from './services/geminiService';
import { SongData } from './types';
import { Music, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (artist: string, title: string) => {
    setLoading(true);
    setError(null);
    setSong(null);

    try {
      const data = await fetchSongChords(artist, title);
      setSong(data);
    } catch (err: any) {
      setError(err.message || "Wystąpił nieoczekiwany błąd");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSong(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-indigo-500 selection:text-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            ChordMaster <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Inteligentna transpozycja akordów w czasie rzeczywistym. Znajdź utwór, zmień tonację i graj.
          </p>
        </header>

        {/* Content Area */}
        <main>
          {!song && !loading && (
            <div className="animate-fadeInUp">
              <SearchBar onSearch={handleSearch} isLoading={loading} />
              
              {/* Empty State / Suggestions */}
              {!error && (
                <div className="mt-12 text-center">
                  <p className="text-slate-500 text-sm uppercase tracking-widest mb-6">Popularne wyszukiwania</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { a: "Lady Gaga", t: "Shallow" },
                      { a: "Dawid Podsiadło", t: "Nieznajomy" },
                      { a: "Ed Sheeran", t: "Perfect" },
                      { a: "Kult", t: "Baranek" }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(item.a, item.t)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm text-slate-300 transition-all hover:border-indigo-500/50"
                      >
                        {item.a} - {item.t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && <Spinner />}

          {error && (
             <div className="w-full max-w-lg mx-auto bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center animate-fadeIn">
                <div className="flex justify-center mb-3">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-red-400 mb-2">Błąd</h3>
                <p className="text-slate-300 mb-4">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Spróbuj ponownie
                </button>
             </div>
          )}

          {song && (
            <SongViewer song={song} onReset={handleReset} />
          )}
        </main>
        
        <footer className="mt-20 text-center text-slate-600 text-sm">
           <p>© {new Date().getFullYear()} ChordMaster AI. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

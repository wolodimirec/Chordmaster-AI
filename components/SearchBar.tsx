import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (artist: string, title: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artist.trim() && title.trim()) {
      onSearch(artist, title);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
        <div className="flex-1">
          <label htmlFor="artist" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Artysta / Zespół</label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="np. Dawid Podsiadło"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="title" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tytuł utworu</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="np. Małomiasteczkowy"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading || !artist || !title}
            className={`w-full md:w-auto h-[50px] px-8 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
              isLoading || !artist || !title 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:transform active:scale-95'
            }`}
          >
            {isLoading ? (
              <span>Szukam...</span>
            ) : (
              <>
                <Search size={20} />
                <span>Szukaj</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

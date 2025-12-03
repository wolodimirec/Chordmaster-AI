import React, { useState, useEffect, useMemo } from 'react';
import { SongData } from '../types';
import { isChordLine, transposeLine, transposeKey } from '../utils/musicTheory';
import { Copy, RefreshCw, Minus, Plus, RotateCcw, Music } from 'lucide-react';

interface SongViewerProps {
  song: SongData;
  onReset: () => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onReset }) => {
  const [semitones, setSemitones] = useState(0);
  const [copied, setCopied] = useState(false);

  // Parse lines once, then memoize the transposition
  const lines = useMemo(() => song.content.split('\n'), [song.content]);

  // Transpose content in real-time
  const transposedLines = useMemo(() => {
    return lines.map(line => {
      if (isChordLine(line)) {
        return transposeLine(line, semitones);
      }
      return line;
    });
  }, [lines, semitones]);

  const currentKey = useMemo(() => transposeKey(song.originalKey, semitones), [song.originalKey, semitones]);

  const handleCopy = () => {
    const text = `Title: ${song.title}\nArtist: ${song.artist}\nKey: ${currentKey}\n\n${transposedLines.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetTransposition = () => setSemitones(0);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* Controls Header */}
      <div className="sticky top-4 z-20 bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 mb-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Song Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {song.title}
            </h2>
            <p className="text-slate-400 text-sm font-medium">{song.artist}</p>
          </div>

          {/* Transpose Controls */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-2 rounded-xl border border-slate-700">
             <div className="flex flex-col items-center px-2 border-r border-slate-700 mr-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tonacja</span>
                <span className="text-xl font-bold text-indigo-400 min-w-[30px] text-center">{currentKey}</span>
             </div>

            <button 
              onClick={() => setSemitones(s => Math.max(s - 1, -11))}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
              aria-label="Obniż tonację"
            >
              <Minus size={20} />
            </button>
            
            <div className="flex flex-col items-center w-16">
              <span className="text-lg font-mono font-bold">{semitones > 0 ? `+${semitones}` : semitones}</span>
              <span className="text-[9px] text-slate-500 uppercase">Półtony</span>
            </div>

            <button 
              onClick={() => setSemitones(s => Math.min(s + 1, 11))}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
              aria-label="Podwyższ tonację"
            >
              <Plus size={20} />
            </button>
            
            <button 
                onClick={handleResetTransposition}
                className="ml-2 p-2 text-xs bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-all"
                title="Resetuj tonację"
            >
                <RotateCcw size={16} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
             <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copied 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <Copy size={16} />
              <span className="hidden sm:inline">{copied ? 'Skopiowano!' : 'Kopiuj'}</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Nowa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lyrics & Chords Display */}
      <div className="bg-slate-800 rounded-2xl p-6 md:p-10 shadow-xl border border-slate-700/50 min-h-[500px]">
        <pre className="font-mono text-sm md:text-base whitespace-pre-wrap leading-relaxed">
          {transposedLines.map((line, index) => {
            const isChord = isChordLine(line);
            return (
              <div key={index} className={`${isChord ? 'text-indigo-400 font-bold mt-4' : 'text-slate-300'} transition-all duration-300`}>
                {line || ' '}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

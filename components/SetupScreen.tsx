import React, { useState } from 'react';
import { SessionConfig } from '../types';

interface SetupScreenProps {
  onStart: (config: SessionConfig) => void;
}

const ALL_TABLES = Array.from({ length: 20 }, (_, i) => i + 1);

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 3, 4, 5]);
  const [sessionLength, setSessionLength] = useState<number>(20);
  const [error, setError] = useState<string>('');

  const toggleTable = (table: number) => {
    setSelectedTables(prev =>
      prev.includes(table) ? prev.filter(t => t !== table) : [...prev, table]
    );
  };

  const handleStart = () => {
    if (selectedTables.length === 0) {
      setError('Please select at least one times table to practice.');
      return;
    }
    if (sessionLength < 5) {
      setError('Session length must be at least 5 questions.');
      return;
    }
    setError('');
    onStart({ selectedTables, sessionLength });
  };
  
  const selectPreset = (tables: number[]) => {
    setSelectedTables(tables);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mt-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Session Setup</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">Choose your tables and session length to begin.</p>
      
      {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}

      <div className="mb-6">
        <label className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Which tables would you like to practice?</label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-4">
          {ALL_TABLES.map(table => (
            <button
              key={table}
              onClick={() => toggleTable(table)}
              className={`p-3 rounded-lg font-bold text-center transition-all duration-200 transform hover:scale-105 ${
                selectedTables.includes(table)
                  ? 'bg-brand-primary text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-brand-primary'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {table}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
            <button onClick={() => selectPreset([2,3,4,5])} className="text-sm px-3 py-1 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-full hover:bg-sky-200 dark:hover:bg-sky-800/70 transition">Beginner (2-5)</button>
            <button onClick={() => selectPreset([6,7,8,9])} className="text-sm px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800/70 transition">Intermediate (6-9)</button>
            <button onClick={() => selectPreset([10,11,12])} className="text-sm px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800/70 transition">Advanced (10-12)</button>
            <button onClick={() => selectPreset([13, 14, 15, 16, 17, 18, 19, 20])} className="text-sm px-3 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full hover:bg-violet-200 dark:hover:bg-violet-800/70 transition">Expert (13-20)</button>
             <button onClick={() => selectPreset([])} className="text-sm px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600/70 transition">Clear All</button>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="session-length" className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Session Length (Number of Questions): <span className="font-bold text-brand-primary">{sessionLength}</span>
        </label>
        <input
          id="session-length"
          type="range"
          min="5"
          max="100"
          step="5"
          value={sessionLength}
          onChange={e => setSessionLength(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
        />
      </div>

      <button
        onClick={handleStart}
        className="w-full text-xl font-bold bg-brand-secondary hover:bg-green-600 text-white py-4 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
      >
        Start Practice Session
      </button>
    </div>
  );
};

export default SetupScreen;

import React from 'react';
import { SessionAttempt } from '../types';

interface ResultsScreenProps {
  history: SessionAttempt[];
  onRestart: () => void;
  onPracticeAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ history, onRestart, onPracticeAgain }) => {
  const totalQuestions = history.length;
  const correctAnswers = history.filter(h => h.isCorrect).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const avgTime = totalQuestions > 0 ? history.reduce((sum, h) => sum + h.timeTaken, 0) / totalQuestions / 1000 : 0;

  const challengingFacts = history
    .filter(h => !h.isCorrect)
    .map(h => `${h.fact.a} × ${h.fact.b}`)
    .filter((value, index, self) => self.indexOf(value) === index) // Unique facts
    .slice(0, 5);

  const StatCard: React.FC<{ label: string; value: string; icon: JSX.Element }> = ({ label, value, icon }) => (
    <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg flex items-center">
        <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary mr-4">{icon}</div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-4">Session Complete!</h2>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Here's how you did. Every practice session makes you stronger!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Accuracy" value={`${accuracy.toFixed(0)}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Total Correct" value={`${correctAnswers}/${totalQuestions}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>} />
        <StatCard label="Avg. Speed" value={`${avgTime.toFixed(2)}s`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      {challengingFacts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Facts to Focus On</h3>
          <div className="flex flex-wrap gap-3">
            {challengingFacts.map(fact => (
              <span key={fact} className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-semibold px-4 py-2 rounded-full">
                {fact}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button onClick={onPracticeAgain} className="w-full text-lg font-bold bg-brand-secondary hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          Practice Again
        </button>
        <button onClick={onRestart} className="w-full text-lg font-bold bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          New Session
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
   
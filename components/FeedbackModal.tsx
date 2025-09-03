
import React, { useState, useEffect } from 'react';
import { SessionAttempt } from '../types';
import { getScaffold } from '../services/geminiService';

interface FeedbackModalProps {
  attempt: SessionAttempt;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ attempt, onClose }) => {
  const [scaffold, setScaffold] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScaffold = async () => {
      setIsLoading(true);
      const hint = await getScaffold(attempt.fact);
      setScaffold(hint);
      setIsLoading(false);
    };

    fetchScaffold();
  }, [attempt.fact]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
            <div className="bg-red-100 dark:bg-red-500/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div>
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Not Quite</h2>
                <p className="text-slate-600 dark:text-slate-300">The correct answer is <span className="font-bold text-brand-secondary">{attempt.correctAnswer}</span>.</p>
            </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg my-6">
            <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">Let's try another way:</h3>
            {isLoading ? (
                 <div className="h-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                 </div>
            ) : (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{scaffold}</p>
            )}
        </div>

        <button
          onClick={onClose}
          className="w-full text-lg font-bold bg-brand-primary hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
   
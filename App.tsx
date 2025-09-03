
import React, { useState, useMemo } from 'react';
import { AppState, SessionConfig, PerformanceData, FactPerformance, SessionAttempt } from './types';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionAttempt[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData>(() => {
    try {
        const savedData = localStorage.getItem('timesTablePerformance');
        return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
        console.error("Could not load performance data:", error);
        return {};
    }
  });

  const startQuiz = (config: SessionConfig) => {
    setSessionConfig(config);
    setSessionHistory([]);
    setAppState(AppState.QUIZ);
  };

  const finishQuiz = (history: SessionAttempt[]) => {
    setSessionHistory(history);
    updatePerformanceData(history);
    setAppState(AppState.RESULTS);
  };

  const updatePerformanceData = (history: SessionAttempt[]) => {
      const newPerformanceData: PerformanceData = JSON.parse(JSON.stringify(performanceData));
      const LEARNING_RATE = 0.2; // alpha from the adaptive difficulty spec

      history.forEach(attempt => {
          const key = [attempt.fact.a, attempt.fact.b].sort().join('x');
          
          // Initialize performance data for a new fact
          if (!newPerformanceData[key]) {
              // Start with 0 fluency for unseen facts.
              newPerformanceData[key] = { correct: 0, incorrect: 0, totalAttempts: 0, responseTimes: [], fluency: 0 };
          }
          const factPerf = newPerformanceData[key];

          // --- Update basic stats ---
          factPerf.totalAttempts += 1;
          factPerf.responseTimes.push(attempt.timeTaken);
          if (attempt.isCorrect) {
              factPerf.correct += 1;
          } else {
              factPerf.incorrect += 1;
          }
          
          // --- Calculate Performance Score (P) based on the new formula ---
          const accuracy = attempt.isCorrect ? 1 : 0;
          let speedFactor = 0;
          if (attempt.isCorrect) {
            if (attempt.timeTaken < 2000) {
              speedFactor = 1.0;
            } else if (attempt.timeTaken <= 4000) {
              speedFactor = 0.7;
            } else {
              speedFactor = 0.4;
            }
          }
          const performanceScore = accuracy * speedFactor;

          // --- Update Fluency Score (FS) using the new formula ---
          const oldFluency = factPerf.fluency;
          const newFluency = (1 - LEARNING_RATE) * oldFluency + LEARNING_RATE * performanceScore;
          factPerf.fluency = Math.max(0, Math.min(1, newFluency)); // Clamp between 0 and 1
      });
      
      setPerformanceData(newPerformanceData);
      try {
        localStorage.setItem('timesTablePerformance', JSON.stringify(newPerformanceData));
      } catch (error) {
        console.error("Could not save performance data:", error);
      }
  };


  const restart = () => {
    setSessionConfig(null);
    setAppState(AppState.SETUP);
  };

  const Header = () => (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
            <svg className="w-10 h-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white ml-3">Times Table Fluency</h1>
        </div>
      </div>
    </header>
  );

  const MainContent = () => {
    switch (appState) {
      case AppState.QUIZ:
        return sessionConfig && <QuizScreen config={sessionConfig} onFinish={finishQuiz} performanceData={performanceData} />;
      case AppState.RESULTS:
        return <ResultsScreen history={sessionHistory} onRestart={restart} onPracticeAgain={() => startQuiz(sessionConfig!)} />;
      case AppState.SETUP:
      default:
        return (
          <>
            <Dashboard performanceData={performanceData} />
            <SetupScreen onStart={startQuiz} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-slate-200">
      <Header />
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <MainContent />
      </main>
    </div>
  );
};

export default App;

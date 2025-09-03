
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SessionConfig, PerformanceData, Fact, SessionAttempt } from '../types';

interface QuizScreenProps {
  config: SessionConfig;
  performanceData: PerformanceData;
  onFinish: (history: SessionAttempt[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ config, performanceData, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Fact | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [history, setHistory] = useState<SessionAttempt[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [correctAnswerForDisplay, setCorrectAnswerForDisplay] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFactKey = useCallback((fact: Fact) => {
    return [fact.a, fact.b].sort().join('x');
  }, []);

  const selectNextQuestion = useCallback(() => {
    const allPossibleFacts: Fact[] = [];
    config.selectedTables.forEach(a => {
      for (let b = 2; b <= 9; b++) {
        allPossibleFacts.push({ a, b });
      }
    });

    if (allPossibleFacts.length === 0) {
      config.selectedTables.forEach(a => {
        allPossibleFacts.push({ a, b: 5 });
      });
    }

    const weightedFacts = allPossibleFacts.map(fact => {
      const key = getFactKey(fact);
      const perf = performanceData[key];
      
      const fluency = perf ? perf.fluency : 0;

      // Weight is inversely related to fluency. Weaker facts get a much higher weight.
      // The exponent makes the selection more aggressively target weak spots.
      // A small base weight ensures even mastered facts have a chance to appear.
      const weight = Math.pow(1 - fluency, 2) * 100 + 1;

      return { fact, weight: weight + Math.random() }; // Add randomness to break ties
    });

    const totalWeight = weightedFacts.reduce((sum, f) => sum + f.weight, 0);
    let random = Math.random() * totalWeight;

    for (const { fact, weight } of weightedFacts) {
      random -= weight;
      if (random <= 0) {
        return fact;
      }
    }

    return allPossibleFacts[Math.floor(Math.random() * allPossibleFacts.length)];
  }, [config.selectedTables, performanceData, getFactKey]);

  const next = useCallback(() => {
    if (history.length >= config.sessionLength) {
      onFinish(history);
      return;
    }
    setIsCorrecting(false);
    setCorrectAnswerForDisplay(null);
    setIsWrong(false);
    setUserAnswer('');
    setIsProcessing(false);
    const question = selectNextQuestion();
    setCurrentQuestion(question);
    setQuestionStartTime(Date.now());
    inputRef.current?.focus();
  }, [history, config.sessionLength, onFinish, selectNextQuestion]);

  useEffect(() => {
    next();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFirstAttempt = useCallback((answer: string) => {
    if (isProcessing || !currentQuestion || answer.trim() === '') return;
    setIsProcessing(true);

    const answerNum = parseInt(answer, 10);
    const correctAnswer = currentQuestion.a * currentQuestion.b;
    const isCorrect = answerNum === correctAnswer;
    const timeTaken = Date.now() - questionStartTime;
    
    const attempt: SessionAttempt = {
      fact: currentQuestion,
      userAnswer: answerNum,
      correctAnswer,
      isCorrect,
      timeTaken
    };

    setHistory(prev => [...prev, attempt]);

    if (isCorrect) {
      setTimeout(next, 300);
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500); // Reset for next shake
      setIsCorrecting(true);
      setCorrectAnswerForDisplay(correctAnswer);
      setUserAnswer('');
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  }, [currentQuestion, isProcessing, next, questionStartTime]);
  
  useEffect(() => {
    if (!currentQuestion) return;

    if (isCorrecting) {
      if (correctAnswerForDisplay !== null && parseInt(userAnswer, 10) === correctAnswerForDisplay) {
         const timer = setTimeout(() => next(), 150);
         return () => clearTimeout(timer);
      }
    } else if (userAnswer) {
      const correctAnswerLength = String(currentQuestion.a * currentQuestion.b).length;
      if (userAnswer.length >= correctAnswerLength) {
        const timer = setTimeout(() => {
          handleFirstAttempt(userAnswer);
        }, 150); 
        return () => clearTimeout(timer);
      }
    }
  }, [userAnswer, currentQuestion, isCorrecting, correctAnswerForDisplay, handleFirstAttempt, next]);
  
  const progress = (history.length / config.sessionLength) * 100;

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-slate-700 dark:text-white">Progress</span>
                <span className="text-sm font-medium text-slate-700 dark:text-white">{history.length} / {config.sessionLength}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                <div className="bg-brand-secondary h-2.5 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
            </div>
        </div>

        <div className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl transition-all duration-300 ${isWrong ? 'animate-shake' : ''} ring-4 ${isCorrecting ? 'ring-amber-500' : 'ring-transparent'}`}>
          <div className="text-center">
            <p className="text-6xl md:text-8xl font-bold text-slate-800 dark:text-white tracking-wider">
              {currentQuestion.a} &times; {currentQuestion.b}
            </p>
          </div>
          <div className="mt-8">
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={e => !isProcessing && setUserAnswer(e.target.value)}
              autoFocus
              className="w-full text-4xl text-center font-bold p-4 border-4 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-primary/50 focus:border-brand-primary transition"
              placeholder="?"
              aria-label="Answer"
            />
            {isCorrecting ? (
              <p className="text-center text-lg text-amber-600 dark:text-amber-400 mt-4 animate-fade-in" role="alert">
                Correct: <span className="font-bold">{currentQuestion.a} &times; {currentQuestion.b} = {correctAnswerForDisplay}</span>. Type it to continue.
              </p>
            ) : (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">Your answer will be submitted automatically.</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default QuizScreen;

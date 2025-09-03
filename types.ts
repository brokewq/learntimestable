
export enum AppState {
  SETUP,
  QUIZ,
  RESULTS,
}

export interface Fact {
  a: number;
  b: number;
}

export interface SessionConfig {
  selectedTables: number[];
  sessionLength: number;
}

export interface FactPerformance {
  correct: number;
  incorrect: number;
  totalAttempts: number;
  responseTimes: number[];
  fluency: number;
}

export type PerformanceData = Record<string, FactPerformance>;

export interface SessionAttempt {
  fact: Fact;
  userAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}
   
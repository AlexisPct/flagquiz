export interface Country {
  name: string;
  capital: string;
  flagUrl: string;
  codeAlpha2: string;
  continent: string;
  currency: string;
}

export type QuizType = 'capital' | 'flag' | 'shape';
export type DifficultyMode = 'standard' | 'expert';

export interface QuizConfig {
  type: QuizType;
  count: number;
  hasTimer: boolean;
  difficulty: DifficultyMode;
}

export interface QuizConfigType {
  type: QuizType;
  count: number;
  hasTimer: boolean;
  difficulty: DifficultyMode;
}

export interface ServerQuestion {
  isOver: false;
  currentIndex: number;
  totalQuestions: number;
  type: QuizType;
  countryName?: string;     
  questionVisual?: string;
  options: string[];
}

export interface GameOverState {
  isOver: true;
  score: number;
}

export interface SubmitResponse {
  isCorrect: boolean;
  correctAnswer: string;
  score: number;
  isOver: boolean;
}
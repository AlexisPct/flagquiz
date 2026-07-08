export interface Country {
  name: string;
  capital: string;
  flagUrl: string;
  codeAlpha2: string; 
  region: string;
}

export type QuizType = 'capital' | 'flag' | 'shape';

export interface QuizQuestion {
  countryName: string;
  countryCode: string;
  options: string[];
  correctAnswer: string;
  visualHint: any;
}

export interface QuizSession {
  id: string;
  type: QuizType;
  hasTimer: boolean;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  createdAt: number;
}

export interface CreateQuizInput {
  type: QuizType;
  count?: number;
  hasTimer?: boolean;
}
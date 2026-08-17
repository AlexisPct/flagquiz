import mongoose, { Document } from "mongoose";

export interface Country {
  name: string;
  capital: string;
  flagUrl: string;
  codeAlpha2: string;
  codeCCN3: string;
  region: string;
  population: number;
  area: number;
}

export type QuizType = "capital" | "flag" | "shape";

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

export interface IUser extends Document {
  deviceToken: string;
  username: string;
  stats: {
    gamesPlayed: number;
    totalCorrect: number;
    totalQuestions: number;
    bestScore: number;
    bestStreak: number;
  };
  createdAt: Date;
  lastActiveAt: Date;
}

export interface IAnswer {
  countryCode: string;
  countryName: string;
  userAnswer?: string;
  isCorrect: boolean;
}

export interface IGame extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  mode: QuizType;
  score: number;
  maxStreak: number;
  answers: IAnswer[];
  createdAt: Date;
}

import { getCountries } from './country.service';
import { QuizSession, QuizType, QuizQuestion } from '../types';
import crypto from 'crypto';

const sessions = new Map<string, QuizSession>();

export const generateQuizSession = async (
  type: QuizType, 
  count: number = 10, 
  hasTimer: boolean = false
): Promise<QuizSession> => {
  const allCountries = await getCountries();
  
  const validCountries = allCountries.filter(c => {
    if (type === 'capital') return c.name && c.capital;
    if (type === 'flag') return c.name && c.codeAlpha2;
    if (type === 'shape') return c.name && c.codeAlpha2;
    return false;
  });

  const shuffled = [...validCountries].sort(() => 0.5 - Math.random());
  const selectedCountries = shuffled.slice(0, Math.min(count, shuffled.length));

  const questions: QuizQuestion[] = selectedCountries.map((country) => {
    const pool = validCountries.filter(c => c.codeAlpha2 !== country.codeAlpha2);
    const distractors = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    

    const correctAnswer = type === 'capital' ? country.capital : country.name;

    const options = [
      correctAnswer, 
      ...distractors.map(c => type === 'capital' ? c.capital : c.name)
    ].sort(() => 0.5 - Math.random());

    let visualHint = '';
    if (type === 'flag') {
      visualHint = country.flagUrl;
    } else if (type === 'shape') {
      visualHint = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${country.codeAlpha2.toLowerCase()}/128.png`;
    }

    return {
      countryName: country.name,
      countryCode: country.codeAlpha2,
      options,
      correctAnswer,
      visualHint: visualHint || undefined
    };
  });

  const sessionId = crypto.randomUUID();
  const sessionData: QuizSession = {
    id: sessionId,
    type,
    hasTimer,
    questions,
    currentIndex: 0,
    score: 0,
    createdAt: Date.now()
  };

  sessions.set(sessionId, sessionData);
  return sessionData;
};

export const getSession = (id: string): QuizSession | undefined => {
  return sessions.get(id);
};

interface VerificationResult {
  isCorrect: boolean;
  correctAnswer: string;
  score: number;
  isOver: boolean;
}

export const checkAnswer = (session: QuizSession, answer: string): VerificationResult => {
  const currentQuestion = session.questions[session.currentIndex];
  const isCorrect = currentQuestion.correctAnswer.toLowerCase() === answer.trim().toLowerCase();

  if (isCorrect) {
    session.score += 1;
  }
  
  session.currentIndex += 1;

  return {
    isCorrect,
    correctAnswer: currentQuestion.correctAnswer,
    score: session.score,
    isOver: session.currentIndex >= session.questions.length
  };
};
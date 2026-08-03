import { Game } from '../models/Game';
import { IAnswer, IGame, IUser, QuizType } from '../types';
import * as userService from './user.service';

interface CreateGameInput {
  user: IUser;
  mode: QuizType;
  score: number;
  maxStreak: number;
  answers: IAnswer[];
}

export const saveGameResult = async (input: CreateGameInput): Promise<IGame> => {
  const { user, mode, score, maxStreak, answers } = input;

  const game = await Game.create({
    userId: user._id,
    username: user.username,
    mode,
    score,
    maxStreak,
    answers,
  });

  const correctCount = answers ? answers.filter((a) => a.isCorrect).length : 0;
  const totalQuestionsCount = answers ? answers.length : 0;

  await userService.updateUserStats(
    user,
    score,
    maxStreak,
    correctCount,
    totalQuestionsCount
  );

  return game;
};

export const getLeaderboardByMode = async (mode: QuizType, limit: number = 10): Promise<IGame[]> => {
  return await Game.find({ mode: mode as any })
    .sort({ score: -1, createdAt: 1 })
    .limit(limit)
    .select('username score maxStreak createdAt');
};
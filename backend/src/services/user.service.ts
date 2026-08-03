import { User } from '../models/User';
import { IUser } from '../types';

export const findOrCreateUser = async (deviceToken: string, username: string): Promise<IUser> => {
  let user = await User.findOne({ deviceToken });

  if (!user) {
    user = await User.create({ deviceToken, username });
  } else if (user.username !== username) {
    user.username = username;
    user.lastActiveAt = new Date();
    await user.save();
  }

  return user;
};

export const getUserByDeviceToken = async (deviceToken: string): Promise<IUser | null> => {
  return await User.findOne({ deviceToken });
};

export const updateUserStats = async (
  user: IUser,
  score: number,
  maxStreak: number,
  correctCount: number,
  totalQuestionsCount: number
): Promise<IUser> => {
  user.stats.gamesPlayed += 1;
  user.stats.totalCorrect += correctCount;
  user.stats.totalQuestions += totalQuestionsCount;

  if (score > user.stats.bestScore) {
    user.stats.bestScore = score;
  }
  if (maxStreak > user.stats.bestStreak) {
    user.stats.bestStreak = maxStreak;
  }

  user.lastActiveAt = new Date();
  return await user.save();
};

export const getAllUsers = async (limit: number = 20): Promise<IUser[]> => {
  return await User.find()
    .sort({ 'stats.bestScore': -1 })
    .limit(limit)
    .select('username deviceToken stats createdAt lastActiveAt');
};
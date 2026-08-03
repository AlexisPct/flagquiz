import { Request, Response } from 'express';
import * as gameService from '../services/game.service';
import * as userService from '../services/user.service';
import { QuizType } from '../types';

export const saveGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceToken, username, mode, score, maxStreak, answers } = req.body;

    if (!deviceToken || !username || score === undefined) {
      res.status(400).json({ error: 'deviceToken, username et score sont requis' });
      return;
    }

    const user = await userService.findOrCreateUser(deviceToken, username);

    const game = await gameService.saveGameResult({
      user,
      mode: (mode as QuizType) || 'flags',
      score: Number(score),
      maxStreak: Number(maxStreak || 0),
      answers: answers || [],
    });

    res.status(201).json({
      success: true,
      gameId: game._id,
      userStats: user.stats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawMode = (req.query.mode as string) || 'flags';
    const limit = parseInt(req.query.limit as string) || 10;

    const topGames = await gameService.getLeaderboardByMode(rawMode as QuizType, limit);
    res.json(topGames);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
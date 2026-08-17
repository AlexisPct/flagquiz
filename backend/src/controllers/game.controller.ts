import { Request, Response } from "express";
import * as gameService from "../services/game.service";
import * as userService from "../services/user.service";
import { QuizType } from "../types";

export const saveGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceToken, username, mode, score, maxStreak, answers } = req.body;

    if (!deviceToken || !username || score === undefined) {
      res
        .status(400)
        .json({ error: "deviceToken, username et score sont requis" });
      return;
    }

    const user = await userService.findOrCreateUser(deviceToken, username);

    const game = await gameService.saveGameResult({
      user,
      mode: (mode as QuizType) || "flags",
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

export const getLeaderboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const mode = (req.query.mode as QuizType) || "flag";
    const limit = parseInt(req.query.limit as string) || 10;

    const leaderboard = await gameService.getLeaderboardByMode(
      mode as QuizType,
      limit,
    );
    res.json(leaderboard);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Erreur lors de la récupération du classement",
      leaderboard: [],
    });
  }
};

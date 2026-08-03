import express from 'express';
import { saveGame, getLeaderboard } from '../controllers/game.controller';

const router = express.Router();

router.post('/save-game', saveGame);
router.get('/leaderboard', getLeaderboard);

export default router;
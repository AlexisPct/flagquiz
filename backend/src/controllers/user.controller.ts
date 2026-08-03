import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const registerOrUpdateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceToken, username } = req.body;

    if (!deviceToken || !username) {
      res.status(400).json({ error: 'deviceToken et username sont requis' });
      return;
    }

    const user = await userService.findOrCreateUser(deviceToken, username);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceToken = req.params.deviceToken as string;

    if (!deviceToken) {
      res.status(400).json({ error: 'deviceToken manquant' });
      return;
    }

    const user = await userService.getUserByDeviceToken(deviceToken);

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const users = await userService.getAllUsers(limit);
    
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
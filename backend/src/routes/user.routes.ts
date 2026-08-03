import express from 'express';
import { registerOrUpdateUser, getUserProfile, getUsers } from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUsers);
router.post('/register', registerOrUpdateUser);
router.get('/:deviceToken', getUserProfile);

export default router;
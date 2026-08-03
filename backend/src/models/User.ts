import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  deviceToken: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, trim: true, maxlength: 20 },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
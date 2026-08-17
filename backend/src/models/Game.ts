import mongoose, { Schema } from "mongoose";
import { IAnswer, IGame } from "../types";

const AnswerSchema = new Schema<IAnswer>({
  countryCode: { type: String, required: true },
  countryName: { type: String, required: true },
  userAnswer: { type: String },
  isCorrect: { type: Boolean, required: true },
});

const GameSchema = new Schema<IGame>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  username: { type: String, required: true },
  mode: { type: String, required: true },
  score: { type: Number, required: true },
  maxStreak: { type: Number, default: 0 },
  answers: [AnswerSchema],
  createdAt: { type: Date, default: Date.now },
});

GameSchema.index({ mode: 1, score: -1, createdAt: 1 });

export const Game = mongoose.model<IGame>("Game", GameSchema);

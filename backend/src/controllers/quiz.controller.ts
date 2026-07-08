import { RequestHandler } from 'express';
import * as quizService from '../services/quiz.service';
import { CreateQuizInput } from '../types';

export const createSession: RequestHandler = async (req, res, next) => {
  try {
    const { type, hasTimer } = req.body as CreateQuizInput;

    const count = parseInt(req.body.count, 10) || 10;

    if (!type || !['capital', 'flag', 'shape'].includes(type)) {
      res.status(400).json({ message: "Le type de quiz doit être 'capital', 'flag' ou 'shape'." });
      return;
    }

    const session = await quizService.generateQuizSession(type, count, hasTimer);

    res.status(201).json({
      sessionId: session.id,
      totalQuestions: session.questions.length,
      hasTimer: session.hasTimer
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentQuestion: RequestHandler = (req, res, next) => {
  try {
    const id = req.params.id as string;
    const session = quizService.getSession(id);
    if (!session) {
      res.status(404).json({ message: "Session de quiz introuvable." });
      return;
    }

    if (session.currentIndex >= session.questions.length) {
      res.status(200).json({ isOver: true, score: session.score });
      return;
    }

    const question = session.questions[session.currentIndex] as any;

    res.status(200).json({
      isOver: false,
      currentIndex: session.currentIndex,
      totalQuestions: session.questions.length,
      type: session.type,
      countryName: session.type === 'capital' ? question.countryName : undefined,
      questionVisual: session.type !== 'capital' ? question.visualHint : undefined, 
      options: question.options
    });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer: RequestHandler = (req, res, next) => {
  try {
    const { answer } = req.body as { answer: string };
    const id = req.params.id as string;
    const session = quizService.getSession(id);

    if (!session) {
      res.status(404).json({ message: "Session de quiz introuvable." });
      return;
    }

    if (session.currentIndex >= session.questions.length) {
      res.status(400).json({ message: "Le quiz est déjà terminé." });
      return;
    }

    const result = quizService.checkAnswer(session, answer);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
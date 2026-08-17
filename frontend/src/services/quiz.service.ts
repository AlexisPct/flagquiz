import type { Country, QuizType, SubmitResponse } from "../types";
import {
  getOrCreateDeviceToken,
  getStoredUsername,
} from "../utils/userSession";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface QuizConfigPayload {
  type: string;
  count: number;
  difficulty: "standard" | "expert";
}

export interface QuizSessionResponse {
  sessionId: string;
  questions: any[];
}

export interface AnswerPayload {
  countryCode: string;
  countryName: string;
  userAnswer?: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface SaveGamePayload {
  mode: QuizType;
  score: number;
  maxStreak: number;
  answers: AnswerPayload[];
  customUsername?: string;
}

export interface SaveGameResponse {
  success: boolean;
  gameId: string;
  userStats: {
    gamesPlayed: number;
    totalCorrect: number;
    totalQuestions: number;
    bestScore: number;
    bestStreak: number;
  };
}

export interface LeaderboardResponse {
  _id: string;
  username: string;
  score: number;
  maxStreak: number;
  mode: string;
  createdAt: string;
}

export const quizService = {
  /**
   * Initialise une nouvelle session de quiz auprès du backend Node.js
   */
  async startSession(config: QuizConfigPayload): Promise<QuizSessionResponse> {
    const response = await fetch(`${API_URL}/api/quiz/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    if (!response.ok)
      throw new Error(`Erreur startSession: ${response.status}`);
    return response.json();
  },

  async fetchNextQuestion(sessionId: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/quiz/session/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Impossible de récupérer la question suivante (Status: ${response.status})`,
      );
    }

    return response.json();
  },

  /**
   * Soumet une réponse au backend pour validation
   */
  async submitAnswer(
    sessionId: string,
    answer: string,
  ): Promise<SubmitResponse> {
    const response = await fetch(
      `${API_URL}/api/quiz/session/${sessionId}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      },
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la soumission de la réponse");
    }

    return response.json();
  },

  async saveGame(payload: SaveGamePayload): Promise<SaveGameResponse> {
    const deviceToken = getOrCreateDeviceToken();
    const username = payload.customUsername || getStoredUsername();

    const response = await fetch(`${API_URL}/api/games/save-game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceToken,
        username,
        mode: payload.mode,
        score: payload.score,
        maxStreak: payload.maxStreak,
        answers: payload.answers,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || "Erreur lors de la sauvegarde de la partie.",
      );
    }

    return response.json();
  },

  async fetchLeaderboard(
    mode: QuizType,
    limit: number,
  ): Promise<LeaderboardResponse[]> {
    const response = await fetch(
      `${API_URL}/api/games/leaderboard?mode=${mode}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Impossible de récupérer le classement.");
    }

    const data = await response.json();
    return Array.isArray(data.leaderboard)
      ? data.leaderboard
      : Array.isArray(data)
        ? data
        : [];
  },

  /**
   * Récupère la liste de tous les pays
   */
  async getCountries(): Promise<Country[]> {
    const res = await fetch(`${API_URL}/api/quiz/countries`);

    if (!res.ok) {
      throw new Error(
        `Impossible de récupérer la liste des pays (Status: ${res.status})`,
      );
    }

    return res.json();
  },

  /**
   * Récupère la liste complète des noms de pays triés pour l'autocomplétion
   */
  async getCountriesForAutocomplete(): Promise<string[]> {
    const response = await fetch(`${API_URL}/api/quiz/countries/names`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok)
      throw new Error(`Erreur getCountries: ${response.status}`);
    return response.json();
  },

  /**
   * Récupère la liste complète des capitales triées pour l'autocomplétion
   */
  async getCapitalsForAutocomplete(): Promise<string[]> {
    const response = await fetch(`${API_URL}/api/quiz/capitals`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Erreur getCapitals: ${response.status}`);
    return response.json();
  },
};

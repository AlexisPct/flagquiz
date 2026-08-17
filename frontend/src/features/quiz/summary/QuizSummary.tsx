import React, { useState } from "react";
import "./QuizSummary.css";
import { quizService } from "../../../services/quiz.service";
import type {
  AnswerPayload,
  SaveGameResponse,
} from "../../../services/quiz.service";
import {
  getStoredUsername,
  setStoredUsername,
} from "../../../utils/userSession";
import type { QuizType } from "../../../types";

interface QuizSummaryProps {
  score: number;
  mode: QuizType;
  answers: AnswerPayload[];
  totalQuestions: number;
  onRestart: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  score,
  mode,
  answers,
  totalQuestions,
  onRestart,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getFeedbackMessage = () => {
    if (percentage === 100)
      return "Parfait ! Tu as une vue satellite de la Terre. 🌍";
    if (percentage >= 75)
      return "Excellent niveau ! L'Atlas n'a presque plus de secrets pour toi. ✨";
    if (percentage >= 50)
      return "Pas mal ! Encore un peu d'entraînement pour maîtriser les frontières.";
    return "L'exploration ne fait que commencer ! Réessaye pour t'améliorer. 🧭";
  };

  const [username, setUsername] = useState(getStoredUsername());
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveGameResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      setStoredUsername(username);

      let currentStreak = 0;
      let maxStreak = 0;

      answers.forEach((a) => {
        if (a.isCorrect) {
          currentStreak++;
          if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      });

      console.log(answers);

      const data = await quizService.saveGame({
        mode,
        score,
        maxStreak,
        answers,
        customUsername: username,
      });

      setSaveResult(data);
    } catch (err: any) {
      setError(err.message || "Impossible de sauvegarder le score.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="quiz-summary-view" style={{ textAlign: "center" }}>
      <h2 className="quiz-title">Session Terminée</h2>
      <p className="quiz-subtitle">Découvre tes performances d'exploration</p>

      <div className="score-radial-effect">
        <span className="score-number">{score}</span>
        <span className="score-total">/ {totalQuestions}</span>
      </div>

      <p className="score-feedback">{getFeedbackMessage()}</p>

      <div className="score-progress-bar-container">
        <div
          className="score-progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {!saveResult ? (
        <form onSubmit={handleSave} className="save-score-form">
          <div className="form-group">
            <label htmlFor="username-input" className="form-label">
              Ton pseudo pour le classement
            </label>
            <input
              id="username-input"
              type="text"
              className="form-input"
              placeholder="Ex: GeoMaster"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={isSaving}>
            {isSaving ? (
              <span className="btn-loading">
                <span className="spinner" /> Sauvegarde...
              </span>
            ) : (
              "Enregistrer mon score"
            )}
          </button>
        </form>
      ) : (
        <div className="save-success-card">
          <div className="success-badge">
            <span className="success-icon">✅</span>
            <p className="success-title">Score enregistré !</p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Parties jouées</span>
              <span className="stat-value">
                {saveResult.userStats.gamesPlayed}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Meilleur score</span>
              <span className="stat-value highlight">
                {saveResult.userStats.bestScore} pts
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="quiz-btn-primary"
        style={{ marginTop: "32px" }}
      >
        Nouvelle Partie
      </button>
    </div>
  );
};

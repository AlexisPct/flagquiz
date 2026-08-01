import React from 'react';
import './QuizSummary.css';

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  score,
  totalQuestions,
  onRestart
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getFeedbackMessage = () => {
    if (percentage === 100) return "Parfait ! Tu as une vue satellite de la Terre. 🌍";
    if (percentage >= 75) return "Excellent niveau ! L'Atlas n'a presque plus de secrets pour toi. ✨";
    if (percentage >= 50) return "Pas mal ! Encore un peu d'entraînement pour maîtriser les frontières.";
    return "L'exploration ne fait que commencer ! Réessaye pour t'améliorer. 🧭";
  };

  return (
    <div className="quiz-summary-view" style={{ textAlign: 'center' }}>
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

      <button onClick={onRestart} className="quiz-btn-primary" style={{ marginTop: '32px' }}>
        Nouvelle Partie
      </button>
    </div>
  );
};
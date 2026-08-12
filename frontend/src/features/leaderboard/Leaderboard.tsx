import React, { useState, useEffect } from 'react';
import { type LeaderboardResponse } from '../../services/quiz.service';
import { quizService } from '../../services/quiz.service';
import './Leaderboard.css';
import type { QuizType } from '../../types';

interface LeaderboardProps {
  onClose?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const [activeMode, setActiveMode] = useState<QuizType>('capital');
  const [scores, setScores] = useState<LeaderboardResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    quizService.fetchLeaderboard(activeMode, 10)
      .then((data) => {
        if (isMounted) {
          setScores(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeMode]);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  return (
    <div className="leaderboard-card">
      <div className="leaderboard-header">
        <h2>🏆 Classement des Joueurs</h2>
        {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
      </div>

      <div className="leaderboard-tabs">
        <button
          className={activeMode === 'capital' ? 'tab active' : 'tab'}
          onClick={() => setActiveMode('capital')}
        >
          🏙️ Capitales
        </button>
        <button
          className={activeMode === 'flag' ? 'tab active' : 'tab'}
          onClick={() => setActiveMode('flag')}
        >
          🚩 Drapeaux
        </button>
        <button
          className={activeMode === 'shape' ? 'tab active' : 'tab'}
          onClick={() => setActiveMode('shape')}
        >
          ⚡ Silhouette
        </button>
      </div>

      {/* Liste des résultats */}
      <div className="leaderboard-body">
        {loading && <p className="status-text">Chargement des scores...</p>}
        {error && <p className="status-text error">{error}</p>}

        {!loading && !error && scores.length === 0 && (
          <p className="status-text">Aucun score enregistré pour ce mode.</p>
        )}

        {!loading && !error && scores.length > 0 && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Joueur</th>
                <th>Score</th>
                <th>Streak Max</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, index) => (
                <tr key={entry._id} className={index < 3 ? `top-rank rank-${index + 1}` : ''}>
                  <td className="rank-cell">{getRankBadge(index)}</td>
                  <td className="username-cell">{entry.username}</td>
                  <td className="score-cell">{entry.score} pts</td>
                  <td className="streak-cell">🔥 {entry.maxStreak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
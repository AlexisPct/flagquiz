import React from 'react';

type DifficultyMode = 'standard' | 'expert';

interface QuizConfigProps {
  config: { type: string; count: number; difficulty: DifficultyMode };
  onConfigChange: (newConfig: any) => void;
  onStartQuiz: () => void;
}

export const QuizConfig: React.FC<QuizConfigProps> = ({
  config,
  onConfigChange,
  onStartQuiz
}) => {
  return (
    <div className="quiz-config-view">
      <h2 className="quiz-title">World Quiz</h2>
      <p className="quiz-subtitle">Configure ton défi géographique</p>
      
      <div className="quiz-form-group">
        <label>TYPE DE JEU</label>
        <select 
          value={config.type} 
          onChange={(e) => onConfigChange({ ...config, type: e.target.value })}
          className="quiz-select"
        >
          <option value="capital">Trouver la Capitale</option>
          <option value="flag">Deviner le Drapeau</option>
          <option value="shape">Identifier la Silhouette</option>
        </select>
      </div>

      <div className="quiz-form-group">
        <label>DIFFICULTÉ</label>
        <div className="difficulty-segmented-control">
          <button 
            type="button"
            className={`difficulty-btn ${config.difficulty === 'standard' ? 'active' : ''}`}
            onClick={() => onConfigChange({ ...config, difficulty: 'standard' })}
          >
            Standard (QCM)
          </button>
          <button 
            type="button"
            className={`difficulty-btn ${config.difficulty === 'expert' ? 'active' : ''}`}
            onClick={() => onConfigChange({ ...config, difficulty: 'expert' })}
          >
            Expert (Saisie)
          </button>
        </div>
      </div>

      <div className="quiz-form-group">
        <label>NOMBRE DE QUESTIONS</label>
        <input 
          type="number" 
          min="5" 
          max="30" 
          value={config.count} 
          onChange={(e) => onConfigChange({ ...config, count: parseInt(e.target.value, 10) || 10 })}
          className="quiz-input"
        />
      </div>

      <button onClick={onStartQuiz} className="quiz-btn-primary" style={{ marginTop: '24px' }}>
        Démarrer le Quiz
      </button>
    </div>
  );
};
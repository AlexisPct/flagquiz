import React from 'react';

interface QuizVisualProps {
  type: string;
  visualUrl: string | null;
}

export const QuizVisual: React.FC<QuizVisualProps> = ({ type, visualUrl }) => {
  if (!visualUrl) return null;

  return (
    <div className="quiz-visual-box">
      {type === 'shape' ? (
        <div 
          className="quiz-shape-mask" 
          style={{ '--shape-url': `url(${visualUrl})` } as React.CSSProperties}
        />
      ) : (
        <img 
          src={visualUrl} 
          alt="Indice visuel du quiz" 
          className="quiz-normal-img"
        />
      )}
    </div>
  );
};
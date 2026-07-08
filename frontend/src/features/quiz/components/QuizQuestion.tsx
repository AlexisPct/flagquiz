import React from 'react';
import { QuizVisual } from './QuizVisual';
import type { ServerQuestion } from '../../../types';

interface QuizQuestionProps {
  question: ServerQuestion;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question
}) => {

  const renderQuestionTitle = () => {
    switch (question.type) {
      case 'capital':
        return (
          <>
            Quelle est la capitale de ce pays : 
            <span className="quiz-highlight-target"> {question.countryName}</span> ?
          </>
        );
      case 'shape':
        return "À quel pays appartient cette silhouette ?";
      case 'flag':
        return "À quel pays appartient ce drapeau ?";
      default:
        return "Devine la bonne réponse !";
    }
  };

  return (
    <div className="quiz-question-card">
      <div className="quiz-question-header">
        <span className="quiz-badge">Question {question.currentIndex} / {question.totalQuestions}</span>
      </div>

      <h2 className="quiz-question-title">
        {renderQuestionTitle()}
      </h2>

      <div className="quiz-visual-wrapper">
        <QuizVisual 
          type={question.type}
          visualUrl={question.questionVisual || null}
        />
      </div>
    </div>
  );
};
import React from 'react';
import type { ServerQuestion } from '../../../types';
import { SimpleGlobe } from '../../globe/SimpleGlobe';
import './QuizQuestion.css';

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
      <div className="quiz-question-title">
        <span className="quiz-question-badge">{question.currentIndex + 1} / {question.totalQuestions}</span>
        <h3>{renderQuestionTitle()}</h3>
      </div>

      <div className="quiz-visual-wrapper">
        {/* <QuizVisual
          type={question.type}
          visualUrl={question.questionVisual || null}
        /> */}

        {question.type === 'flag' && (
          <div className="flag-image-container">
            <img
              src={question.questionVisual}
              alt={'Drapeau'}
              className="country-flag-large"
              loading="lazy"
            />
          </div>

        )}

        {question.type === 'shape' && (
          <div className="quiz-question-globe">
            <SimpleGlobe selectedCountryId={question.countryCodeCCN3} enableClick={false} enableDrag={false} enableZoom={false} />
          </div>
        )}
      </div>
    </div>
  );
};
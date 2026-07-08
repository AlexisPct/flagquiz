import React from 'react';

interface QuizAnswersQCMProps {
  options: string[];
  selectedAnswer: string | null;
  feedback: any;
  isSubmitting: boolean;
  onAnswerSubmit: (answer: string) => void;
}

export const QuizAnswersQCM: React.FC<QuizAnswersQCMProps> = ({
  options,
  selectedAnswer,
  feedback,
  isSubmitting,
  onAnswerSubmit
}) => {
  return (
    <div className="quiz-grid">
      {options.map((option, idx) => {
        let btnClass = "quiz-btn-option";
        if (feedback) {
          if (option === feedback.correctAnswer) btnClass += " correct";
          else if (option === selectedAnswer && !feedback.isCorrect) btnClass += " wrong";
        }
        return (
          <button
            key={idx}
            disabled={!!feedback || isSubmitting}
            onClick={() => onAnswerSubmit(option)}
            className={btnClass}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
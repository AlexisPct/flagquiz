import React from 'react';
import './ProgressBar.css';
import type { AnswerPayload } from '../../../services/quiz.service';

interface ProgressBarProps {
    totalQuestions: number;
    currentIndex: number;
    answersHistory: AnswerPayload[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    totalQuestions,
    currentIndex,
    answersHistory,
}) => {
    const steps = Array.from({ length: totalQuestions });

    return (
        <div className="stepper-container">
            {steps.map((_, index) => {
                const hasAnswered = index < answersHistory.length;
                const answer = answersHistory?.[index];
                const isCorrect = answer?.isCorrect;
                const isCurrent = index === currentIndex;

                let statusClass = 'unanswered';
                if (hasAnswered) {
                    statusClass = isCorrect ? 'correct' : 'incorrect';
                }

                return (
                    <div key={index} className="step-wrapper">
                        <div className={`step-circle ${statusClass} ${isCurrent ? 'current' : ''}`}>
                           
                        </div>

                        {index < totalQuestions - 1 && (
                            <div className={`step-line ${hasAnswered ? 'completed' : ''}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
import React, { useState, useEffect } from 'react';

interface QuizAnswersAutocompleteInputProps {
    questionId: number,
    autocompleteList: string[];
    feedback: any;
    isSubmitting: boolean;
    onAnswerSubmit: (answer: string) => void;
}

export const QuizAnswersAutocompleteInput: React.FC<QuizAnswersAutocompleteInputProps> = ({
    questionId,
    autocompleteList,
    feedback,
    isSubmitting,
    onAnswerSubmit
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
    }, [questionId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        if (val.trim().length >= 2) {
            const filtered = autocompleteList
                .filter(c => c.toLowerCase().includes(val.toLowerCase()))
                .slice(0, 6);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (answer: string) => {
        setInputValue(answer);
        setSuggestions([]);
        setShowSuggestions(false);
        onAnswerSubmit(answer);
    };

    return (
        <div className="quiz-input-wrapper">
            <div className="quiz-relative-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue.trim().length >= 2 && setShowSuggestions(true)}
                    disabled={!!feedback || isSubmitting}
                    placeholder="Tape ta réponse..."
                    className={`quiz-autocomplete-input ${feedback ? (feedback.isCorrect ? 'correct' : 'wrong') : ''}`}
                />

                {showSuggestions && suggestions.length > 0 && !feedback && (
                    <ul className="quiz-suggestions-list">
                        {suggestions.map((answer, idx) => (
                            <li key={idx} onClick={() => selectSuggestion(answer)} className="quiz-suggestion-item">
                                {answer}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {feedback && !feedback.isCorrect && (
                <div className="quiz-correction-alert">
                    La bonne réponse était : <strong>{feedback.correctAnswer}</strong>
                </div>
            )}
        </div>
    );
};
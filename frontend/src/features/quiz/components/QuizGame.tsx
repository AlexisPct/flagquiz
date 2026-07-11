import React, { useState, useEffect } from 'react';
import type { QuizConfigType, ServerQuestion, SubmitResponse } from '../../../types';
import { QuizAnswersQCM } from './QuizAnswersQCM';
import { QuizAnswersAutocompleteInput } from './QuizAnswersAutocompleteInput';
import { QuizConfig } from './QuizConfig';
import { QuizSummary } from './QuizSummary';
import { quizService } from '../../../services/quiz.service';
import { QuizQuestion } from './QuizQuestion';

const API_BASE_URL = 'http://localhost:5000/api/quiz';

export const QuizGame: React.FC = () => {
    const [step, setStep] = useState<'config' | 'playing' | 'summary'>('config');
    const [config, setConfig] = useState<QuizConfigType>({ type: 'capital', count: 10, hasTimer: false, difficulty: 'standard' });
    const [sessionId, setSessionId] = useState<string | null>(null);

    const [currentQuestion, setCurrentQuestion] = useState<ServerQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<SubmitResponse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [timeLeft, setTimeLeft] = useState<number>(15);
    const [finalScore, setFinalScore] = useState<number>(0);

    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [countriesList, setCountriesList] = useState<string[]>([]);
    const [capitalsList, setCapitalsList] = useState<string[]>([]);


    useEffect(() => {
        Promise.all([
            quizService.getCountriesForAutocomplete(),
            quizService.getCapitalsForAutocomplete()
        ])
            .then(([countries, capitals]) => {
                setCountriesList(countries);
                setCapitalsList(capitals);
            })
            .catch(err => console.error("Erreur de chargement des données d'autocomplétion :", err));
    }, []);

    const currentAutocompleteList = config.type === 'capital' ? capitalsList : countriesList;

    useEffect(() => {
        if (step !== 'playing' || !config.hasTimer || feedback) return;

        if (timeLeft === 0) {
            handleTimeOut();
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, step, feedback, config.hasTimer]);

    const startQuiz = async () => {
        try {
            const session = await quizService.startSession(config);
            setSessionId(session.sessionId);
            setStep('playing');
            fetchNextQuestion(session.sessionId);
        } catch (error) {
            console.error("Erreur lors de l'initialisation du quiz:", error);
        }
    };

    const fetchNextQuestion = async (id: string) => {
        try {
            const question = await quizService.fetchNextQuestion(id)

            if (question.isOver) {
                setFinalScore(question.score);
                setStep('summary');
                return;
            }

            setCurrentQuestion(question);
            setSelectedAnswer(null);
            setFeedback(null);
            setTimeLeft(15); 
        } catch (error) {
            console.error("Erreur lors de la récupération de la question:", error);
        }
    };

    const handleAnswerClick = async (answer: string) => {
        if (feedback || !sessionId || isSubmitting) return;

        setSelectedAnswer(answer);
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/session/${sessionId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer }),
            });
            const data: SubmitResponse = await response.json();
            setFeedback(data);
        } catch (error) {
            console.error("Erreur lors de l'envoi de la réponse:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTimeOut = async () => {
        if (!sessionId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/session/${sessionId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer: '' }), // Soumission vide = réponse fausse d'office
            });
            const data: SubmitResponse = await response.json();
            setFeedback(data);
        } catch (error) {
            console.error("Erreur lors de la gestion du timeout:", error);
        }
    };

    const resetGame = () => {
        setSessionId(null);
        setCurrentQuestion(null);
        setFeedback(null);
        setSelectedAnswer(null);
        setStep('config');
    };

    return (
        <>
            <div className="quiz-container">
                {/* ÉCRAN 1 : Configuration initiale */}
                {step === 'config' && (
                    <QuizConfig
                        config={config}
                        onConfigChange={setConfig}
                        onStartQuiz={startQuiz}
                    />
                )}

                {/* ÉCRAN 2 : EN TRAIN DE JOUER */}
                {step === 'playing' && currentQuestion && (
                    <div className="quiz-playing-layout">
                        <QuizQuestion
                            question={currentQuestion}
                        />

                        {config.difficulty === 'standard' ? (
                            <QuizAnswersQCM
                                options={currentQuestion.options}
                                selectedAnswer={selectedAnswer}
                                feedback={feedback}
                                isSubmitting={isSubmitting}
                                onAnswerSubmit={(answer) => {
                                    setSelectedAnswer(answer);
                                    handleAnswerClick(answer);
                                }}
                            />
                        ) : (
                            <QuizAnswersAutocompleteInput
                                questionId={currentQuestion.currentIndex}
                                autocompleteList={currentAutocompleteList}
                                feedback={feedback}
                                isSubmitting={isSubmitting}
                                onAnswerSubmit={(answer) => {
                                    setSelectedAnswer(answer);
                                    handleAnswerClick(answer);
                                }}
                            />
                        )}


                        {feedback && (
                            <div style={{ marginTop: '32px' }}>
                                <button className="quiz-btn-primary" onClick={() => {
                                    setInputValue('');
                                    setSuggestions([]);
                                    fetchNextQuestion(sessionId!)
                                }}>
                                    {feedback.isOver ? 'Découvrir mon score 🏁' : 'Continuer'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/*ÉCRAN 3 : Fin de partie / Résumé*/}
                {step === 'summary' && (
                    <QuizSummary
                        score={finalScore}
                        totalQuestions={config.count}
                        onRestart={resetGame}
                    />
                )}

            </div>
        </>
    );
};
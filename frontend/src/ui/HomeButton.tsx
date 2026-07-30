import React from 'react';
import './HomeButton.css';
import { useNavigate } from 'react-router-dom';

export const HomeButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/')} className="home-btn" title="Retour à l'accueil">
            🏠
        </button>
    );
};
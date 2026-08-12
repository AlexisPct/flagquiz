import React from 'react';
import './LeaderboardButton.css';
import { useNavigate } from 'react-router-dom';

export const LeaderboardButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/leaderboard')} className="leaderboard-btn" title="Leaderboard">
            🎖️
        </button>
    );
};
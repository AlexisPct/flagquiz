import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { SimpleGlobe } from '../globe/SimpleGlobe';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-text">
        <h1 className="home-title">
          Devenez un Maître de l' <span style={{ color: '#3b82f6' }}>Atlas</span>
        </h1>
        <p className="home-subtitle">
          Explorez le monde en 3D, apprenez à reconnaître les silhouettes des pays et battez vos records dans notre jeu de quiz géorapide.
        </p>

        <div className="hero-actions">
          <button
            className="btn-modern btn-primary-modern"
            onClick={() => navigate('/quiz')}
          >
            <span className="btn-icon">🎮</span> Lancer le Quiz
          </button>

          <button
            className="btn-modern btn-secondary-modern"
            onClick={() => navigate('/atlas')}
          >
            <span className="btn-icon">🗺️</span> Explorer l'Atlas
          </button>
        </div>
      </div>

      <div className="home-globe">
        <SimpleGlobe enableClick={false} enableDrag={false} enableZoom={false}/>
      </div>
    </div>
  );
};
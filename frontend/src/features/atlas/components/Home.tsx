import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { SimpleGlobe } from '../../quiz/components/SimpleGlobe';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-text" style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
          Devenez un Maître de l' <span style={{ color: '#3b82f6' }}>Atlas</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
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

      <div className="hero-visual" style={{ flex: 1 }}>
        <SimpleGlobe size={400} isRotating={true} />
      </div>
    </div>
  );
};
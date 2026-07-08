import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="home-hero">
        <h1 className="home-title">Explore le Monde</h1>
        <p className="home-lead">
          Précise tes connaissances géographiques, explore les frontières et relève le défi de l'Atlas.
        </p>
      </section>

      <div className="home-grid">
        
        <div className="home-card" onClick={() => navigate('/quiz')}>
          <div className="home-card-icon">🧭</div>
          <h2 className="home-card-title">Le Quiz</h2>
          <p className="home-card-desc">
            Devine des capitales, reconnais des drapeaux et identifie des pays grâce à leurs silhouettes en mode Standard ou Expert.
          </p>
          <span className="home-card-action">Lancer un défi →</span>
        </div>

        <div className="home-card" onClick={() => navigate('/atlas')}>
          <div className="home-card-icon">📚</div>
          <h2 className="home-card-title">L'Atlas</h2>
          <p className="home-card-desc">
            Parcours les fiches détaillées de tous les pays du monde, leurs statistiques, leurs coordonnées et révise tes repères.
          </p>
          <span className="home-card-action">Explorer la base →</span>
        </div>

      </div>
    </div>
  );
};
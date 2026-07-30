import type { Country } from '../../../types'; 
import './CountryDetailCard.css'; 

interface CountryDetailCardProps {
  country: Country | null;
  onClose: () => void;
}

export default function CountryDetailCard({ country, onClose }: CountryDetailCardProps) {
  if (!country) {
    return (
      <div className="country-card-empty">
        
      </div>
    );
  }

  return (
    <div className="country-detail-card">
      <button 
        className="card-close-button" 
        onClick={onClose}
        aria-label="Fermer les détails"
      >
        ✕
      </button>

      <div className="card-content">
        {/* 1. GRAND DRAPEAU EN HAUT */}
        <div className="flag-image-container">
          <img 
            src={country.flagUrl} 
            alt={`Drapeau officiel - ${country.name}`} 
            className="country-flag-large"
            loading="lazy"
          />
        </div>

        {/* 2. PAYS + CONTINENT SUR LA MÊME LIGNE */}
        <div className="card-header">
          <h2 className="country-title">{country.name}</h2>
          <span className="continent-badge">{country.continent}</span>
        </div>

        <hr className="card-divider" />

        {/* 3. INFORMATIONS */}
        <div className="info-grid">
          <div className="info-box">
            <div className="info-text">
              <span className="info-label">Capitale</span>
              <p className="info-value">{country.capital}</p>
            </div>
          </div>

          <div className="info-box">
            <div className="info-text">
              <span className="info-label">Population</span>
              <p className="info-value">{country.population.toLocaleString('fr-FR')} hab.</p>
            </div>
          </div>

          <div className="info-box col-span-2">
            <div className="info-text">
              <span className="info-label">Superficie</span>
              <p className="info-value">{country.area.toLocaleString('fr-FR')} km²</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
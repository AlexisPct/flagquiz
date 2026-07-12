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
        <div className="empty-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
        </div>
        <h3>Aucun pays sélectionné</h3>
        <p>Cliquez sur le globe pour explorer une destination.</p>
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
        <div className="card-header">
          <div className="header-text">
            <span className="continent-badge">{country.continent}</span>
            <h2 className="country-title">{country.name}</h2>
          </div>
        </div>

        <div className="flag-image-container">
          <img 
            src={country.flagUrl} 
            alt={`Drapeau officiel - ${country.name}`} 
            className="country-flag-large"
            loading="lazy"
          />
        </div>

        <hr className="card-divider" />

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
              <p className="info-value">{country.population} hab.</p>
            </div>
          </div>

          <div className="info-box col-span-2">
            <div className="info-text">
              <span className="info-label">Superficie</span>
              <p className="info-value">{country.area} km²</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
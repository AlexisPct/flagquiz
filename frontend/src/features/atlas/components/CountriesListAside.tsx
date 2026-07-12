import React, { useState } from 'react';
import { type Country } from '../../../types/index';
import './CountriesListAside.css';

interface CountriesListAsideProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
}

const CountriesListAside: React.FC<CountriesListAsideProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="at-sidebar">
      <div className="at-search-container">
        <input
          type="text"
          placeholder="Rechercher un pays..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="at-search-input"
        />
      </div>

      <ul className="at-countries-list">
        {filteredCountries.map((country) => (
          <li
            key={country.codeAlpha2}
            className={`at-country-item ${
              selectedCountry?.codeAlpha2 === country.codeAlpha2 ? 'active' : ''
            }`}
            onClick={() => onSelectCountry(country)}
          >
            <img src={country.flagUrl} alt="" className="at-mini-flag" />
            <span className="at-country-name">{country.name}</span>
          </li>
        ))}
        {filteredCountries.length === 0 && (
          <p className="at-no-result">Aucun pays trouvé</p>
        )}
      </ul>
    </aside>
  );
};

export default CountriesListAside;
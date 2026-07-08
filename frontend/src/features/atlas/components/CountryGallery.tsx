import React, { useEffect, useState } from 'react';
import { type Country } from '../../../types/index';
import { CountryMap } from './CountryMap';

export const CountryGallery: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/quiz/countries')
      .then((res) => {
        if (!res.ok) throw new Error('Impossible de récupérer la liste des pays');
        return res.json();
      })
      .then((data: Country[]) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const continents = ['All', ...Array.from(new Set(countries.map((c) => c.continent)))];

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.capital.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesContinent = 
      selectedContinent === 'All' || country.continent === selectedContinent;

    return matchesSearch && matchesContinent;
  });

  if (loading) return <div style={styles.center}>⏳ Chargement du globe...</div>;
  if (error) return <div style={{ ...styles.center, color: '#dc3545' }}>❌ Erreur : {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌍 Atlas des Pays ({filteredCountries.length})</h1>

      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Rechercher un pays ou une capitale..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedContinent}
          onChange={(e) => setSelectedContinent(e.target.value)}
          style={styles.selectInput}
        >
          {continents.map((continent) => (
            <option key={continent} value={continent}>
              {continent === 'All' ? 'Tous les continents' : continent}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.grid}>
        {filteredCountries.map((country, index) => (
          <div key={country.codeAlpha2 || index} style={styles.card}>
            <div style={styles.flagWrapper}>
              {country.flagUrl ? (
                <img 
                  src={country.flagUrl} 
                  alt={`Drapeau de ${country.name}`} 
                  style={styles.flag}
                  loading="lazy" 
                />
              ) : (
                <div style={styles.noFlag}>🏳️ Pas de drapeau</div>
              )}
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.countryName}>{country.name}</h3>
              <p style={styles.info}>🏛️ <strong>Capitale :</strong> {country.capital || 'N/A'}</p>
              <p style={styles.info}>🗺️ <strong>Continent :</strong> {country.continent}</p>
              <CountryMap countryCode={country.codeAlpha2} size={120} />
              <span style={styles.badge}>{country.codeAlpha2 || '??'}</span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCountries.length === 0 && (
        <div style={styles.noResults}>Aucun pays ne correspond à votre recherche.</div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    color: '#212529',
    marginBottom: '2rem',
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '2 1 300px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    outline: 'none',
  },
  selectInput: {
    flex: '1 1 200px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e9ecef',
    transition: 'transform 0.2s',
  },
  flagWrapper: {
    width: '100%',
    height: '150px',
    backgroundColor: '#f1f3f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #e9ecef',
  },
  flag: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noFlag: {
    color: '#6c757d',
    fontSize: '0.9rem',
  },
  cardContent: {
    padding: '1.25rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flexGrow: 1,
  },
  countryName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    color: '#212529',
    paddingRight: '2.5rem',
  },
  info: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#495057',
  },
  badge: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    backgroundColor: '#e9ecef',
    color: '#495057',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  noResults: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: '3rem',
    fontSize: '1.1rem',
  },
};
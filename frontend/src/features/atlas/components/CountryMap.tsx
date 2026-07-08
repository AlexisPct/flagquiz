import React, { useState } from 'react';

interface CountryMapProps {
  countryCode: string; 
  size?: number;
}

export const CountryMap: React.FC<CountryMapProps> = ({ countryCode, size = 160 }) => {
  const [hasError, setHasError] = useState(false);

  if (!countryCode || hasError) {
    return <div style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center', padding: '10px' }}>🗺️ Carte indisponible</div>;
  }

  const codeLower = countryCode.toLowerCase();

  const shapeUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${codeLower}/128.png`;

  return (
    <div style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
    }}>
      <img 
        src={shapeUrl} 
        alt={`Silhouette géographique de ${countryCode}`}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          filter: 'brightness(0) saturate(100%) invert(72%) sepia(21%) saturate(1634%) hue-rotate(94deg) brightness(97%) contrast(92%)',
        }}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
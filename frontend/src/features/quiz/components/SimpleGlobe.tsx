import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import './SimpleGlobe.css';

interface SimpleGlobeProps {
  isRotating?: boolean;
  size: number;
  selectedCountryId?: string;
}

export const SimpleGlobe: React.FC<SimpleGlobeProps> = ({ isRotating = true, size, selectedCountryId }) => {
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const oceanRef = useRef<SVGCircleElement | null>(null);
  const currentRotateRef = useRef<[number, number, number]>([0, -15, 0]);
  
  const baseRadius = size / 2 - 5;
  const currentScaleRef = useRef<number>(baseRadius);
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);

  // Chargement des données géographiques
  useEffect(() => {
    fetch('/maps/world.json')
      .then((res) => res.json())
      .then((data) => {
        const { features } = topojson.feature(data, data.objects.countries) as any;
        setGeoFeatures(features);
      })
      .catch((err) => console.error("Erreur d'initialisation du globe :", err));
  }, []);

  // Moteur d'animation ultra-fluide
  useEffect(() => {
    if (!geoFeatures.length || !mapGroupRef.current || !oceanRef.current) return;

    const projection = d3.geoOrthographic().translate([size / 2, size / 2]).clipAngle(90);
    const pathGenerator = d3.geoPath().projection(projection);

    const paths = d3.select(mapGroupRef.current)
      .selectAll('path')
      .data(geoFeatures)
      .join('path')
      .attr('class', (d: any) => {
        const currentId = String(d.id || d.properties?.id || '');
        const isSelected = selectedCountryId && currentId === String(selectedCountryId);
        return isSelected ? 'simple-globe-land selected-country' : 'simple-globe-land';
      });

    let animationFrameId: number;

    const renderFrame = () => {
      let [lon, lat, roll] = currentRotateRef.current;
      let targetScale = baseRadius;

      const selectedFeature = selectedCountryId 
        ? geoFeatures.find((f: any) => String(f.id) === String(selectedCountryId) || String(f.properties?.id) === String(selectedCountryId))
        : null;

      if (selectedFeature) {
        // 1. Calcul des coordonnées cibles
        const [targetLon, targetLat] = d3.geoCentroid(selectedFeature);
        let diffLon = (-targetLon - lon) % 360;
        if (diffLon < -180) diffLon += 360;
        if (diffLon > 180) diffLon -= 360;
        
        const diffLat = -targetLat - lat;

        // 2. Interpolation fluide de la position (Vitesse progressive)
        lon += diffLon * 0.06;
        lat += diffLat * 0.06;

        // 3. LE SECRET DE LA FLUIDITÉ : Calcul du zoom basé sur la distance angulaire restante
        const bounds = d3.geoBounds(selectedFeature);
        const countryDistance = d3.geoDistance(bounds[0], bounds[1]);
        
        // Facteur de zoom max selon la taille du pays
        let maxZoomFactor = 0.45 / countryDistance; 
        maxZoomFactor = Math.max(1.3, Math.min(4.0, maxZoomFactor));
        const finalZoomScale = baseRadius * maxZoomFactor;

        // On évalue la distance angulaire globale qui sépare la caméra du pays actuel (0 = alignement parfait)
        const angularError = Math.sqrt(diffLon * diffLon + diffLat * diffLat);

        // Plus l'erreur angulaire est grande (entre 0 et 180°), plus on force le dézoom vers baseRadius
        // La fonction Gaussienne/Smooth (Math.min) permet une transition ultra-propre sans à-coups
        const trackingProgress = Math.max(0, 1 - angularError / 45); // 45° de zone d'amortissement
        
        // La cible de zoom glisse dynamiquement entre l'échelle minimale et l'échelle maximale du pays
        targetScale = baseRadius + (finalZoomScale - baseRadius) * Math.pow(trackingProgress, 2);

      } else if (isRotating) {
        // Mode veille sans pays sélectionné
        lon = (lon + 0.25) % 360;
        lat = -15;
        targetScale = baseRadius;
      }

      // 4. Amortissement constant du zoom (Lerp doux)
      currentScaleRef.current += (targetScale - currentScaleRef.current) * 0.07;

      // 5. Application des transformations géométriques
      projection.rotate([lon, lat, roll]);
      projection.scale(currentScaleRef.current);
      
      // Rendu graphique coordonné
      d3.select(oceanRef.current).attr('r', currentScaleRef.current);
      paths.attr('d', (d: any) => pathGenerator(d));

      currentRotateRef.current = [lon, lat, roll];
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
    return () => cancelAnimationFrame(animationFrameId);
  }, [geoFeatures, size, isRotating, selectedCountryId, baseRadius]);

  return (
    <div className="simple-globe-wrapper">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="simple-svg-globe">
        <defs>
          <clipPath id="hublot-clip">
            <circle cx={size / 2} cy={size / 2} r={baseRadius} />
          </clipPath>
        </defs>

        <g clipPath="url(#hublot-clip)">
          <circle ref={oceanRef} cx={size / 2} cy={size / 2} className="simple-globe-ocean" />
          <g ref={mapGroupRef} />
        </g>

        <circle cx={size / 2} cy={size / 2} r={baseRadius} className="hublot-ring" fill="none" style={{ pointerEvents: 'none' }} />
      </svg>
    </div>
  );
};
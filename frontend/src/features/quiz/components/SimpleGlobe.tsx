import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import './SimpleGlobe.css';

interface SimpleGlobeProps {
  isRotating?: boolean;
  size: number;
}

export const SimpleGlobe: React.FC<SimpleGlobeProps> = ({ isRotating = true, size }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const rotationRef = useRef<number>(0);

  useEffect(() => {
    fetch('/maps/world.json')
      .then((res) => res.json())
      .then((data) => {
        const countries = topojson.feature(data, data.objects.countries);
        setGeoData(countries);
      })
      .catch((err) => console.error("Erreur d'initialisation du globe :", err));
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const width = size;
    const height = size;
    const radius = size / 2 - 5;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([size / 2, size / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('class', 'simple-globe-ocean');

    const mapGroup = svg.append('g');
    const countriesPaths = mapGroup.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', 'simple-globe-land');

    let animationFrameId: number;

    if (isRotating) {
      const tick = () => {
        rotationRef.current = (rotationRef.current + 0.25) % 360;
        projection.rotate([rotationRef.current, -15, 0]);
        countriesPaths.attr('d', (d: any) => path(d));
        animationFrameId = requestAnimationFrame(tick);
      };

      tick();
    } else {
        countriesPaths.attr('d', (d: any) => path(d));
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [geoData]);

  return (
    <div className="simple-globe-wrapper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        className="simple-svg-globe"
      />
    </div>
  );
};
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './SimpleGlobe.css';

interface SimpleGlobeProps {
  isRotating?: boolean;
  selectedCountryId?: string;
  onSelectCountry?: (countryId: string) => void;
  autoResumeDelay?: number;
  enableClick?: boolean;
  enableDrag?: boolean;
  enableZoom?: boolean;
}

// Resolution interne fixe pour les calculs D3 et la viewBox SVG
const INTERNAL_SIZE = 800;
const BASE_RADIUS = INTERNAL_SIZE / 2 - 10;

export const SimpleGlobe: React.FC<SimpleGlobeProps> = ({
  isRotating = true,
  selectedCountryId,
  onSelectCountry,
  autoResumeDelay = 3000,
  enableClick = true,
  enableDrag = true,
  enableZoom = true,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const oceanRef = useRef<SVGCircleElement | null>(null);
  const markerGroupRef = useRef<SVGGElement | null>(null);

  const currentRotateRef = useRef<[number, number, number]>([0, -15, 0]);
  const currentScaleRef = useRef<number>(BASE_RADIUS);
  
  const isUserInteractingRef = useRef<boolean>(false);
  const inactivityTimerRef = useRef<number | null>(null);

  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [microStates, setMicroStates] = useState<any[]>([]);

  const scheduleAutoResume = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    
    inactivityTimerRef.current = window.setTimeout(() => {
      isUserInteractingRef.current = false;
    }, autoResumeDelay);
  };

  useEffect(() => {
    Promise.all([
      d3.json('/maps/world-110m.geojson'),
      d3.json('./maps/micro-states.geojson')
    ])
      .then(([data, dataMicroStates]: [any, any]) => {
        setGeoFeatures(data.features);
        setMicroStates(dataMicroStates.features);
      })
      .catch((err) => console.error("Erreur d'initialisation du globe :", err));
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      isUserInteractingRef.current = false;
    }
  }, [selectedCountryId]);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!geoFeatures.length || !mapGroupRef.current || !oceanRef.current || !markerGroupRef.current || !svgRef.current) return;

    const svgElement = d3.select(svgRef.current);
    const projection = d3.geoOrthographic().translate([INTERNAL_SIZE / 2, INTERNAL_SIZE / 2]).clipAngle(90);
    const pathGenerator = d3.geoPath().projection(projection);

    // 1. RENDER DES PAYS
    const paths = d3.select(mapGroupRef.current)
      .selectAll('path')
      .data(geoFeatures)
      .join('path')
      .attr('class', (d: any) => {
        const currentId = String(d.id || d.properties?.id || '');
        const isSelected = selectedCountryId && currentId === String(selectedCountryId);
        return isSelected ? 'simple-globe-land selected-country' : 'simple-globe-land';
      })
      .style('cursor', enableClick ? 'pointer' : 'default');

    // 2. GESTION DU DRAG & CLIC
    let dragStartPos = { x: 0, y: 0 };
    let isDragging = false;

    const drag = d3.drag<SVGSVGElement, unknown>()
      .on('start', (event) => {
        if (!enableDrag && !enableClick) return;
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        dragStartPos = { x: event.x, y: event.y };
        isDragging = false;
        if (enableDrag) isUserInteractingRef.current = true;
      })
      .on('drag', (event) => {
        if (!enableDrag) return;
        const distSq = (event.x - dragStartPos.x) ** 2 + (event.y - dragStartPos.y) ** 2;
        if (distSq > 9) {
          isDragging = true;
        }

        if (isDragging) {
          const sensitivity = 360 / (currentScaleRef.current * 2 * Math.PI);
          let [lon, lat, roll] = currentRotateRef.current;

          lon += event.dx * sensitivity;
          lat -= event.dy * sensitivity;
          lat = Math.max(-85, Math.min(85, lat));

          currentRotateRef.current = [lon, lat, roll];
        }
      })
      .on('end', (event) => {
        if (!isDragging && enableClick) {
          const target = event.sourceEvent.target;
          const datum = d3.select(target).datum() as any;
          if (datum) {
            const countryId = String(datum.id || datum.properties?.id || '');
            if (countryId && onSelectCountry) {
              isUserInteractingRef.current = false;
              onSelectCountry(countryId);
            } else if (enableDrag) {
              scheduleAutoResume();
            }
          } else if (enableDrag) {
            scheduleAutoResume();
          }
        } else if (enableDrag) {
          scheduleAutoResume();
        }
      });

    if (enableDrag || enableClick) {
      svgElement.call(drag);
    } else {
      svgElement.on('.drag', null);
    }

    // 3. ZOOM MOLETTE
    const handleWheel = (event: WheelEvent) => {
      if (!enableZoom) return;
      event.preventDefault();

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      isUserInteractingRef.current = true;

      const zoomFactor = event.deltaY < 0 ? 1.08 : 0.92;
      const minScale = BASE_RADIUS;
      const maxScale = BASE_RADIUS * 4.0;

      currentScaleRef.current = Math.max(minScale, Math.min(maxScale, currentScaleRef.current * zoomFactor));
      scheduleAutoResume();
    };

    const svgDom = svgRef.current;
    if (enableZoom) {
      svgDom.addEventListener('wheel', handleWheel, { passive: false });
    }

    // 4. ANIMATION FRAME
    let animationFrameId: number;

    const renderFrame = () => {
      let [lon, lat, roll] = currentRotateRef.current;
      let targetScale = currentScaleRef.current;

      const foundInMicro = selectedCountryId
        ? microStates.find((f: any) => String(f.id) === String(selectedCountryId) || String(f.properties?.id) === String(selectedCountryId))
        : null;

      const foundInWorld = selectedCountryId && !foundInMicro
        ? geoFeatures.find((f: any) => String(f.id) === String(selectedCountryId) || String(f.properties?.id) === String(selectedCountryId))
        : null;

      const selectedFeature = foundInMicro || foundInWorld;
      const isMicroState = !!foundInMicro;

      if (selectedFeature && !isUserInteractingRef.current) {
        const [targetLon, targetLat] = d3.geoCentroid(selectedFeature);
        let diffLon = (-targetLon - lon) % 360;
        if (diffLon < -180) diffLon += 360;
        if (diffLon > 180) diffLon -= 360;

        const diffLat = -targetLat - lat;

        lon += diffLon * 0.06;
        lat += diffLat * 0.06;

        const bounds = d3.geoBounds(selectedFeature);
        const countryDistance = d3.geoDistance(bounds[0], bounds[1]);

        let maxZoomFactor = 0.45 / countryDistance;
        maxZoomFactor = Math.max(1.3, Math.min(4.0, maxZoomFactor));
        const finalZoomScale = BASE_RADIUS * maxZoomFactor;

        const angularError = Math.sqrt(diffLon * diffLon + diffLat * diffLat);
        const trackingProgress = Math.max(0, 1 - angularError / 45);

        targetScale = BASE_RADIUS + (finalZoomScale - BASE_RADIUS) * Math.pow(trackingProgress, 2);
        currentScaleRef.current += (targetScale - currentScaleRef.current) * 0.07;

      } else if (isRotating && !isUserInteractingRef.current) {
        lon = (lon + 0.25) % 360;
        lat += (-15 - lat) * 0.05;
        targetScale = BASE_RADIUS;
        currentScaleRef.current += (targetScale - currentScaleRef.current) * 0.05;
      }

      projection.rotate([lon, lat, roll]);
      projection.scale(currentScaleRef.current);

      d3.select(oceanRef.current).attr('r', BASE_RADIUS);
      paths.attr('d', (d: any) => pathGenerator(d));

      const markerEl = d3.select(markerGroupRef.current);
      if (isMicroState && selectedFeature) {
        const centroid = d3.geoCentroid(selectedFeature);
        const centerGlobe: [number, number] = [-lon, -lat];
        const distance = d3.geoDistance(centroid, centerGlobe);

        if (distance <= Math.PI / 2) {
          const coords = projection(centroid);
          if (coords) {
            markerEl.attr('transform', `translate(${coords[0]}, ${coords[1]})`)
                    .style('display', 'block');
          } else {
            markerEl.style('display', 'none');
          }
        } else {
          markerEl.style('display', 'none');
        }
      } else {
        markerEl.style('display', 'none');
      }

      currentRotateRef.current = [lon, lat, roll];
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (enableZoom) {
        svgDom.removeEventListener('wheel', handleWheel);
      }
    };
  }, [geoFeatures, microStates, isRotating, selectedCountryId, onSelectCountry, autoResumeDelay, enableClick, enableDrag, enableZoom]);

  return (
    <div className="simple-globe-wrapper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${INTERNAL_SIZE} ${INTERNAL_SIZE}`}
        width="100%"
        height="100%"
        className="simple-svg-globe"
        style={{ touchAction: enableDrag ? 'none' : 'auto' }}
      >
        <defs>
          <clipPath id="hublot-clip">
            <circle cx={INTERNAL_SIZE / 2} cy={INTERNAL_SIZE / 2} r={BASE_RADIUS} />
          </clipPath>
        </defs>

        <g clipPath="url(#hublot-clip)">
          <circle ref={oceanRef} cx={INTERNAL_SIZE / 2} cy={INTERNAL_SIZE / 2} className="simple-globe-ocean" />
          <g ref={mapGroupRef} />

          <g ref={markerGroupRef} style={{ display: 'none', pointerEvents: 'none' }}>
            <circle r={12} fill="#3b82f6" opacity={0.35}>
              <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r={5} fill="#2563eb" stroke="#ffffff" strokeWidth={2} />
          </g>
        </g>

        <circle
          cx={INTERNAL_SIZE / 2}
          cy={INTERNAL_SIZE / 2}
          r={BASE_RADIUS}
          className="hublot-ring"
          fill="none"
          style={{ pointerEvents: 'none' }}
        />
      </svg>
    </div>
  );
};
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "./SimpleGlobe.css";

interface SimpleGlobeProps {
  isRotating?: boolean;
  selectedCountryId?: string;
  onSelectCountry?: (countryId: string) => void;
  autoResumeDelay?: number;
  enableClick?: boolean;
  enableDrag?: boolean;
  enableZoom?: boolean;
}

const INTERNAL_SIZE = 800;
const BASE_RADIUS = INTERNAL_SIZE / 2 - 10;
const MIN_SCALE = BASE_RADIUS;
const MAX_SCALE = BASE_RADIUS * 6.5;

const FRICTION = 0.94;
const VELOCITY_MULTIPLIER = 1.8;
const DRAG_SENSITIVITY = 0.6;

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

  const velocityRef = useRef<[number, number]>([0, 0]);
  const lastDragPosRef = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });

  const pinchStartDistRef = useRef<number | null>(null);
  const scaleAtPinchStartRef = useRef<number>(BASE_RADIUS);

  const [geoData, setGeoData] = useState<{ world: any[]; micro: any[] }>({
    world: [],
    micro: [],
  });

  const scheduleAutoResume = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => {
      isUserInteractingRef.current = false;
    }, autoResumeDelay);
  };

  useEffect(() => {
    Promise.all([
      d3.json("/maps/world-110m.geojson"),
      d3.json("./maps/micro-states.geojson"),
    ])
      .then(([world, micro]: [any, any]) => {
        setGeoData({ world: world.features, micro: micro.features });
      })
      .catch((err) => console.error("Erreur de chargement des cartes :", err));
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      isUserInteractingRef.current = false;
      velocityRef.current = [0, 0];
    }
  }, [selectedCountryId]);

  useEffect(() => {
    if (!geoData.world.length || !svgRef.current) return;

    const svgElement = d3.select(svgRef.current);
    const projection = d3
      .geoOrthographic()
      .translate([INTERNAL_SIZE / 2, INTERNAL_SIZE / 2])
      .clipAngle(90);
    const pathGenerator = d3.geoPath().projection(projection);

    const paths = d3
      .select(mapGroupRef.current)
      .selectAll("path")
      .data(geoData.world)
      .join("path")
      .attr("class", (d: any) => {
        const id = String(d.id || d.properties?.id || "");
        return selectedCountryId && id === String(selectedCountryId)
          ? "simple-globe-land selected-country"
          : "simple-globe-land";
      })
      .style("cursor", enableClick ? "pointer" : "default");

    let dragStartPos = { x: 0, y: 0 };
    let isDragging = false;

    const drag = d3
      .drag<SVGSVGElement, unknown>()
      .on("start", (event) => {
        if (!enableDrag && !enableClick) return;
        if (event.sourceEvent.touches?.length > 1) return;

        if (inactivityTimerRef.current)
          clearTimeout(inactivityTimerRef.current);
        dragStartPos = { x: event.x, y: event.y };
        isDragging = false;

        velocityRef.current = [0, 0];
        lastDragPosRef.current = {
          x: event.x,
          y: event.y,
          time: performance.now(),
        };

        if (enableDrag) isUserInteractingRef.current = true;
      })
      .on("drag", (event) => {
        if (!enableDrag || event.sourceEvent.touches?.length > 1) return;

        const now = performance.now();
        const dt = Math.max(1, now - lastDragPosRef.current.time);

        if (
          (event.x - dragStartPos.x) ** 2 + (event.y - dragStartPos.y) ** 2 >
          9
        ) {
          isDragging = true;
        }

        if (isDragging) {
          const sensitivity =
            (360 / (currentScaleRef.current * 2 * Math.PI)) * DRAG_SENSITIVITY;
          let [lon, lat, roll] = currentRotateRef.current;

          lon += event.dx * sensitivity;
          lat = Math.max(-85, Math.min(85, lat - event.dy * sensitivity));
          currentRotateRef.current = [lon, lat, roll];

          const vx = (event.dx / dt) * sensitivity * 16.6 * VELOCITY_MULTIPLIER;
          const vy = (event.dy / dt) * sensitivity * 16.6 * VELOCITY_MULTIPLIER;
          velocityRef.current = [vx, vy];

          lastDragPosRef.current = { x: event.x, y: event.y, time: now };
        }
      })
      .on("end", (event) => {
        if (event.sourceEvent.touches?.length > 0) return;

        if (!isDragging && enableClick) {
          const datum = d3.select(event.sourceEvent.target).datum() as any;
          const countryId = String(datum?.id || datum?.properties?.id || "");
          if (countryId && onSelectCountry) {
            isUserInteractingRef.current = false;
            velocityRef.current = [0, 0];
            onSelectCountry(countryId);
            return;
          }
        }
        if (enableDrag) scheduleAutoResume();
      });

    if (enableDrag || enableClick) svgElement.call(drag);
    else svgElement.on(".drag", null);

    const clampScale = (scale: number) =>
      Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));

    const handleWheel = (e: WheelEvent) => {
      if (!enableZoom) return;
      e.preventDefault();
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      isUserInteractingRef.current = true;

      currentScaleRef.current = clampScale(
        currentScaleRef.current * (e.deltaY < 0 ? 1.08 : 0.92),
      );
      scheduleAutoResume();
    };

    const getTouchDist = (e: TouchEvent) =>
      Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );

    const handleTouchStart = (e: TouchEvent) => {
      if (enableZoom && e.touches.length === 2) {
        e.preventDefault();
        if (inactivityTimerRef.current)
          clearTimeout(inactivityTimerRef.current);
        isUserInteractingRef.current = true;
        velocityRef.current = [0, 0];
        pinchStartDistRef.current = getTouchDist(e);
        scaleAtPinchStartRef.current = currentScaleRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (enableZoom && e.touches.length === 2 && pinchStartDistRef.current) {
        e.preventDefault();
        currentScaleRef.current = clampScale(
          scaleAtPinchStartRef.current *
            (getTouchDist(e) / pinchStartDistRef.current),
        );
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2 && pinchStartDistRef.current !== null) {
        pinchStartDistRef.current = null;
        if (enableDrag) scheduleAutoResume();
      }
    };

    const svgDom = svgRef.current;
    if (enableZoom) {
      svgDom.addEventListener("wheel", handleWheel, { passive: false });
      svgDom.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      svgDom.addEventListener("touchmove", handleTouchMove, { passive: false });
      svgDom.addEventListener("touchend", handleTouchEnd);
    }

    let animationFrameId: number;

    const renderFrame = () => {
      let [lon, lat, roll] = currentRotateRef.current;

      const selectedFeature = selectedCountryId
        ? geoData.micro.find(
            (f: any) =>
              String(f.id || f.properties?.id) === String(selectedCountryId),
          ) ||
          geoData.world.find(
            (f: any) =>
              String(f.id || f.properties?.id) === String(selectedCountryId),
          )
        : null;

      const isMicroState =
        selectedFeature && geoData.micro.includes(selectedFeature);

      if (selectedFeature && !isUserInteractingRef.current) {
        const [targetLon, targetLat] = d3.geoCentroid(selectedFeature);
        let diffLon = (-targetLon - lon) % 360;
        if (diffLon < -180) diffLon += 360;
        if (diffLon > 180) diffLon -= 360;

        lon += diffLon * 0.06;
        lat += (-targetLat - lat) * 0.06;

        const bounds = d3.geoBounds(selectedFeature);
        const distance = d3.geoDistance(bounds[0], bounds[1]);
        const finalZoomScale =
          BASE_RADIUS * Math.max(1.8, Math.min(6.0, 0.75 / distance));

        const trackingProgress = Math.max(
          0,
          1 - Math.hypot(diffLon, -targetLat - lat) / 45,
        );
        const targetScale =
          BASE_RADIUS + (finalZoomScale - BASE_RADIUS) * trackingProgress ** 2;
        currentScaleRef.current +=
          (targetScale - currentScaleRef.current) * 0.07;
      } else {
        const [vx, vy] = velocityRef.current;

        if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
          lon += vx;
          lat = Math.max(-85, Math.min(85, lat - vy));

          velocityRef.current = [vx * FRICTION, vy * FRICTION];
        } else if (isRotating && !isUserInteractingRef.current) {
          lon = (lon + 0.25) % 360;
          lat += (-15 - lat) * 0.05;
          currentScaleRef.current +=
            (BASE_RADIUS - currentScaleRef.current) * 0.05;
        }
      }

      projection.rotate([lon, lat, roll]);
      projection.scale(currentScaleRef.current);

      d3.select(oceanRef.current).attr("r", BASE_RADIUS);
      paths.attr("d", (d: any) => pathGenerator(d));

      const markerEl = d3.select(markerGroupRef.current);
      if (isMicroState && selectedFeature) {
        const centroid = d3.geoCentroid(selectedFeature);
        const isVisible = d3.geoDistance(centroid, [-lon, -lat]) <= Math.PI / 2;
        const coords = isVisible ? projection(centroid) : null;

        if (coords) {
          markerEl
            .attr("transform", `translate(${coords[0]}, ${coords[1]})`)
            .style("display", "block");
        } else {
          markerEl.style("display", "none");
        }
      } else {
        markerEl.style("display", "none");
      }

      currentRotateRef.current = [lon, lat, roll];
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (enableZoom) {
        svgDom.removeEventListener("wheel", handleWheel);
        svgDom.removeEventListener("touchstart", handleTouchStart);
        svgDom.removeEventListener("touchmove", handleTouchMove);
        svgDom.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [
    geoData,
    isRotating,
    selectedCountryId,
    onSelectCountry,
    autoResumeDelay,
    enableClick,
    enableDrag,
    enableZoom,
  ]);

  return (
    <div className="simple-globe-wrapper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${INTERNAL_SIZE} ${INTERNAL_SIZE}`}
        width="100%"
        height="100%"
        className="simple-svg-globe"
        style={{ touchAction: "none" }}
      >
        <defs>
          <clipPath id="hublot-clip">
            <circle
              cx={INTERNAL_SIZE / 2}
              cy={INTERNAL_SIZE / 2}
              r={BASE_RADIUS}
            />
          </clipPath>
        </defs>

        <g clipPath="url(#hublot-clip)">
          <circle
            ref={oceanRef}
            cx={INTERNAL_SIZE / 2}
            cy={INTERNAL_SIZE / 2}
            className="simple-globe-ocean"
          />
          <g ref={mapGroupRef} />

          <g
            ref={markerGroupRef}
            style={{ display: "none", pointerEvents: "none" }}
          >
            <circle r={12} fill="#3b82f6" opacity={0.35}>
              <animate
                attributeName="r"
                values="6;16;6"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.1;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
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
          style={{ pointerEvents: "none" }}
        />
      </svg>
    </div>
  );
};

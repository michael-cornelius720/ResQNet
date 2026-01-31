"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

type PoliceMapProps = {
  userLat: number;
  userLng: number;
  hospitalLat: number;
  hospitalLng: number;
};

export default function PoliceMap({
  userLat,
  userLng,
  hospitalLat,
  hospitalLng,
}: PoliceMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // If map already exists, remove it to allow re-initialization with new props
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Validate coordinates
    if (isNaN(userLat) || isNaN(userLng) || isNaN(hospitalLat) || isNaN(hospitalLng)) {
      console.error("Invalid coordinates passed to PoliceMap", { userLat, userLng, hospitalLat, hospitalLng });
      const map = L.map(containerRef.current).setView([userLat || 0, userLng || 0], 13);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      return;
    }

    // Initialize map
    const map = L.map(containerRef.current).setView(
      [(userLat + hospitalLat) / 2, (userLng + hospitalLng) / 2],
      14
    );

    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom emergency icon
    const emergencyIcon = L.divIcon({
      className: "custom-emergency-icon",
      html: `
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 6px 12px rgba(220, 38, 38, 0.4), 0 0 0 8px rgba(220, 38, 38, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        ">
          <span style="font-size: 24px;">🚨</span>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        </style>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });

    // Custom hospital icon
    const hospitalIcon = L.divIcon({
      className: "custom-hospital-icon",
      html: `
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 6px 12px rgba(37, 99, 235, 0.4), 0 0 0 8px rgba(37, 99, 235, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="font-size: 24px;">🏥</span>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });

    // Add emergency marker with enhanced popup
    const emergencyMarker = L.marker([userLat, userLng], { icon: emergencyIcon })
      .addTo(map)
      .bindPopup(`
        <div style="
          font-family: system-ui, -apple-system, sans-serif;
          min-width: 200px;
          padding: 8px;
        ">
          <div style="
            text-align: center;
            padding: 12px;
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border-radius: 8px;
            margin-bottom: 8px;
          ">
            <div style="font-size: 32px; margin-bottom: 8px;">🚨</div>
            <strong style="
              font-size: 16px;
              color: #991b1b;
              display: block;
              margin-bottom: 4px;
            ">Emergency Location</strong>
            <div style="
              font-size: 11px;
              color: #7f1d1d;
              font-weight: 600;
            ">IMMEDIATE RESPONSE REQUIRED</div>
          </div>
          <div style="
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            padding: 4px;
          ">
            📍 ${userLat.toFixed(4)}, ${userLng.toFixed(4)}
          </div>
        </div>
      `, {
        maxWidth: 250,
        className: 'custom-popup'
      });

    // Add hospital marker with enhanced popup
    const _hospitalMarker = L.marker([hospitalLat, hospitalLng], { icon: hospitalIcon })
      .addTo(map)
      .bindPopup(`
        <div style="
          font-family: system-ui, -apple-system, sans-serif;
          min-width: 200px;
          padding: 8px;
        ">
          <div style="
            text-align: center;
            padding: 12px;
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-radius: 8px;
            margin-bottom: 8px;
          ">
            <div style="font-size: 32px; margin-bottom: 8px;">🏥</div>
            <strong style="
              font-size: 16px;
              color: #1e40af;
              display: block;
              margin-bottom: 4px;
            ">Hospital Location</strong>
            <div style="
              font-size: 11px;
              color: #1e3a8a;
              font-weight: 600;
            ">DESTINATION POINT</div>
          </div>
          <div style="
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            padding: 4px;
          ">
            📍 ${hospitalLat.toFixed(4)}, ${hospitalLng.toFixed(4)}
          </div>
        </div>
      `, {
        maxWidth: 250,
        className: 'custom-popup'
      });

    // Draw route line with animation
    const _routeLine = L.polyline(
      [
        [userLat, userLng],
        [hospitalLat, hospitalLng],
      ],
      {
        color: "#4f46e5",
        weight: 5,
        opacity: 0.7,
        dashArray: "10, 10",
        className: "route-line",
      }
    ).addTo(map);

    // Add a semi-transparent background line for better visibility
    L.polyline(
      [
        [userLat, userLng],
        [hospitalLat, hospitalLng],
      ],
      {
        color: "#ffffff",
        weight: 8,
        opacity: 0.5,
      }
    ).addTo(map);

    // Calculate distance
    const distance = map.distance([userLat, userLng], [hospitalLat, hospitalLng]);
    const distanceKm = (distance / 1000).toFixed(2);

    // Add distance info marker at midpoint
    const midLat = (userLat + hospitalLat) / 2;
    const midLng = (userLng + hospitalLng) / 2;

    const distanceIcon = L.divIcon({
      className: "distance-info",
      html: `
        <div style="
          background: white;
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid #4f46e5;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-family: system-ui;
          font-weight: bold;
          font-size: 12px;
          color: #4f46e5;
          white-space: nowrap;
        ">
          🚑 ${distanceKm} km
        </div>
      `,
      iconSize: [100, 30],
      iconAnchor: [50, 15],
    });

    L.marker([midLat, midLng], { icon: distanceIcon }).addTo(map);

    // Fit bounds to show both markers with padding
    const bounds = L.latLngBounds([
      [userLat, userLng],
      [hospitalLat, hospitalLng],
    ]);
    map.fitBounds(bounds, { padding: [80, 80] });

    // Open emergency popup after a short delay
    setTimeout(() => {
      emergencyMarker.openPopup();
    }, 500);

    // Add custom CSS for popup styling
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        padding: 0;
      }
      .custom-popup .leaflet-popup-content {
        margin: 0;
      }
      .custom-popup .leaflet-popup-tip {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
      }
      .route-line {
        animation: dash 30s linear infinite;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: -1000;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      document.head.removeChild(style);
    };
  }, [userLat, userLng, hospitalLat, hospitalLng]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg relative"
      style={{ zIndex: 1 }}
    />
  );
}
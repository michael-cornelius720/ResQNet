"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
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
}: Props) {
  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-64 w-full"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* USER */}
      <Marker position={[userLat, userLng]}>
        <Popup>🚑 Emergency Location</Popup>
      </Marker>

      {/* HOSPITAL */}
      <Marker position={[hospitalLat, hospitalLng]}>
        <Popup>🏥 Hospital</Popup>
      </Marker>
    </MapContainer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Hospital = {
  name: string;
  lat: number;
  lng: number;
  distance?: number;
};

export default function SOSPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] =
    useState<Hospital | null>(null);

  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNavigatedRef = useRef(false);

  /* ---------------- DISTANCE ---------------- */
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  /* ---------------- FETCH HOSPITALS ---------------- */
  const fetchHospitals = async (lat: number, lng: number) => {
    const res = await fetch("/api/hospitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });

    let data = await res.json();

    data = data
      .map((h: any) => ({
        ...h,
        distance: calculateDistance(lat, lng, h.lat, h.lng),
      }))
      .sort((a: any, b: any) => a.distance - b.distance);

    setHospitals(data);

    // ⏱️ Auto-select nearest hospital after 5 seconds
    autoTimerRef.current = setTimeout(() => {
      setSelectedHospital((prev) => prev ?? data[0]);
    }, 10000);
  };

  /* ---------------- AUTO CONTINUE (SAFE) ---------------- */
  useEffect(() => {
    if (
      location &&
      selectedHospital &&
      !hasNavigatedRef.current
    ) {
      hasNavigatedRef.current = true;

      router.push(
        `/emergency-status?` +
          `hospital=${encodeURIComponent(selectedHospital.name)}` +
          `&hLat=${selectedHospital.lat}` +
          `&hLng=${selectedHospital.lng}` +
          `&uLat=${location.lat}` +
          `&uLng=${location.lng}` +
          `&mode=CRITICAL`
      );
    }
  }, [location, selectedHospital, router]);

  /* ---------------- GET LOCATION ---------------- */
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        fetchHospitals(lat, lng);
      },
      () => setLocationError("Location permission denied"),
      { enableHighAccuracy: true }
    );
  };

  /* ---------------- START AFTER PHONE ---------------- */
  const handlePhoneSubmit = () => {
    if (!phone.trim()) return;
    getUserLocation();
  };

  /* ---------------- MANUAL CONTINUE ---------------- */
  const handleContinue = () => {
    if (!location || !selectedHospital) return;

    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
    }

    hasNavigatedRef.current = true;

    router.push(
      `/emergency-status?` +
        `hospital=${encodeURIComponent(selectedHospital.name)}` +
        `&hLat=${selectedHospital.lat}` +
        `&hLng=${selectedHospital.lng}` +
        `&uLat=${location.lat}` +
        `&uLng=${location.lng}` +
        `&mode=CRITICAL`
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-2 text-2xl">
            🚨
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Emergency SOS
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Quick help without login
          </p>
        </div>

        {/* PHONE INPUT */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={handlePhoneSubmit}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* LOCATION STATUS */}
        {location && (
          <div className="flex items-center justify-center gap-2 text-green-700 text-sm mb-4">
            📍 <span className="font-medium">Location detected</span>
          </div>
        )}

        {locationError && (
          <p className="text-red-600 text-sm mb-4">{locationError}</p>
        )}

        {/* MAP */}
        {location && (
          <iframe
            className="w-full h-48 rounded-xl border mb-5"
            loading="lazy"
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
          />
        )}

        {/* NEAREST HOSPITAL */}
        {selectedHospital && (
          <div className="bg-gray-50 rounded-xl p-3 mb-5">
            <p className="text-sm font-semibold text-gray-800">
              Nearest Hospital
            </p>
            <p className="text-gray-700">{selectedHospital.name}</p>
            <p className="text-xs text-gray-500">
              🚑 {selectedHospital.distance?.toFixed(2)} km away
            </p>
          </div>
        )}
        {/* HOSPITAL LIST */}
{hospitals.length > 0 && (
  <div className="mb-5">
    <p className="text-sm font-semibold text-gray-800 mb-2">
      Nearby Hospitals
    </p>

    <div className="space-y-2 max-h-40 overflow-y-auto">
      {hospitals.map((h, i) => (
        <button
          key={i}
          onClick={() => {
            // cancel auto select timer
            if (autoTimerRef.current) {
              clearTimeout(autoTimerRef.current);
            }
            setSelectedHospital(h);
          }}
          className={`w-full text-left p-3 rounded-xl border transition ${
            selectedHospital?.name === h.name
              ? "border-red-500 bg-red-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <p className="font-medium text-gray-800">{h.name}</p>
          <p className="text-xs text-gray-500">
            🚑 {h.distance?.toFixed(2)} km away
          </p>
        </button>
      ))}
    </div>
  </div>
)}


        {/* CONTINUE BUTTON */}
        <button
          onClick={handleContinue}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md active:scale-[0.98]"
        >
          Continue
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Hospital auto-selected after 5 seconds
        </p>
      </div>
    </div>
  );
}

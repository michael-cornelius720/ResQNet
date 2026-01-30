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
  const [name, setName] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] =
    useState<Hospital | null>(null);
  const [emergencyId, setEmergencyId] = useState<string | null>(null);
  const [isCreatingEmergency, setIsCreatingEmergency] = useState(false);

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
    try {
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

      // ⏱️ After 10 seconds, if no hospital manually selected, notify 20 nearest
      autoTimerRef.current = setTimeout(() => {
        if (!selectedHospital) {
          // No manual selection - create emergency without hospital (will notify 20 nearest)
          if (phone.trim() && location) {
            createEmergency(phone.trim(), location.lat, location.lng, name.trim() || undefined, null, 20);
          }
        }
      }, 10000);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  /* ---------------- CREATE EMERGENCY IN DB ---------------- */
  const createEmergency = async (
    phoneNumber: string,
    lat: number,
    lng: number,
    userName?: string,
    selectedHospitalId?: string | null,
    notifyCount?: number
  ) => {
    if (isCreatingEmergency || emergencyId) return emergencyId;

    setIsCreatingEmergency(true);

    try {
      const payload: any = {
        phone: phoneNumber,
        latitude: lat,
        longitude: lng,
        name: userName || null,
        emergency_type: "SOS",
        user_notes: "Emergency SOS call",
      };

      // If user manually selected a hospital
      if (selectedHospitalId) {
        payload.selected_hospital_id = selectedHospitalId;
      } else if (notifyCount) {
        // Notify nearest hospitals (max 20)
        payload.radius_km = 50; // Increase radius to ensure we get enough hospitals
      }

      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Emergency created:", data.emergency);
        console.log(`Notified ${data.notified_hospitals?.length || 0} hospitals`);
        setEmergencyId(data.emergency.id);
        return data.emergency.id;
      } else {
        alert(data.error || "Failed to create emergency");
        return null;
      }
    } catch (err) {
      console.error("Error creating emergency:", err);
      alert("Server error while creating emergency");
      return null;
    } finally {
      setIsCreatingEmergency(false);
    }
  };

  /* ---------------- GET LOCATION ---------------- */
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          fetchHospitals(lat, lng);
          // Don't create emergency here - wait for manual selection or timer
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Location permission denied. Please enable location access.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  /* ---------------- AUTO GET LOCATION ON MOUNT ---------------- */
  useEffect(() => {
    getUserLocation();
  }, []);

  /* ---------------- HANDLE PHONE SUBMIT ---------------- */
  const handlePhoneSubmit = async () => {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      return; // Don't show alert on blur if empty
    }

    // Validate phone number
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(trimmedPhone) || trimmedPhone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    // Don't create emergency on phone blur - wait for hospital selection or timer
  };

  /* ---------------- AUTO CONTINUE (SAFE) ---------------- */
  useEffect(() => {
    if (location && selectedHospital && emergencyId && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;

      // Clear any pending timers
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }

      router.push(
        `/emergency-status?` +
        `hospital=${encodeURIComponent(selectedHospital.name)}` +
        `&hLat=${selectedHospital.lat}` +
        `&hLng=${selectedHospital.lng}` +
        `&uLat=${location.lat}` +
        `&uLng=${location.lng}` +
        `&emergencyId=${emergencyId}` +
        `&mode=CRITICAL`
      );
    }
  }, [location, selectedHospital, emergencyId, router]);

  /* ---------------- MANUAL CONTINUE ---------------- */
  const handleContinue = async () => {
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (!location) {
      alert("Waiting for location...");
      return;
    }

    if (!selectedHospital) {
      alert("Please select a hospital");
      return;
    }

    // Create emergency with selected hospital if not already created
    let currentEmergencyId = emergencyId;
    if (!currentEmergencyId && !isCreatingEmergency) {
      // Find the selected hospital's ID from the hospitals list (from OpenStreetMap)
      // We need to match it to a hospital in our database
      // For now, pass the hospital name and the backend will try to match
      currentEmergencyId = await createEmergency(
        phone.trim(),
        location.lat,
        location.lng,
        name.trim() || undefined,
        null // Will be assigned by backend based on name matching
      );
      if (!currentEmergencyId) {
        return; // Error already shown by createEmergency
      }
    }

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
      `&emergencyId=${currentEmergencyId}` +
      `&mode=CRITICAL`
    );
  };

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-2 text-2xl">
            🚨
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency SOS</h1>
          <p className="text-sm text-gray-600 mt-1">Quick help without login</p>
        </div>

        {/* NAME INPUT (OPTIONAL) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Name (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500"
            disabled={isCreatingEmergency}
          />
        </div>

        {/* PHONE INPUT */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={handlePhoneSubmit}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500"
            disabled={isCreatingEmergency}
          />
          {isCreatingEmergency && (
            <p className="text-sm text-blue-600 mt-1">Creating emergency...</p>
          )}
          {emergencyId && (
            <p className="text-sm text-green-600 mt-1">✓ Emergency created</p>
          )}
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
                    // Cancel auto select timer
                    if (autoTimerRef.current) {
                      clearTimeout(autoTimerRef.current);
                    }
                    setSelectedHospital(h);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition ${selectedHospital?.name === h.name
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
          disabled={
            !phone.trim() || !location || !selectedHospital || isCreatingEmergency
          }
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingEmergency ? "Creating Emergency..." : "Continue"}
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Hospital auto-selected after 10 seconds
        </p>
      </div>
    </div>
  );
}
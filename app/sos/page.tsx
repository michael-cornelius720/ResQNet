"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Users, MapPin, Clock, AlertCircle, Loader2, CheckCircle } from "lucide-react";

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
        .map((h: { name: string; lat: number; lng: number }) => ({
          ...h,
          distance: calculateDistance(lat, lng, h.lat, h.lng),
        }))
        .sort((a: { distance: number }, b: { distance: number }) => a.distance - b.distance);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg">
        {/* HEADER */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl mb-4 shadow-xl animate-emergency-pulse">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency SOS</h1>
          <p className="text-gray-600">Instant help • No login required</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-slide-up">

          {/* NAME INPUT (OPTIONAL) */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                disabled={isCreatingEmergency}
              />
            </div>
          </div>

          {/* PHONE INPUT */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                placeholder="+1 (234) 567-8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={handlePhoneSubmit}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                disabled={isCreatingEmergency}
              />
            </div>
            {isCreatingEmergency && (
              <div className="flex items-center gap-2 mt-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm">Creating emergency...</p>
              </div>
            )}
            {emergencyId && (
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-medium">Emergency created successfully</p>
              </div>
            )}
          </div>

          {/* LOCATION STATUS */}
          {location && (
            <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">Location detected</span>
            </div>
          )}

          {locationError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{locationError}</p>
            </div>
          )}

          {/* MAP */}
          {location && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-800">Your Location</h3>
              </div>
              <iframe
                className="w-full h-56 rounded-xl border-2 border-gray-200 shadow-md"
                loading="lazy"
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              />
            </div>
          )}

          {/* SELECTED HOSPITAL */}
          {selectedHospital && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 mb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
                    Selected Hospital
                  </p>
                  <p className="font-bold text-gray-900 text-lg">{selectedHospital.name}</p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedHospital.distance?.toFixed(2)} km away
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
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
            className="w-full gradient-bg-emergency text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isCreatingEmergency ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Creating Emergency...
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6" />
                Send Emergency Alert
              </>
            )}
          </button>

          {/* FOOTER */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Quick Tip</p>
                <p className="text-xs text-yellow-700 mt-1">
                  If you don't select a hospital, we'll automatically notify the 20 nearest hospitals after 10 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BACK TO HOME */}
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full text-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
        >
          ← Back to Home
        </button>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} ResQNet. All rights reserved. Saving lives, one second at a time.
        </p>
      </div>
    </div>
  );
}
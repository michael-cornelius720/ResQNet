"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Hospital = {
  name: string;
  lat: number;
  lng: number;
  distance?: number; // ✅ ADD THIS
};


export default function UserPage() {
  const router = useRouter();

  const [emergencyMode, setEmergencyMode] = useState<
    "CRITICAL" | "NORMAL" | null
  >(null);
  const [showForm, setShowForm] = useState(false);

  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [emergencyTypes, setEmergencyTypes] = useState<string[]>([]);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState("");

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  //dropdown
  const [showHospitalPicker, setShowHospitalPicker] = useState(false);


  /* ---------------- SOS HOLD ---------------- */
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const toggleEmergencyType = (type: string) => {
    setEmergencyTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  /* ---------------- FETCH REAL HOSPITALS (FREE) ---------------- */
  const fetchHospitals = async (lat: number, lng: number) => {
  try {
    const res = await fetch("/api/hospitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });

    let data = await res.json();

    // 🔥 Calculate distance for each hospital
    data = data.map((h: any) => ({
      ...h,
      distance: calculateDistance(lat, lng, h.lat, h.lng),
    }));

    // 🔥 Sort by nearest
    data.sort((a: any, b: any) => a.distance - b.distance);

    setHospitals(data);

    // 🔥 Auto-assign nearest hospital for SOS
    if (emergencyMode === "CRITICAL" && data.length > 0) {
      setSelectedHospital(data[0]);
    }
  } catch (err) {
    console.error("Hospital fetch failed", err);
  }
};


  //distance
  const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in KM
};

  /* ---------------- GPS ---------------- */
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });
        fetchHospitals(lat, lng); // ✅ real-time fetch
      },
      () => setLocationError("Location permission denied"),
      { enableHighAccuracy: true }
    );
  };

  /* ---------------- SOS ---------------- */
  const startSOS = () => {
    holdTimer.current = setTimeout(() => {
      setEmergencyMode("CRITICAL");
      getUserLocation();
      setShowForm(true);
    }, 3000);
  };

  const cancelSOS = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  const handleNormal = () => {
    setEmergencyMode("NORMAL");
    getUserLocation();
    setShowForm(true);
  };

  /* ---------------- CONTINUE ---------------- */
  const handleContinue = () => {
  if (!phone) {
    alert("Please enter phone number");
    return;
  }

  let finalHospital = selectedHospital;

  // Auto assign for SOS
  if (emergencyMode === "CRITICAL" && !finalHospital && hospitals.length > 0) {
    finalHospital = hospitals[0];
    setSelectedHospital(finalHospital);
  }

  // Normal case requires selection
  if (emergencyMode === "NORMAL" && !finalHospital) {
    alert("Please select a hospital");
    return;
  }

  if (!location) {
    alert("Location not available");
    return;
  }

  // ✅ Navigate to Emergency Status Page
  router.push(
    `/emergency-status?` +
      `hospital=${encodeURIComponent(finalHospital!.name)}` +
      `&hLat=${finalHospital!.lat}` +
      `&hLng=${finalHospital!.lng}` +
      `&uLat=${location.lat}` +
      `&uLng=${location.lng}` +
      `&mode=${emergencyMode}`
  );
};

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      {!showForm && (
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ResQNet</h1>
          <p className="text-gray-500 mb-8">
            Smart Emergency Medical Response
          </p>

          {/* SOS BUTTON */}
          <div className="flex justify-center mb-4">
            <button
              onMouseDown={startSOS}
              onMouseUp={cancelSOS}
              onMouseLeave={cancelSOS}
              onTouchStart={startSOS}
              onTouchEnd={cancelSOS}
              className="w-44 h-44 rounded-full bg-red-600 text-white text-2xl font-bold shadow-xl active:scale-95 transition"
            >
              SOS
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Hold for 3 seconds for critical emergency
          </p>

          <button
            onClick={handleNormal}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-100"
          >
            Normal Accident / Medical Issue
          </button>
        </div>
      )}

      {showForm && (
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Emergency Details
              </h2>

              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg"
              />

              {emergencyMode === "NORMAL" && (
                <textarea
                  placeholder="Describe the problem"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full p-3 mb-4 border rounded-lg h-24"
                />
              )}

              {location && (
                <p className="text-green-600 text-sm mb-2">
                  📍 Location detected
                </p>
              )}
              {locationError && (
                <p className="text-red-500 text-sm mb-2">{locationError}</p>
              )}

              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emergencyTypes.includes("fire")}
                    onChange={() => toggleEmergencyType("fire")}
                  />
                  Fire Emergency
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emergencyTypes.includes("water")}
                    onChange={() => toggleEmergencyType("water")}
                  />
                  Water / Drowning
                </label>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Continue
              </button>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {location && (
  <iframe
    className="w-full h-64 rounded-lg mb-6"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
  />
)}


              <h3 className="font-semibold text-gray-800 mb-3">
                Nearby Hospitals
              </h3>

              {/* ---------------- HOSPITAL DROPDOWN ---------------- */}
{/* ---------------- HOSPITAL PICKER TRIGGER ---------------- */}
{hospitals.length > 0 && (
  <div className="mt-8">
    

    <button
      onClick={() => setShowHospitalPicker(true)}
      className="w-full flex justify-between items-center p-4 rounded-xl border bg-white shadow-sm active:scale-[0.98] transition"
    >
      <div className="text-left">
        {selectedHospital ? (
          <>
            <p className="font-semibold text-gray-800">
              {selectedHospital.name}
            </p>
            <p className="text-sm text-gray-500">
              📍 {selectedHospital.distance?.toFixed(2)} km away
            </p>
          </>
        ) : (
          <p className="text-gray-400">Select a hospital</p>
        )}
      </div>

      <span className="text-gray-400 text-xl">⌄</span>
    </button>
  </div>
)}


            </div>
          </div>
        </div>
      )}
      {/* ---------------- HOSPITAL PICKER MODAL ---------------- */}
{showHospitalPicker && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
    <div className="w-full bg-white rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto animate-slideUp">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Select Hospital
        </h3>
        <button
          onClick={() => setShowHospitalPicker(false)}
          className="text-gray-500 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {hospitals.map((h, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedHospital(h);
              setShowHospitalPicker(false);
            }}
            className={`w-full text-left p-4 rounded-xl border transition ${
              selectedHospital?.name === h.name
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="font-medium text-gray-800">{h.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              🚑 {h.distance?.toFixed(2)} km away
            </p>
          </button>
        ))}
      </div>
    </div>
  </div>
)}

    </div>
    
  );
}

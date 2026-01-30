"use client";

import { useEffect, useState } from "react";

type Hospital = {
  name: string;
  lat: number;
  lng: number;
  distance: number;
  doctor: string;
};

export default function EmergencyDetailsPage() {
  /* ---------------- MOCK USER ---------------- */
  const user = {
    name: "John Doe",
    phone: "9845612206",
    bloodGroup: "O+",
    conditions: "Asthma",
  };

  /* ---------------- STATE ---------------- */
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] =
    useState<Hospital | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);

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

  /* ---------------- LOCATION ---------------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(loc);
        fetchHospitals(loc.lat, loc.lng);
      },
      () => alert("Location permission required"),
      { enableHighAccuracy: true }
    );
  }, []);

  /* ---------------- FETCH HOSPITALS ---------------- */
  const fetchHospitals = async (lat: number, lng: number) => {
    const res = await fetch("/api/hospitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });

    const data = await res.json();

    const enriched: Hospital[] = data.slice(0, 30).map((h: any) => ({
      name: h.name,
      lat: h.lat,
      lng: h.lng,
      distance: calculateDistance(lat, lng, h.lat, h.lng),
      doctor: ["General Physician", "Cardiologist", "Orthopaedic"][
        Math.floor(Math.random() * 3)
      ],
    }));

    enriched.sort((a, b) => a.distance - b.distance);
    setHospitals(enriched);
  };

  /* ---------------- SELECT HOSPITAL ---------------- */
  const handleHospitalSelect = (index: string) => {
    if (!index) return;
    const h = hospitals[Number(index)];
    setSelectedHospital(h);
    setAppointmentTime("Within 30–45 minutes");
  };

  /* ---------------- SUBMIT ---------------- */
  const handleRequestAppointment = () => {
    if (!issueType) {
      alert("Please select a medical issue");
      return;
    }
    if (!selectedHospital) {
      alert("Please select a hospital");
      return;
    }

    // 🔔 later: API call to hospital dashboard
    alert(
      `Appointment request sent to ${selectedHospital.name}.\nEstimated time: ${appointmentTime}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 space-y-10">

        {/* PAGE HEADER */}
        <header>
          <h1 className="text-3xl font-bold text-black">
            Emergency Medical Assistance
          </h1>
          <p className="text-gray-600 mt-1">
            Review details, select hospital, and request appointment
          </p>
        </header>

        {/* PATIENT DETAILS */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-black mb-2">
            Patient Details
          </h2>
          <p className="text-black"><b>Name:</b> {user.name}</p>
          <p className="text-black"><b>Phone:</b> {user.phone}</p>
          <p className="text-black"><b>Blood Group:</b> {user.bloodGroup}</p>
          <p className="text-black"><b>Conditions:</b> {user.conditions}</p>
        </section>

        {/* MEDICAL ISSUE */}
        <section>
          <h2 className="text-lg font-semibold text-black mb-3">
            Medical Issue
          </h2>

          <select
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-green-500"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option value="">Select medical issue</option>
            <option>General Consultation</option>
            <option>Accident / Injury</option>
            <option>Cardiac</option>
            <option>Orthopaedic</option>
            <option>Emergency</option>
          </select>

          <textarea
            placeholder="Short description (optional)"
            className="w-full mt-4 p-3 border rounded-lg text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>

        {/* MAP */}
        {location && (
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">
              📍 Your Current Location
            </h2>
            <iframe
              className="w-full h-64 rounded-lg border"
              src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            />
          </section>
        )}

        {/* HOSPITAL DROPDOWN */}
        <section>
          <h2 className="text-lg font-semibold text-black mb-2">
            Nearby Hospitals
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Choose a hospital to view route and appointment time
          </p>

          <select
            className="w-full p-4 border rounded-lg text-black bg-white focus:ring-2 focus:ring-green-500"
            defaultValue=""
            onChange={(e) => handleHospitalSelect(e.target.value)}
          >
            <option value="">Select hospital</option>
            {hospitals.map((h, i) => (
              <option key={i} value={i}>
                {h.name} — {h.distance.toFixed(2)} km — {h.doctor}
              </option>
            ))}
          </select>
        </section>

        {/* ROUTE + APPOINTMENT */}
        {selectedHospital && location && (
          <section className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-black mb-2">
              Route & Appointment
            </h2>

            <iframe
              className="w-full h-64 rounded-lg mb-3"
              src={`https://www.google.com/maps?saddr=${location.lat},${location.lng}&daddr=${selectedHospital.lat},${selectedHospital.lng}&output=embed`}
            />

           

            <button
              onClick={handleRequestAppointment}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Request Appointment
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

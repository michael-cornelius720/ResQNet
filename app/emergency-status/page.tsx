"use client";

import { useSearchParams } from "next/navigation";


import { useEffect, useState } from "react";


export default function EmergencyStatusPage() {
  const params = useSearchParams();
const searchParams = useSearchParams();

const hospitalName = searchParams.get("hospital");
const hospitalLat = searchParams.get("hLat");
const hospitalLng = searchParams.get("hLng");

const userLat = searchParams.get("uLat");
const userLng = searchParams.get("uLng");
const selectedHospital =
  hospitalName && hospitalLat && hospitalLng
    ? {
        name: hospitalName,
        lat: Number(hospitalLat),
        lng: Number(hospitalLng),
      }
    : null;

const location =
  userLat && userLng
    ? {
        lat: Number(userLat),
        lng: Number(userLng),
      }
    : null;


  const hospital = params.get("hospital");
  const lat = params.get("lat");
  const lng = params.get("lng");
  const mode = params.get("mode");

  const [status, setStatus] = useState<
    "PENDING" | "APPROVED" | "AMBULANCE_EN_ROUTE"
  >("PENDING");

  const [eta, setEta] = useState<number | null>(null);

  /* ---------------- SIMULATE HOSPITAL APPROVAL ---------------- */
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus("APPROVED");
      setEta(7); // minutes
    }, 3000);

    const timer2 = setTimeout(() => {
      setStatus("AMBULANCE_EN_ROUTE");
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            🚑 Emergency Request in Progress
          </h1>
          <p className="text-gray-500 mt-1">
            Please stay calm. Help is on the way.
          </p>
        </div>

        {/* STATUS */}
        <div className="p-4 rounded-lg border bg-gray-50">
          <p className="font-semibold text-gray-700 mb-2">Request Status</p>

          <ul className="space-y-2 text-sm">
            <li>🟢 Request Sent</li>
            <li className={status !== "PENDING" ? "text-green-600" : ""}>
              {status === "PENDING" ? "🟡 Hospital Reviewing" : "🟢 Approved"}
            </li>
            <li className={status === "AMBULANCE_EN_ROUTE" ? "text-green-600" : ""}>
              🚑 Ambulance En Route
            </li>
          </ul>
        </div>

        {/* HOSPITAL */}
        <div className="p-4 border rounded-lg">
          <p className="font-semibold text-gray-800">🏥 Selected Hospital</p>
          <p className="text-gray-600 mt-1">{hospital}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
              status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status === "PENDING" ? "Waiting for approval" : "Approved"}
          </span>
        </div>

        {/* ETA */}
        {eta && (
          <div className="p-4 border rounded-lg text-center">
            <p className="font-semibold text-gray-800">
              🚑 Estimated Ambulance Arrival
            </p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {eta} – {eta + 2} min
            </p>
          </div>
        )}

        {/* MAP */}
        {lat && lng && (
          <iframe
            className="w-full h-72 rounded-lg border"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(
              hospital || ""
            )}`}
          />
        )}
        
        {/* Hospital way */}
        <p className="text-xs text-red-500">
  location: {location ? "OK" : "MISSING"} | hospital: {selectedHospital ? "OK" : "MISSING"}
</p>

  <a
  href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${selectedHospital.lat},${selectedHospital.lng}&travelmode=driving`}
  target="_blank"
  rel="noopener noreferrer"
  className="block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4"
>
  🚑 Open Route to Hospital
</a>









        {/* POLICE INFO */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-blue-800">🚓 Police Notification</p>
          <p className="text-sm text-blue-700 mt-1">
            Your location and emergency details have been shared with the
            nearest police control room.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-green-600 text-white py-3 rounded-lg font-semibold">
            📞 Call Ambulance
          </button>

          <button className="bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold">
            📞 Call Hospital
          </button>
        </div>
      </div>
    </div>
  );
}

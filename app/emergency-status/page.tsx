"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle, Clock, AlertCircle, Phone, Ambulance, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

type EmergencyData = {
  id: string;
  phone_number: string;
  name: string | null;
  latitude: number;
  longitude: number;
  status: string;
  emergency_level: string;
  hospital_id?: string;
  assigned_hospital_name?: string;
  assigned_hospital_lat?: number;
  assigned_hospital_lng?: number;
  assigned_ambulance_number?: string;
  driver_name?: string;
  driver_phone?: string;
  created_at: string;
};

export default function EmergencyStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <EmergencyStatusContent />
    </Suspense>
  );
}

function EmergencyStatusContent() {
  const searchParams = useSearchParams();
  const emergencyId = searchParams.get("emergencyId");

  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Poll for emergency status updates
  useEffect(() => {
    if (!emergencyId) {
      if (isLoading) setIsLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/emergency?id=${emergencyId}`);
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
          const emergency = data.data[0];
          setEmergencyData(emergency);

          // Set ETA when ambulance is dispatched
          if (emergency.status === "dispatched" || emergency.status === "in_progress") {
            setEta(7); // Default 7 minutes, you can calculate based on distance
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching emergency status:", error);
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchStatus();

    // Poll every 5 seconds
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, [emergencyId]);

  const getStatusInfo = () => {
    if (!emergencyData) {
      return {
        icon: <AlertCircle className="w-6 h-6 text-gray-600" />,
        color: "gray",
        text: "Loading...",
        bgClass: "bg-gray-50 border-gray-200",
        textClass: "text-gray-800",
      };
    }

    switch (emergencyData.status) {
      case "pending":
        return {
          icon: <Clock className="w-6 h-6 text-yellow-600" />,
          color: "yellow",
          text: "Waiting for Hospital Approval",
          bgClass: "bg-yellow-50 border-yellow-200",
          textClass: "text-yellow-800",
        };
      case "acknowledged":
        return {
          icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
          color: "blue",
          text: "Hospital Acknowledged - Preparing Ambulance",
          bgClass: "bg-blue-50 border-blue-200",
          textClass: "text-blue-800",
        };
      case "dispatched":
        return {
          icon: <Ambulance className="w-6 h-6 text-green-600" />,
          color: "green",
          text: "Ambulance Dispatched - On the Way",
          bgClass: "bg-green-50 border-green-200",
          textClass: "text-green-800",
        };
      case "in_progress":
        return {
          icon: <Ambulance className="w-6 h-6 text-green-600" />,
          color: "green",
          text: "Ambulance En Route to Your Location",
          bgClass: "bg-green-50 border-green-200",
          textClass: "text-green-800",
        };
      case "resolved":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          color: "green",
          text: "Emergency Resolved",
          bgClass: "bg-green-50 border-green-200",
          textClass: "text-green-800",
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6 text-gray-600" />,
          color: "gray",
          text: "Unknown Status",
          bgClass: "bg-gray-50 border-gray-200",
          textClass: "text-gray-800",
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading emergency status...</p>
        </div>
      </div>
    );
  }

  if (!emergencyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Not Found</h1>
          <p className="text-gray-600">Unable to load emergency details. Please check your emergency ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🚨</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Emergency Request Active
          </h1>
          <p className="text-gray-600 font-medium">
            Please stay calm. Help is on the way.
          </p>
          <p className="text-sm text-gray-500 mt-2 font-mono">
            Emergency ID: {emergencyData.id.slice(0, 8)}...
          </p>
        </div>

        {/* STATUS TIMELINE */}
        <div className={`bg-white rounded-2xl shadow-xl p-6 border-2 ${statusInfo.bgClass}`}>
          <div className="flex items-center gap-4 mb-4">
            {statusInfo.icon}
            <div className="flex-1">
              <p className="font-black text-lg text-gray-900">Current Status</p>
              <p className={`font-semibold ${statusInfo.textClass}`}>
                {statusInfo.text}
              </p>
            </div>
          </div>

          {/* Status Progress */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Emergency Request Sent</p>
                <p className="text-xs text-gray-600">Your emergency has been registered</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${emergencyData.status !== "pending"
                ? "bg-green-500"
                : "bg-yellow-400 animate-pulse"
                }`}>
                {emergencyData.status !== "pending" ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Clock className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Hospital Review</p>
                <p className="text-xs text-gray-600">
                  {emergencyData.status === "pending"
                    ? "Waiting for hospital approval..."
                    : "Approved by hospital"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${emergencyData.status === "dispatched" || emergencyData.status === "in_progress" || emergencyData.status === "resolved"
                ? "bg-green-500"
                : "bg-gray-300"
                }`}>
                <Ambulance className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Ambulance Dispatched</p>
                <p className="text-xs text-gray-600">
                  {emergencyData.status === "dispatched" || emergencyData.status === "in_progress" || emergencyData.status === "resolved"
                    ? "Ambulance is on the way"
                    : "Waiting for dispatch"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HOSPITAL INFO */}
        {emergencyData.assigned_hospital_name && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <p className="font-black text-lg text-gray-900">Assigned Hospital</p>
                <p className="text-gray-600">{emergencyData.assigned_hospital_name}</p>
              </div>
            </div>

            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${emergencyData.status === "pending"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : "bg-green-100 text-green-700 border border-green-300"
              }`}>
              {emergencyData.status === "pending" ? "⏳ Reviewing Request" : "✓ Request Approved"}
            </span>
          </div>
        )}

        {/* AMBULANCE INFO */}
        {emergencyData.assigned_ambulance_number && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Ambulance className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-black text-lg text-gray-900">Ambulance Details</p>
                <p className="text-gray-600">Vehicle: {emergencyData.assigned_ambulance_number}</p>
              </div>
            </div>

            {emergencyData.driver_name && (
              <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Driver:</span> {emergencyData.driver_name}
                </p>
                {emergencyData.driver_phone && (
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Contact:</span> {emergencyData.driver_phone}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ETA */}
        {eta && (emergencyData.status === "dispatched" || emergencyData.status === "in_progress") && (
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-green-200">
            <p className="font-bold text-gray-800 mb-2">🚑 Estimated Arrival Time</p>
            <p className="text-4xl font-black text-green-600">
              {eta} – {eta + 2} min
            </p>
            <p className="text-sm text-gray-600 mt-2">Please stay at your location</p>
          </div>
        )}

        {/* MAP */}
        {emergencyData.assigned_hospital_lat && emergencyData.assigned_hospital_lng && (
          <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
            <p className="font-bold text-gray-800 mb-3">📍 Route to Hospital</p>
            <iframe
              className="w-full h-64 rounded-xl border"
              loading="lazy"
              src={`https://www.google.com/maps?saddr=${emergencyData.latitude},${emergencyData.longitude}&daddr=${emergencyData.assigned_hospital_lat},${emergencyData.assigned_hospital_lng}&output=embed`}
            />
          </div>
        )}

        {/* POLICE NOTIFICATION */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🚓</span>
            </div>
            <p className="font-black text-blue-900">Police Notified</p>
          </div>
          <p className="text-sm text-blue-700">
            Your location and emergency details have been shared with the nearest police control room for additional support.
          </p>
        </div>

        {/* EMERGENCY ACTIONS */}
        {emergencyData.driver_phone && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`tel:${emergencyData.driver_phone}`}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Ambulance Driver
            </a>

            <a
              href="tel:108"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Emergency (108)
            </a>
          </div>
        )}

        {/* HELP TEXT */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-red-800 font-semibold">
            ⚠️ In case of life-threatening emergency, call <span className="font-black">108</span> immediately
          </p>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} ResQNet. All rights reserved. Saving lives, one second at a time.
        </p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import { User, Phone, Droplet, FileText, MapPin, Hospital, Clock, Navigation, AlertCircle, Activity, CheckCircle } from "lucide-react";

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

  /* ---------------- FETCH HOSPITALS ---------------- */
  const fetchHospitals = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch("/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      const data = await res.json();

      const enriched: Hospital[] = data.slice(0, 30).map((h: { name: string; lat: number; lng: number }) => ({
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
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  }, []);

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
  }, [fetchHospitals]);

  /* ---------------- SELECT HOSPITAL ---------------- */
  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setAppointmentTime("Within 30–45 minutes");
  };

  /* ---------------- SUBMIT ---------------- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleRequestAppointment = async () => {
    if (!issueType) {
      setSubmitError("Please select a medical issue");
      return;
    }
    if (!selectedHospital) {
      setSubmitError("Please select a hospital");
      return;
    }
    if (!location) {
      setSubmitError("Location not available");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_phone: user.phone,
          user_name: user.name,
          blood_group: user.bloodGroup,
          medical_conditions: user.conditions,
          issue_type: issueType,
          description: description,
          hospital_name: selectedHospital.name,
          hospital_lat: selectedHospital.lat,
          hospital_lng: selectedHospital.lng,
          user_lat: location.lat,
          user_lng: location.lng,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIssueType("");
          setDescription("");
          setSelectedHospital(null);
          setAppointmentTime(null);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setSubmitError(data.error || "Failed to submit appointment request");
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Activity className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical Assistance</h1>
          <p className="text-gray-600">Request appointment with nearby hospitals</p>
        </div>

        <div className="space-y-6">
          {/* PATIENT DETAILS CARD */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Name</p>
                  <p className="text-gray-900 font-semibold">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-900 font-semibold">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Droplet className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Blood Group</p>
                  <p className="text-gray-900 font-semibold">{user.bloodGroup}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Conditions</p>
                  <p className="text-gray-900 font-semibold">{user.conditions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* MEDICAL ISSUE CARD */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Medical Issue</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Issue <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  placeholder="Brief description of your condition..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* MAP */}
          {location && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Location</h2>
              </div>
              <iframe
                className="w-full h-64 rounded-xl border-2 border-gray-200 shadow-md"
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              />
            </div>
          )}

          {/* HOSPITAL SELECTION */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Hospital className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Nearby Hospitals</h2>
                <p className="text-sm text-gray-600">Choose a hospital to view distance and availability</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {hospitals.slice(0, 10).map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleHospitalSelect(h)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedHospital?.name === h.name
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Hospital className="w-5 h-5 text-blue-600" />
                        <p className="font-bold text-gray-900">{h.name}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{h.distance.toFixed(2)} km away</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{h.doctor}</span>
                        </div>
                      </div>
                    </div>
                    {selectedHospital?.name === h.name && (
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ROUTE & APPOINTMENT */}
          {selectedHospital && location && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-200 p-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Route & Appointment</h2>
              </div>

              <iframe
                className="w-full h-64 rounded-xl border-2 border-blue-300 shadow-md mb-4"
                src={`https://www.google.com/maps?saddr=${location.lat},${location.lng}&daddr=${selectedHospital.lat},${selectedHospital.lng}&output=embed`}
              />

              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Appointment Time</p>
                    <p className="font-bold text-gray-900">{appointmentTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hospital className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Selected Hospital</p>
                    <p className="font-bold text-gray-900">{selectedHospital.name}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRequestAppointment}
                disabled={isSubmitting || submitSuccess}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${submitSuccess
                    ? "bg-green-600 text-white"
                    : isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "gradient-bg-trust text-white"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Request Sent Successfully!
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Request Appointment
                  </>
                )}
              </button>

              {submitError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm font-semibold">{submitError}</p>
                </div>
              )}

              {submitSuccess && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800 text-sm font-semibold">
                    🎉 Appointment request submitted! The hospital will recomview and respond shortly.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FOOTER */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © {new Date().getFullYear()} ResQNet. All rights reserved. Saving lives, one second at a time.
          </p>
        </div>
      </div>
    </div>
  );
}

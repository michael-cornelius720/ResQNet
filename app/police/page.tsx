"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Shield, MapPin, Clock, AlertCircle, Phone, Navigation, CheckCircle, Eye, Radio, Hospital, Siren } from 'lucide-react';

/* ---------------- TYPES ---------------- */
type Emergency = {
  id: number;
  type: "CRITICAL" | "NORMAL";
  category: string;
  location: string;
  hospital: string;
  time: string;
  status: "Active" | "Responded";
};

/* ---------------- MAP (NO SSR) ---------------- */
const PoliceMap = dynamic(() => import("./PoliceMap"), {
  ssr: false,
});

/* ---------------- MOCK DATA ---------------- */
const initialEmergencies: Emergency[] = [
  {
    id: 1,
    type: "CRITICAL",
    category: "Fire Emergency",
    location: "Kankanady, Mangaluru",
    hospital: "KMC Hospital",
    time: "2 mins ago",
    status: "Active",
  },
  {
    id: 2,
    type: "NORMAL",
    category: "Medical Emergency",
    location: "Attavar, Mangaluru",
    hospital: "Yenepoya Hospital",
    time: "6 mins ago",
    status: "Active",
  },
];

export default function PoliceDashboard() {
  const [timeNow, setTimeNow] = useState("");
  const [emergencies, setEmergencies] = useState(initialEmergencies);
  const [selected, setSelected] = useState<Emergency | null>(null);

  /* ---------------- LIVE CLOCK ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeNow(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const markResponded = (id: number) => {
    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "Responded" } : e
      )
    );
  };

  const getPriorityStyles = (type: string) => {
    return type === 'CRITICAL'
      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-200';
  };

  const activeCount = emergencies.filter(e => e.status === "Active").length;
  const respondedCount = emergencies.filter(e => e.status === "Responded").length;
  const criticalCount = emergencies.filter(e => e.type === "CRITICAL" && e.status === "Active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ================= HEADER ================= */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                    ResQNet
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">
                    Police Control Room
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                PC
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shadow-sm self-start">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold text-xs">
                Online · {timeNow}
              </span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform hover:scale-105 transition-transform">
                <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  ResQNet
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 font-medium">
                  Police Control Room · Emergency Response
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-5">
              <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shadow-sm">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold text-xs lg:text-sm">
                  Online · {timeNow}
                </span>
              </div>
              
              <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 lg:w-11 h-9 lg:h-11 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-xl flex items-center justify-center font-bold text-sm lg:text-lg shadow-md">
                  PC
                </div>
                <div className="hidden md:block">
                  <p className="font-bold text-gray-900 text-sm">Officer John</p>
                  <p className="text-xs text-gray-600">Police Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">

        {/* ========== STATS CARDS ========== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Siren className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{activeCount}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Active Emergencies</p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{criticalCount}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Critical Cases</p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{respondedCount}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Responded Cases</p>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2 lg:mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Radio className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
              </div>
              <span className="text-2xl lg:text-3xl font-black text-gray-900">{emergencies.length}</span>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-600">Total Cases</p>
          </div>
        </div>

        {/* ========== LIVE EMERGENCIES ========== */}
        <section className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-gradient-to-r from-red-50 to-orange-100 border-b border-red-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                <Siren className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
                Live Emergency Requests
              </h2>
            </div>
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-sm font-bold shadow-lg">
              {activeCount} Active
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {emergencies.map((e, index) => (
              <div
                key={e.id}
                onClick={() => setSelected(e)}
                className={`p-4 sm:p-6 lg:p-8 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 ${
                  selected?.id === e.id ? "bg-gradient-to-r from-indigo-50 to-transparent border-l-4 border-indigo-500" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
                  <div className="flex items-start gap-3 lg:gap-4 flex-1">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl lg:rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm flex-shrink-0">
                      {e.type === "CRITICAL" ? (
                        <AlertCircle className="w-6 h-6 lg:w-7 lg:h-7 text-red-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 lg:w-7 lg:h-7 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-base sm:text-lg lg:text-xl text-gray-900 mb-2">
                        {e.category}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500" />
                          <p className="text-xs sm:text-sm font-semibold truncate">{e.location}</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Hospital className="w-4 h-4 flex-shrink-0 text-gray-500" />
                          <p className="text-xs sm:text-sm font-semibold truncate">{e.hospital}</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <p className="text-xs font-medium">{e.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs sm:text-sm font-black whitespace-nowrap flex-shrink-0 ${getPriorityStyles(e.type)}`}>
                    {e.type}
                  </span>
                </div>

                {/* ACTIONS */}
                {e.status === "Active" && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg lg:rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl transform hover:scale-105 transition-all">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg lg:rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:shadow-xl transform hover:scale-105 transition-all">
                      <Navigation className="w-4 h-4" />
                      <span>Navigate</span>
                    </button>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        markResponded(e.id);
                      }}
                      className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg lg:rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Responded</span>
                    </button>
                  </div>
                )}

                {e.status === "Responded" && (
                  <div className="flex items-center gap-2 lg:gap-3 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg lg:rounded-xl border-2 border-green-300 shadow-md">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-700 flex-shrink-0" />
                    <p className="font-black text-xs sm:text-sm text-green-800">
                      Emergency Responded
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========== MAP SECTION ========== */}
        <section className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
              Emergency Location Map
            </h2>
          </div>

          <div className="rounded-xl lg:rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
            <PoliceMap
              userLat={12.8717}
              userLng={74.8486}
              hospitalLat={12.8721}
              hospitalLng={74.8488}
            />
          </div>
        </section>

        {/* ========== QUICK ACTIONS ========== */}
        <section className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
              Police Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg lg:rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl transform hover:scale-105 transition-all">
              <Shield className="w-5 h-5" />
              <span className="text-sm sm:text-base">Dispatch Patrol</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg lg:rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl transform hover:scale-105 transition-all">
              <Phone className="w-5 h-5" />
              <span className="text-sm sm:text-base">Call Hospital</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg lg:rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transform hover:scale-105 transition-all">
              <Radio className="w-5 h-5" />
              <span className="text-sm sm:text-base">Call Ambulance</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg lg:rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm sm:text-base">Close Case</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
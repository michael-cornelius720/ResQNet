"use client";
import dynamic from "next/dynamic";

type Emergency = {
  id: number;
  type: "CRITICAL" | "NORMAL";
  category: string;
  location: string;
  hospital: string;
  time: string;
};
const PoliceMap = dynamic(() => import("./PoliceMap"), {
  ssr: false,
});

const emergencies: Emergency[] = [
  {
    id: 1,
    type: "CRITICAL",
    category: "Fire Emergency",
    location: "Kankanady, Mangaluru",
    hospital: "KMC Hospital",
    time: "2 mins ago",
  },
  {
    id: 2,
    type: "NORMAL",
    category: "Medical Emergency",
    location: "Attavar, Mangaluru",
    hospital: "Yenepoya Hospital",
    time: "6 mins ago",
  },
];

export default function PoliceDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          🚓 Police Control Room
        </h1>
        <div className="text-sm text-gray-600">
          Officer: <span className="font-semibold">John</span>
        </div>
      </div>

      {/* LIVE EMERGENCIES */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🔴 Live Emergency Requests
        </h2>

        <div className="space-y-4">
          {emergencies.map((e) => (
            <div
              key={e.id}
              className={`border rounded-xl p-4 ${
                e.type === "CRITICAL"
                  ? "border-red-500 bg-red-50"
                  : "border-yellow-400 bg-yellow-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {e.type === "CRITICAL" ? "🔴" : "🟡"} {e.category}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {e.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    🏥 {e.hospital}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ⏱ {e.time}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                    Navigate
                  </button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">
                    Mark Responded
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAP PLACEHOLDER */}
      {/* MAP */}
<div className="bg-white rounded-xl shadow p-6 mt-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    🗺️ Emergency Location Map
  </h2>

  <PoliceMap
    userLat={12.8717}
    userLng={74.8486}
    hospitalLat={12.8721}
    hospitalLng={74.8488}
  />
</div>


      {/* ACTION PANEL */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🚓 Police Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="py-3 bg-indigo-600 text-white rounded-lg font-semibold">
            Dispatch Patrol
          </button>
          <button className="py-3 bg-green-600 text-white rounded-lg font-semibold">
            Call Hospital
          </button>
          <button className="py-3 bg-blue-600 text-white rounded-lg font-semibold">
            Call Ambulance
          </button>
          <button className="py-3 bg-gray-900 text-white rounded-lg font-semibold">
            Close Case
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, Michael 👋
        </h1>
        <p className="text-gray-500">
          Your emergency safety dashboard
        </p>
      </div>

      {/* USER INFO CARD */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Personal & Health Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <p><strong>Phone:</strong> +91 XXXXXXXX</p>
          <p><strong>Blood Group:</strong> O+</p>
          <p><strong>Allergies:</strong> None</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SOS */}
        <button
          onClick={() => router.push("/user")}
          className="bg-red-600 text-white rounded-xl p-6 shadow-lg hover:bg-red-700 transition"
        >
          <h2 className="text-2xl font-bold mb-2">🚨 SOS</h2>
          <p>Critical emergency</p>
        </button>

        {/* NORMAL */}
        <button
          onClick={() => router.push("/user")}
          className="bg-orange-500 text-white rounded-xl p-6 shadow-lg hover:bg-orange-600 transition"
        >
          <h2 className="text-2xl font-bold mb-2">🩺 Normal Emergency</h2>
          <p>Medical assistance</p>
        </button>

        {/* HISTORY */}
        <div className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            📜 Emergency History
          </h2>
          <p className="text-gray-500 text-sm">
            Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

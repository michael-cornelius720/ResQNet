"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <header className="w-full px-6 py-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-gray-900">ResQNet</h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 border rounded-lg text-gray-800 hover:bg-gray-100"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Emergency Medical Response
        </h2>

        <p className="text-gray-600 max-w-2xl mb-10">
          ResQNet connects users, hospitals, and police in real time to ensure
          faster emergency response and better care during the critical golden
          hour.
        </p>

        {/* SOS SECTION */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 w-full max-w-md mb-12">
          <p className="text-red-700 font-semibold mb-3">
            🚨 Emergency Situation?
          </p>

          <button
            onClick={() => router.push("/sos")}
            className="w-full h-24 bg-red-600 text-white text-2xl font-bold rounded-full shadow-lg active:scale-95 transition"
          >
            SOS
          </button>

          <p className="text-sm text-gray-500 mt-4">
            No login required. Only phone number needed.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <FeatureCard
            title="⚡ Fast Response"
            description="Instant GPS-based hospital and police coordination."
          />
          <FeatureCard
            title="🏥 Hospital Ready"
            description="Hospitals receive patient details before arrival."
          />
          <FeatureCard
            title="🚓 Police Support"
            description="Police help clear routes and manage traffic."
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} ResQNet. All rights reserved.
      </footer>
    </div>
  );
}

/* ---------- Feature Card ---------- */
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-xl p-6 text-left shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

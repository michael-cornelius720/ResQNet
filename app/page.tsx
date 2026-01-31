"use client";

import { useRouter } from "next/navigation";
import { Activity, Clock, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ResQNet</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-2.5 gradient-bg-trust text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-6 animate-fade-in">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse-slow"></div>
            24/7 Emergency Response System
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight text-balance max-w-4xl">
            Smart Emergency Medical{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Response Network
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
            ResQNet connects citizens, hospitals, and police in real-time to ensure
            faster emergency response and better care during the critical golden hour.
          </p>

          {/* SOS SECTION */}
          <div className="bg-white border-2 border-red-200 rounded-3xl p-8 md:p-10 w-full max-w-md mb-16 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse-slow"></div>
              <p className="text-red-700 font-bold text-lg">
                Emergency Situation?
              </p>
            </div>

            <button
              onClick={() => router.push("/sos")}
              className="w-full h-32 gradient-bg-emergency text-white text-3xl font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 animate-emergency-pulse mb-4 flex items-center justify-center gap-3"
            >
              <Zap className="w-10 h-10" />
              SOS
            </button>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                No login required
              </p>
              <p className="text-xs text-gray-500">
                GPS auto-capture • Instant hospital notification
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-red-600" />}
              title="Lightning Fast"
              description="Instant GPS-based hospital and police coordination with automated dispatch."
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-blue-600" />}
              title="Pre-Arrival Ready"
              description="Hospitals receive patient vitals and emergency details before arrival."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-indigo-600" />}
              title="Police Escort"
              description="Automated traffic management and green corridor for ambulances."
            />
          </div>

          {/* STATISTICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mt-16 mb-8">
            <StatCard value="<5 min" label="Average Response" />
            <StatCard value="24/7" label="Always Active" />
            <StatCard value="100+" label="Partner Hospitals" />
            <StatCard value="98%" label="Success Rate" />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 font-semibold">ResQNet</span>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ResQNet. All rights reserved. Saving lives, one second at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Feature Card ---------- */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors duration-200">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

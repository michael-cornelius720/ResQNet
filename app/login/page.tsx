"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Lock, User, AlertCircle, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHospitalLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/hospital/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("hospital_session", JSON.stringify(data.hospital));
        router.push("/hospital");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleHospitalLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* BRANDING */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Hospital & Police Dashboard Access</p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-slide-up">
          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="hospital_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              onClick={handleHospitalLogin}
              disabled={isLoading}
              className="w-full gradient-bg-trust text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  Login as Hospital
                </>
              )}
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full text-sm text-blue-600 hover:text-blue-800 mt-4 font-medium transition-colors duration-200"
          >
            Forgot Password?
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* POLICE LOGIN */}
          <button
            onClick={() => router.push("/login-police")}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Login as Police
          </button>

          {/* INFO */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs text-blue-800 text-center leading-relaxed">
              For authorized hospital and police personnel only. Contact your administrator for credentials.
            </p>
          </div>
        </div>

        {/* BACK TO HOME */}
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full text-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
        >
          ← Back to Home
        </button>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} ResQNet. All rights reserved. Saving lives, one second at a time.
        </p>
      </div>
    </div>
  );
}

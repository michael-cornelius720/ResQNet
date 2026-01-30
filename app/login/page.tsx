"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        // Store hospital session
        localStorage.setItem("hospital_session", JSON.stringify(data.hospital));

        // Redirect to hospital dashboard
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* APP NAME */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-1">
          ResQNet
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Hospital Dashboard Login
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* LOGIN FORM */}
        <input
          type="text"
          placeholder="Hospital Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-3 mb-6 border rounded-lg text-gray-900"
          disabled={isLoading}
        />

        <button
          onClick={handleHospitalLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login as Hospital"}
        </button>

        {/* FORGOT PASSWORD */}
        <button
          onClick={() => router.push("/forgot-password")}
          className="w-full text-sm text-blue-600 hover:text-blue-800 mb-4 transition"
        >
          Forgot Password?
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* SOS WITHOUT LOGIN */}
        <button
          onClick={() => router.push("/sos")}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-red-700 transition"
        >
          🚨 Emergency SOS (No Login)
        </button>

        {/* INFO */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          For hospital staff only. Contact admin for credentials.
        </p>
      </div>
    </div>
  );
}

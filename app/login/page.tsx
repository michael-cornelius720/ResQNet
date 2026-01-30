"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // 🔐 Later → connect to DB / Auth
    alert("Login successful");
    router.push("/user");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* APP NAME */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-1">
          ResQNet
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Emergency Response Platform
        </p>

        {/* LOGIN FORM */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg text-gray-900"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* SIGNUP */}
        <p className="text-center text-sm text-gray-500 mb-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-medium cursor-pointer"
          >
            Sign up
          </span>
        </p>

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
      </div>
    </div>
  );
}

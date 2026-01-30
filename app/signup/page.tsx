"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  // Personal Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Health Details
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");

  const handleSignup = () => {
    if (!name || !phone || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    // 🔐 Later → save to database
    alert("Signup successful");
    router.push("/user");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-1">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Personal & Health Information
        </p>

        {/* PERSONAL DETAILS */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Personal Details
        </h3>

        <input
          type="text"
          placeholder="Full Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
        />

        <input
          type="tel"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
        />

        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
        />

        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg text-gray-900"
        />

        {/* HEALTH DETAILS */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Health Details (Optional but Recommended)
        </h3>

        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>

        <input
          type="text"
          placeholder="Allergies (if any)"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
        />

        <textarea
          placeholder="Existing Medical Conditions"
          value={medicalConditions}
          onChange={(e) => setMedicalConditions(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg text-gray-900 h-24"
        />

        {/* SUBMIT */}
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Create Account
        </button>

        {/* BACK TO LOGIN */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

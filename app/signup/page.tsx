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
  const [confirmPassword, setConfirmPassword] = useState("");

  // Health Details
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!name || !phone || !email || !password || !confirmPassword) {
      alert("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email_id:email,
          password,
          bloodGroup,
          allergies,
          medicalConditions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      alert("Signup successful! Please check your email to confirm your account.");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      alert(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        />

        <input
          type="tel"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
          disabled={isLoading}
        />

        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Confirm Password *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg text-gray-900"
          disabled={isLoading}
        />

        {/* HEALTH DETAILS */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Health Details (Optional but Recommended)
        </h3>

        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-gray-900"
          disabled={isLoading}
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
          disabled={isLoading}
        />

        <textarea
          placeholder="Existing Medical Conditions"
          value={medicalConditions}
          onChange={(e) => setMedicalConditions(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg text-gray-900 h-24"
          disabled={isLoading}
        />

        {/* SUBMIT */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {/* BACK TO LOGIN */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => !isLoading && router.push("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
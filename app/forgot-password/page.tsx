"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<"request" | "reset">("request");
    const [username, setUsername] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Step 1: Request password reset
    const handleRequestReset = async () => {
        if (!username) {
            setError("Please enter your username");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/hospital/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(
                    `Reset token: ${data.resetToken}\n\nCopy this token and enter it below to reset your password.`
                );
                setResetToken(data.resetToken);
                setStep("reset");
            } else {
                setError(data.error || "Failed to generate reset token");
            }
        } catch (err) {
            console.error("Reset request error:", err);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Reset password with token
    const handleResetPassword = async () => {
        if (!resetToken || !newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/hospital/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    resetToken,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Password reset successful! Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError(data.error || "Failed to reset password");
            }
        } catch (err) {
            console.error("Reset password error:", err);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (step === "request") {
                handleRequestReset();
            } else {
                handleResetPassword();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* HEADER */}
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-1">
                    ResQNet
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    {step === "request" ? "Forgot Password" : "Reset Password"}
                </p>

                {/* SUCCESS MESSAGE */}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-600 whitespace-pre-line">
                            {success}
                        </p>
                    </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {step === "request" ? (
                    <>
                        {/* STEP 1: REQUEST RESET */}
                        <p className="text-sm text-gray-600 mb-4">
                            Enter your hospital username to receive a password reset token.
                        </p>

                        <input
                            type="text"
                            placeholder="Hospital Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full p-3 mb-4 border rounded-lg text-gray-900"
                            disabled={isLoading}
                        />

                        <button
                            onClick={handleRequestReset}
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Generating Token..." : "Get Reset Token"}
                        </button>

                        <button
                            onClick={() => setStep("reset")}
                            className="w-full text-sm text-gray-600 hover:text-gray-800 mb-4 transition"
                        >
                            Already have a reset token?
                        </button>
                    </>
                ) : (
                    <>
                        {/* STEP 2: RESET PASSWORD */}
                        <p className="text-sm text-gray-600 mb-4">
                            Enter the reset token and your new password.
                        </p>

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 mb-3 border rounded-lg text-gray-900"
                            disabled={isLoading}
                        />

                        <input
                            type="text"
                            placeholder="Reset Token"
                            value={resetToken}
                            onChange={(e) => setResetToken(e.target.value)}
                            className="w-full p-3 mb-3 border rounded-lg text-gray-900"
                            disabled={isLoading}
                        />

                        <input
                            type="password"
                            placeholder="New Password (min 8 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 mb-3 border rounded-lg text-gray-900"
                            disabled={isLoading}
                        />

                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full p-3 mb-4 border rounded-lg text-gray-900"
                            disabled={isLoading}
                        />

                        <button
                            onClick={handleResetPassword}
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Resetting Password..." : "Reset Password"}
                        </button>

                        <button
                            onClick={() => {
                                setStep("request");
                                setResetToken("");
                                setNewPassword("");
                                setConfirmPassword("");
                                setError("");
                                setSuccess("");
                            }}
                            className="w-full text-sm text-gray-600 hover:text-gray-800 mb-4 transition"
                        >
                            ← Back to request token
                        </button>
                    </>
                )}

                {/* BACK TO LOGIN */}
                <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={() => router.push("/login")}
                        className="w-full text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                        ← Back to Login
                    </button>
                </div>

                {/* INFO */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                    Contact your administrator if you need assistance.
                </p>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth";

// ✅ Correct Amplify v6+ configuration
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_Exiy18u5t",
      userPoolClientId: "3m2u0jjjd52c9oie6f2189976a",
      signUpVerificationMethod: "code",
    },
  },
});

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------- Auth Functions ----------
  const handleSignUp = async () => {
    try {
      if (form.password !== form.confirmPassword) {
        setMessage("⚠️ Passwords do not match");
        return;
      }
      await signUp({
        username: form.email,
        password: form.password,
      });
      setNeedsConfirmation(true);
      setMessage("✅ Verification code sent to your email.");
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp({
        username: form.email,
        confirmationCode: form.code,
      });
      setNeedsConfirmation(false);
      setActiveTab("signin");
      setMessage("✅ Account confirmed. Please sign in.");
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn({
        username: form.email,
        password: form.password,
      });

      // ✅ Redirect to dashboard after successful sign-in
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-6xl font-bold text-[#0f172a]">AlignSync Pro</h1>
        <p className="mt-2 text-lg text-[#334155]">
          Your productivity, synced and optimized
        </p>
      </header>

      <main className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-2">
          <button
            className={`flex-1 py-2 font-semibold text-center transition-colors ${
              activeTab === "signin"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => {
              setActiveTab("signin");
              setNeedsConfirmation(false);
              setMessage("");
            }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 font-semibold text-center transition-colors ${
              activeTab === "signup"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => {
              setActiveTab("signup");
              setNeedsConfirmation(false);
              setMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === "signin" && !needsConfirmation && (
          <>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSignIn}
              className="w-full bg-[#0f172a] text-white py-2 rounded-md font-semibold hover:bg-[#1e293b]"
            >
              Sign In
            </button>
          </>
        )}

        {/* Sign Up Form */}
        {activeTab === "signup" && !needsConfirmation && (
          <>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSignUp}
              className="w-full bg-[#0f172a] text-white py-2 rounded-md font-semibold hover:bg-[#1e293b]"
            >
              Create Account
            </button>
          </>
        )}

        {/* Code Confirmation */}
        {needsConfirmation && (
          <>
            <p className="text-sm text-gray-600 text-center">
              Enter the 6-digit code sent to your email.
            </p>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Verification Code"
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleConfirmSignUp}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
            >
              Confirm Account
            </button>
          </>
        )}

        {message && (
          <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
        )}
      </main>

      <footer className="mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

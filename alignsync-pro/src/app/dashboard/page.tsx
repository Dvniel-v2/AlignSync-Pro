"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserEmail(user.signInDetails?.loginId || "Unknown");
      } catch (err) {
        console.warn("⚠️ No user signed in — redirecting to login...");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // ✅ Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans">
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-[#0f172a]">AlignSync Pro</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        <h2 className="text-4xl font-bold text-[#0f172a] mb-4">
          Welcome back, {userEmail}!
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          Here’s a snapshot of your productivity and syncs.
        </p>

        {/* Example Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
              Tasks Completed
            </h3>
            <p className="text-3xl font-bold text-blue-600">42</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
              Projects Synced
            </h3>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
              Active Sessions
            </h3>
            <p className="text-3xl font-bold text-purple-600">3</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

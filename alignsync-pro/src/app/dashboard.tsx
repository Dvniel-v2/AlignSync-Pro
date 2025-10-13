"use client";

import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch current authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserEmail(user.attributes?.email || "Unknown");
      } catch (err) {
        console.log("No user signed in, redirecting to login...");
        router.push("/"); // redirect to login if not authenticated
      }
    };
    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    await Auth.signOut();
    router.push("/"); // back to login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-6xl font-bold text-[#0f172a]">AlignSync Pro Dashboard</h1>
        <p className="mt-2 text-lg text-[#334155]">
          Welcome back, {userEmail}!
        </p>
      </header>

      <main className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6 text-center">
        <p className="text-gray-700">This is your dashboard where your synced productivity lives.</p>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700"
        >
          Sign Out
        </button>
      </main>

      <footer className="mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

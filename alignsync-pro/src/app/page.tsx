"use client";

import { useAuth } from "react-oidc-context";
import Image from "next/image";

export default function LoginPage() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "3m2u0jjjd52c9oie6f2189976a";
    const logoutUri = "https://main.d1yv3ay871rrrx.amplifyapp.com/";
    const cognitoDomain = "https://<your-cognito-domain>"; // replace with your Cognito domain
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans bg-[#f5f5f5]">
      <header className="mb-12 text-center">
        <h1 className="text-6xl font-bold text-[#0f172a]">AlignSync Pro</h1>
        <p className="mt-2 text-lg text-[#334155]">Your productivity, synced and optimized</p>
      </header>

      <main className="bg-white p-10 rounded-xl shadow-lg w-full max-w-xl flex flex-col items-center gap-8">
        <Image
          src="/alignsync-logo.svg"
          alt="AlignSync Pro Logo"
          width={150}
          height={150}
          priority
        />

        {auth.isLoading ? (
          <p>Loading authentication...</p>
        ) : auth.error ? (
          <p className="text-red-600">Error: {auth.error.message}</p>
        ) : auth.isAuthenticated ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-semibold">Welcome, {auth.user?.profile.email}!</p>
            <button
              className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700"
              onClick={signOutRedirect}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
            onClick={() => auth.signinRedirect()}
          >
            Sign In
          </button>
        )}
      </main>
    </div>
  );
}

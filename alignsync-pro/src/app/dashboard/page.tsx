"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// -----------------------------------------------
// AlignSync Pro Dashboard (API-Ready Skeleton)
// -----------------------------------------------
export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // --- Primary Metrics (Top Cards) ---
  const [stats, setStats] = useState({
    totalPaidMembers: 0,
    provisionalMembers: 0,
    assetsActivity: 0,
    engagementRate: 0,
  });

  // --- User Type Distribution (Chart) ---
  const [userTypeData, setUserTypeData] = useState<
    { type: string; active: number }[]
  >([]);

  // --- Fetch Auth & Dashboard Data ---
  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        // ✅ Auth Check
        const session = await fetchAuthSession();
        const emailPayload = session.tokens?.idToken?.payload.email;
        const emailStr = typeof emailPayload === "string" ? emailPayload : "Unknown User";
        setUserEmail(emailStr);

        // #API: Replace mock data with call to `GET /api/dashboard/overview`
        setStats({
          totalPaidMembers: 128,
          provisionalMembers: 34,
          assetsActivity: 412,
          engagementRate: 78,
        });

        // #API: Replace with `/api/dashboard/user-distribution`
        setUserTypeData([
          { type: "Internal Users", active: 32 },
          { type: "External Users", active: 48 },
          { type: "Provisional Members", active: 20 },
          { type: "Paid Members", active: 60 },
        ]);
      } catch (err) {
        console.error("User not authenticated, redirecting...");
        router.push("/"); // redirect if unauthenticated
      }
    };

    fetchUserAndStats();
  }, [router]);

  // --- Sign Out Logic ---
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // --- Reusable Stat Card Component ---
  const StatCard = ({
    title,
    value,
    subtitle,
    buttonText,
    endpoint,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    buttonText: string;
    endpoint: string; // #API: endpoint this stat connects to
  }) => (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
        <p className="text-4xl font-extrabold text-blue-600 mt-3">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <button
        className="mt-5 bg-[#0f172a] text-white py-2 rounded-md font-semibold hover:bg-[#1e293b]"
        onClick={() => {
          // #API: Navigate or fetch more details from `${endpoint}`
          console.log(`Future API call to ${endpoint}`);
        }}
      >
        {buttonText}
      </button>
    </div>
  );

  // -----------------------------------------------
  // Render Layout
  // -----------------------------------------------
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">
            AlignSync Pro Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
        >
          Sign Out
        </button>
      </header>

      {/* Metrics Grid */}
      <main className="flex-1 px-10 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Paid Members"
          value={stats.totalPaidMembers}
          subtitle="Active subscriptions this month"
          buttonText="See More"
          endpoint="/api/members/paid"
        />
        <StatCard
          title="Provisional Members"
          value={stats.provisionalMembers}
          subtitle="Quarterly trials and onboarding"
          buttonText="See More"
          endpoint="/api/members/provisional"
        />
        <StatCard
          title="Assets & Workspaces"
          value={stats.assetsActivity}
          subtitle="Activities in the last 91 days"
          buttonText="See More"
          endpoint="/api/assets/overview"
        />
        <StatCard
          title="Engagement Rate"
          value={`${stats.engagementRate}%`}
          subtitle="Active users vs total members"
          buttonText="See More"
          endpoint="/api/engagement"
        />
      </main>

      {/* User Distribution Chart */}
      <section className="px-10 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">
            Active Users by Type
          </h2>
          {/* #API: Chart should fetch from `/api/dashboard/user-distribution` */}
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={userTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" fill="#2563eb" name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Placeholder for Future API Data */}
      <section className="px-10 pb-12">
        <div className="bg-white rounded-2xl p-8 shadow-md text-center text-gray-600">
          📊 <strong>Usage Trends & Growth Metrics</strong>  
          <p className="mt-2 text-sm text-gray-500">
            #API: Connect this block to `/api/dashboard/trends`  
            (Lambda function can analyze usage over time, returning engagement curve.)
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
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

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalPaidMembers: 0,
    provisionalMembers: 0,
    assetsActivity: 0,
    engagementRate: 0,
  });

  const [userTypeData, setUserTypeData] = useState<{ type: string; active: number }[]>([]);
  const [trueUpData, setTrueUpData] = useState<
    { name: string; currentTier: string; lastActive: string; status: string }[]
  >([]);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        const session = await fetchAuthSession();
        const emailPayload = session.tokens?.idToken?.payload.email;
        setUserEmail(typeof emailPayload === "string" ? emailPayload : "Unknown User");

        // Mock summary stats
        setStats({
          totalPaidMembers: 128,
          provisionalMembers: 34,
          assetsActivity: 412,
          engagementRate: 78,
        });

        // Mock bar chart data
        setUserTypeData([
          { type: "Internal Users", active: 32 },
          { type: "External Users", active: 48 },
          { type: "Provisional Members", active: 20 },
          { type: "Paid Members", active: 60 },
        ]);

        // Mock True-Up data — replace with future API `/api/members/true-up`
        setTrueUpData([
          { name: "Jane Cooper", currentTier: "Paid Member", lastActive: "2 days ago", status: "✅ In Sync" },
          { name: "Wade Warren", currentTier: "Provisional Member", lastActive: "5 days ago", status: "⚙️ Pending Upgrade" },
          { name: "Robert Fox", currentTier: "Guest", lastActive: "10 days ago", status: "❌ Remove Access" },
          { name: "Theresa Webb", currentTier: "Viewer", lastActive: "1 day ago", status: "✅ In Sync" },
          { name: "Devon Lane", currentTier: "Provisional Member", lastActive: "8 days ago", status: "⚠️ Review Needed" },
        ]);
      } catch (err) {
        console.error("User not authenticated, redirecting...");
        router.push("/");
      }
    };

    fetchUserAndStats();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const StatCard = ({ title, value, subtitle, buttonText, endpoint }: any) => (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
        <p className="text-4xl font-extrabold text-blue-600 mt-3">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <button
        className="mt-5 bg-[#0f172a] text-white py-2 rounded-md font-semibold hover:bg-[#1e293b]"
        onClick={() => console.log(`Future API call to ${endpoint}`)}
      >
        {buttonText}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      {/* Header with NavBar and Sign Out */}
      <header className="bg-white shadow-sm px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">AlignSync Pro Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userEmail}</p>
        </div>

        <div className="flex items-center space-x-8">
          <NavBar />
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <main className="flex-1 px-10 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Paid Members" value={stats.totalPaidMembers} subtitle="Active subscriptions this month" buttonText="See More" endpoint="/api/members/paid" />
        <StatCard title="Provisional Members" value={stats.provisionalMembers} subtitle="Quarterly trials and onboarding" buttonText="See More" endpoint="/api/members/provisional" />
        <StatCard title="Assets & Workspaces" value={stats.assetsActivity} subtitle="Activities in the last 91 days" buttonText="See More" endpoint="/api/assets/overview" />
        <StatCard title="Engagement Rate" value={`${stats.engagementRate}%`} subtitle="Active users vs total members" buttonText="See More" endpoint="/api/engagement" />
      </main>

      {/* User Distribution Chart */}
      <section className="px-10 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Active Users by Type</h2>
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

      {/* 🧩 True-Up Process Section */}
      <section className="px-10 pb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Member True-Up Process</h2>
          <p className="text-gray-600 mb-6">
            A reconciliation of all current users to ensure membership levels are correctly aligned.  
            Future API endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/members/true-up</code>
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
              <thead className="bg-[#f8fafc] border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Current Tier</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Last Active</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {trueUpData.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.currentTier}</td>
                    <td className="px-4 py-3">{user.lastActive}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        user.status.includes("✅")
                          ? "text-green-600"
                          : user.status.includes("⚙️")
                          ? "text-blue-600"
                          : user.status.includes("⚠️")
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Placeholder for Future API Data */}
      <section className="px-10 pb-12">
        <div className="bg-white rounded-2xl p-8 shadow-md text-center text-gray-600">
          📊 <strong>Usage Trends & Growth Metrics</strong>
          <p className="mt-2 text-sm text-gray-500">
            #API: Connect this block to <code>/api/dashboard/trends</code>
          </p>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

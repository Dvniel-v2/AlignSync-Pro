"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalPaidMembers: 0, provisionalMembers: 0, assetsActivity: 0, engagementRate: 0 });
  const [userTypeData, setUserTypeData] = useState<{ type: string; active: number }[]>([]);
  const [trueUpData, setTrueUpData] = useState<any[]>([]);
  const [loadingSync, setLoadingSync] = useState(false);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        const session = await fetchAuthSession();
        const emailPayload = session.tokens?.idToken?.payload.email;
        setUserEmail(typeof emailPayload === "string" ? emailPayload : "Unknown User");

        // Mock stats
        setStats({ totalPaidMembers: 128, provisionalMembers: 34, assetsActivity: 412, engagementRate: 78 });

        // Mock bar chart
        setUserTypeData([
          { type: "Internal Users", active: 32 },
          { type: "External Users", active: 48 },
          { type: "Provisional Members", active: 20 },
          { type: "Paid Members", active: 60 },
        ]);

        // Mock user data
        setTrueUpData([
          { name: "Jane Cooper", currentTier: "Paid Member", lastActive: "2 days ago", status: "✅ In Sync", lastAssets: "3 uploaded docs, 2 shared workspaces" },
          { name: "Wade Warren", currentTier: "Provisional Member", lastActive: "5 days ago", status: "⚙️ Pending Upgrade", lastAssets: "1 draft proposal, no recent uploads" },
          { name: "Robert Fox", currentTier: "Guest", lastActive: "10 days ago", status: "❌ Remove Access", lastAssets: "Viewed internal dashboard" },
          { name: "Theresa Webb", currentTier: "Viewer", lastActive: "1 day ago", status: "✅ In Sync", lastAssets: "2 asset downloads, 1 feedback log" },
          { name: "Devon Lane", currentTier: "Provisional Member", lastActive: "8 days ago", status: "⚠️ Review Needed", lastAssets: "No activity in 7 days" },
        ]);
      } catch (err) {
        console.error("User not authenticated, redirecting...");
        router.push("/");
      }
    };
    fetchUserAndStats();
  }, [router]);

  const handleSignOut = async () => {
    try { await signOut(); router.push("/"); } catch (err) { console.error("Error signing out:", err); }
  };

  const StatCard = ({ title, value, subtitle, endpoint }: any) => (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer" onClick={() => toast.info(`Mock API call to ${endpoint}`)}>
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
        <p className="text-4xl font-extrabold text-blue-600 mt-3">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );

  const handleSave = async () => {
    const pending = trueUpData.filter(u => u.status.includes("⚙️"));
    if (pending.length === 0) { toast.info("✅ No pending changes to sync."); return; }
    setLoadingSync(true);
    await new Promise(res => setTimeout(res, 1000));
    setTrueUpData(prev => prev.map(u => u.status.includes("⚙️") ? { ...u, status: "✅ Synced" } : u));
    setLoadingSync(false);
    toast.success(`✅ Synced ${pending.length} user(s) successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Header */}
      <header className="bg-white shadow-sm px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">AlignSync Pro Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userEmail}</p>
        </div>
        <div className="flex items-center space-x-8">
          <NavBar />
          <button onClick={handleSignOut} className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700">Sign Out</button>
        </div>
      </header>

      {/* Stats Cards */}
      <main className="flex-1 px-10 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Paid Members" value={stats.totalPaidMembers} subtitle="Active subscriptions this month" endpoint="/api/members/paid" />
        <StatCard title="Provisional Members" value={stats.provisionalMembers} subtitle="Quarterly trials and onboarding" endpoint="/api/members/provisional" />
        <StatCard title="Assets & Workspaces" value={stats.assetsActivity} subtitle="Activities in the last 91 days" endpoint="/api/assets/overview" />
        <StatCard title="Engagement Rate" value={`${stats.engagementRate}%`} subtitle="Active users vs total members" endpoint="/api/engagement" />
      </main>

      {/* Active Users Chart */}
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

      {/* Pending Provisional Members */}
      <section className="px-10 pb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Pending Provisional Members</h2>
          <p className="text-gray-600 mb-4">
            Quick view of provisional members pending upgrade. Click "See More" for detailed assets and activity.
          </p>

          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
              <thead className="bg-[#f8fafc] border-b sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Last Active</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Last Assets / Activity</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {trueUpData
                  .filter(u => u.currentTier === "Provisional Member" && u.status.includes("⚙️"))
                  .map((user, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.lastActive}</td>
                      <td className="px-4 py-3 text-gray-600">{user.lastAssets}</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{user.status}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/users/${encodeURIComponent(user.name)}`)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          See More
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-right flex items-center justify-end gap-4">
            {loadingSync && <ClipLoader size={20} color="#2563eb" />}
            <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 shadow-sm transition-colors">
              💾 Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Placeholder for Usage Trends */}
      <section className="px-10 pb-12">
        <div className="bg-white rounded-2xl p-8 shadow-md text-center text-gray-600">
          📊 <strong>Usage Trends & Growth Metrics</strong>
          <p className="mt-2 text-sm text-gray-500">#API: Connect this block to <code>/api/dashboard/trends</code></p>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

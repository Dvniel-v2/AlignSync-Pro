"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({
    members: 0,
    provisionalMembers: 0,
    guests: 0,
    viewers: 0,
    sheets: 0,
    workspaces: 0,
    reports: 0,
    dashboards: 0
  });
  const [userTypeData, setUserTypeData] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        const session = await fetchAuthSession();
        const emailPayload = session.tokens?.idToken?.payload.email;
        setUserEmail(typeof emailPayload === "string" ? emailPayload : "Unknown User");

        // Mock stats
        setStats({
          members: 128,
          provisionalMembers: 34,
          guests: 12,
          viewers: 56,
          sheets: 17184,
          workspaces: 1248,
          reports: 24937,
          dashboards: 6838
        });

        // Mock bar chart
        setUserTypeData([
          { type: "Members", value: 128, color: "#1f77b4" },
          { type: "Provisional Members", value: 34, color: "#ff7f0e" },
          { type: "Guest", value: 12, color: "#2ca02c" },
          { type: "Viewers", value: 56, color: "#d62728" },
        ]);

        // Mock pending provisional members
        setPendingUsers([
          { name: "Jane Cooper", lastActive: "2 days ago", lastAssets: "3 uploaded docs, 2 shared workspaces", status: "Pending" },
          { name: "Wade Warren", lastActive: "5 days ago", lastAssets: "1 draft proposal, no recent uploads", status: "Pending" },
          { name: "Devon Lane", lastActive: "8 days ago", lastAssets: "No activity in 7 days", status: "Pending" },
          { name: "Robert Fox", lastActive: "10 days ago", lastAssets: "Viewed internal dashboard", status: "Pending" },
          { name: "Theresa Webb", lastActive: "1 day ago", lastAssets: "2 asset downloads, 1 feedback log", status: "Pending" },
          { name: "Alex Morgan", lastActive: "7 days ago", lastAssets: "1 shared doc, 2 comments", status: "Pending" },
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

  const StatCard = ({ title, value, subtitle, expandKey, chartData }: any) => (
    <div
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer min-h-[150px]"
      onClick={() => setExpandedCard(expandedCard === expandKey ? null : expandKey)}
    >
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
        <p className="text-4xl font-extrabold text-blue-600 mt-3">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      <AnimatePresence>
        {expandedCard === expandKey && chartData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 320 }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                {chartData.map((item, i) => (
                  <Bar key={i} dataKey="value" fill={item.color} name={item.type} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

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
        <StatCard
          title="Seat / Member Types"
          value={stats.members + stats.provisionalMembers + stats.guests + stats.viewers}
          subtitle={`Members: ${stats.members} | Provisional: ${stats.provisionalMembers} | Guests: ${stats.guests} | Viewers: ${stats.viewers}`}
          expandKey="members"
          chartData={userTypeData}
        />
        <StatCard
          title="Assets"
          value={stats.sheets + stats.workspaces + stats.reports + stats.dashboards}
          subtitle={`Sheets: ${stats.sheets} | Workspaces: ${stats.workspaces} | Reports: ${stats.reports} | Dashboards: ${stats.dashboards}`}
          expandKey="assets"
          chartData={[
            { type: "Sheets", value: stats.sheets, color: "#1f77b4" },
            { type: "Workspaces", value: stats.workspaces, color: "#ff7f0e" },
            { type: "Reports", value: stats.reports, color: "#2ca02c" },
            { type: "Dashboards", value: stats.dashboards, color: "#d62728" },
          ]}
        />
        <StatCard
          title="Billing Cycle"
          value="$15,248"
          subtitle="Current month total"
          expandKey="billing"
          chartData={null}
        />
        <StatCard
          title="Payment Due"
          value="$2,487"
          subtitle="Due this month"
          expandKey="payment"
          chartData={null}
        />
      </main>

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
                {pendingUsers.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.lastActive}</td>
                    <td className="px-4 py-3 text-gray-600">{user.lastAssets}</td>
                    <td className="px-4 py-3 font-semibold text-yellow-600">{user.status}</td>
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

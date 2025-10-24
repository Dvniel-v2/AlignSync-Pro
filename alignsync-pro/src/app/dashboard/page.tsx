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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({
    members: 128,
    provisionalMembers: 34,
    guests: 12,
    viewers: 22,
    assetsActivity: 412,
    engagementRate: 78,
  });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loadingSync, setLoadingSync] = useState(false);

  // Expansion toggles for each section
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        const session = await fetchAuthSession();
        const emailPayload = session.tokens?.idToken?.payload.email;
        setUserEmail(typeof emailPayload === "string" ? emailPayload : "Unknown User");

        setPendingUsers([
          { name: "Jane Cooper", lastActive: "2 days ago", lastAssets: "3 uploaded docs", status: "Pending" },
          { name: "Wade Warren", lastActive: "5 days ago", lastAssets: "1 draft proposal", status: "Pending" },
          { name: "Devon Lane", lastActive: "8 days ago", lastAssets: "No activity", status: "Pending" },
          { name: "Robert Fox", lastActive: "10 days ago", lastAssets: "Viewed dashboard", status: "Pending" },
          { name: "Theresa Webb", lastActive: "1 day ago", lastAssets: "2 downloads", status: "Pending" },
          { name: "Alex Morgan", lastActive: "7 days ago", lastAssets: "1 shared doc", status: "Pending" },
        ]);
      } catch {
        router.push("/");
      }
    };
    fetchUserAndStats();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const toggleExpand = (card: string) => {
    setExpanded(expanded === card ? null : card);
  };

  const handleSave = async () => {
    toast.info("✅ No backend sync implemented yet.");
  };

  const seatBreakdownData = [
    { type: "Members", count: stats.members },
    { type: "Provisional Members", count: stats.provisionalMembers },
    { type: "Guests", count: stats.guests },
    { type: "Viewers", count: stats.viewers },
  ];

  const assetsBreakdownData = [
    { type: "Sheets", count: 17184 },
    { type: "Workspaces", count: 1248 },
    { type: "Reports", count: 24937 },
    { type: "Dashboards", count: 6838 },
  ];

  const billingBreakdownData = [
    { type: "Monthly", count: 120 },
    { type: "Quarterly", count: 25 },
    { type: "Annual", count: 10 },
  ];

  const paymentBreakdownData = [
    { type: "Paid", count: 2840 },
    { type: "Pending", count: 620 },
    { type: "Overdue", count: 140 },
  ];

  const ExpandableCard = ({ title, children }: any) => (
    <section className="px-10 pb-12">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
          <button
            onClick={() => setExpanded(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✖ Close
          </button>
        </div>
        {children}
      </div>
    </section>
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
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Stat Cards */}
      <main className="flex-1 px-10 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
          onClick={() => toggleExpand("seat")}
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Seat / Member Types</h2>
          <p>Members: {stats.members}</p>
          <p>Provisional: {stats.provisionalMembers}</p>
          <p>Guests: {stats.guests}</p>
          <p>Viewers: {stats.viewers}</p>
          <p className="text-sm text-gray-500 mt-4">Click to view details</p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
          onClick={() => toggleExpand("assets")}
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Assets & Workspaces</h2>
          <p>Sheets: 17,184</p>
          <p>Workspaces: 1,248</p>
          <p>Reports: 24,937</p>
          <p>Dashboards: 6,838</p>
          <p className="text-sm text-gray-500 mt-4">Click to view details</p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
          onClick={() => toggleExpand("billing")}
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Billing Cycle</h2>
          <p>Cycle: Monthly</p>
          <p>Next Renewal: Oct 31, 2025</p>
          <p>Auto-Renew: Enabled</p>
          <p className="text-sm text-gray-500 mt-4">Click to view breakdown</p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
          onClick={() => toggleExpand("payment")}
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Payment Due</h2>
          <p>Total Due: $2,840</p>
          <p>Next Invoice: Oct 31, 2025</p>
          <p>Status: Active</p>
          <p className="text-sm text-gray-500 mt-4">Click to view payment trends</p>
        </div>
      </main>

      {/* Expanded Card Dashboards */}
      {expanded === "seat" && (
        <ExpandableCard title="Seat / Member Type Breakdown">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={seatBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableCard>
      )}

      {expanded === "assets" && (
        <ExpandableCard title="Assets & Workspaces Breakdown">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={assetsBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableCard>
      )}

      {expanded === "billing" && (
        <ExpandableCard title="Billing Cycle Overview">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={billingBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableCard>
      )}

      {expanded === "payment" && (
        <ExpandableCard title="Payment Status Breakdown">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={paymentBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ExpandableCard>
      )}

      {/* Pending Members */}
      <section className="px-10 pb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Pending Provisional Members</h2>
          <p className="text-gray-600 mb-4">
            Quick view of provisional members pending upgrade.
          </p>
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
              <thead className="bg-[#f8fafc] border-b sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Last Assets / Activity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((u, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.lastActive}</td>
                    <td className="px-4 py-3 text-gray-600">{u.lastAssets}</td>
                    <td className="px-4 py-3 text-yellow-600 font-semibold">{u.status}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => router.push(`/users/${encodeURIComponent(u.name)}`)}
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
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 shadow-sm transition-colors"
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

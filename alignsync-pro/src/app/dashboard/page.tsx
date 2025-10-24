"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleExpand = (section: string) => setExpanded(expanded === section ? null : section);

  const seatBreakdownData = [
    { type: "Members", count: 128 },
    { type: "Provisional Members", count: 34 },
    { type: "Guests", count: 20 },
    { type: "Viewers", count: 15 },
  ];

  const assetsBreakdownData = [
    { type: "Sheets", count: 17184 },
    { type: "Workspaces", count: 1248 },
    { type: "Reports", count: 24937 },
    { type: "Dashboards", count: 6838 },
  ];

  const billingBreakdownData = [
    { type: "Monthly", count: 42 },
    { type: "Quarterly", count: 17 },
    { type: "Annual", count: 9 },
  ];

  const paymentBreakdownData = [
    { type: "Paid", count: 58 },
    { type: "Pending", count: 8 },
    { type: "Overdue", count: 3 },
  ];

  const pendingUsers = [
    { name: "Jane Cooper", lastActive: "2 days ago", lastAssets: "3 uploaded docs, 2 shared workspaces", status: "Pending" },
    { name: "Wade Warren", lastActive: "5 days ago", lastAssets: "1 draft proposal, no recent uploads", status: "Pending" },
    { name: "Devon Lane", lastActive: "8 days ago", lastAssets: "No activity in 7 days", status: "Pending" },
    { name: "Robert Fox", lastActive: "10 days ago", lastAssets: "Viewed internal dashboard", status: "Pending" },
    { name: "Theresa Webb", lastActive: "1 day ago", lastAssets: "2 asset downloads, 1 feedback log", status: "Pending" },
    { name: "Alex Morgan", lastActive: "7 days ago", lastAssets: "1 shared doc, 2 comments", status: "Pending" },
  ];

  const ExpandableCard = ({ title, children }: any) => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg p-8 mt-6"
    >
      <h2 className="text-2xl font-bold text-[#0f172a] mb-6">{title}</h2>
      {children}
    </motion.div>
  );

  const CardFooter = ({ label }: { label: string }) => (
    <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-1 transform transition-transform hover:scale-105">
      {label} <span className="text-gray-400">▼</span>
    </p>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">AlignSync Pro Dashboard</h1>
          <p className="text-gray-600">Overview of your environment</p>
        </div>
        <NavBar />
      </header>

      {/* Top Cards */}
      <main className="flex-1 px-10 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Seat / Member Types */}
        <div
          onClick={() => toggleExpand("seat")}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Seat / Member Types</h2>
            <p>Members: <span className="text-blue-600 font-semibold">128</span></p>
            <p>Provisional: <span className="text-blue-600 font-semibold">34</span></p>
            <p>Guests: <span className="text-blue-600 font-semibold">20</span></p>
            <p>Viewers: <span className="text-blue-600 font-semibold">15</span></p>
          </div>
          <CardFooter label="Click to view details" />
        </div>

        {/* Assets */}
        <div
          onClick={() => toggleExpand("assets")}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Assets & Workspaces</h2>
            <p>Sheets: <span className="text-blue-600 font-semibold">17,184</span></p>
            <p>Workspaces: <span className="text-blue-600 font-semibold">1,248</span></p>
            <p>Reports: <span className="text-blue-600 font-semibold">24,937</span></p>
            <p>Dashboards: <span className="text-blue-600 font-semibold">6,838</span></p>
          </div>
          <CardFooter label="Click to view details" />
        </div>

        {/* Billing */}
        <div
          onClick={() => toggleExpand("billing")}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Billing Cycle</h2>
            <p>Cycle: <span className="text-blue-600 font-semibold">Monthly</span></p>
            <p>Next Renewal: <span className="text-blue-600 font-semibold">Oct 31, 2025</span></p>
            <p>Auto-Renew: <span className="text-blue-600 font-semibold">Enabled</span></p>
          </div>
          <CardFooter label="Click to view breakdown" />
        </div>

        {/* Payment */}
        <div
          onClick={() => toggleExpand("payment")}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Payment Due</h2>
            <p>Total Due: <span className="text-blue-600 font-semibold">$2,840</span></p>
            <p>Next Invoice: <span className="text-blue-600 font-semibold">Oct 31, 2025</span></p>
            <p>Status: <span className="text-blue-600 font-semibold">Active</span></p>
          </div>
          <CardFooter label="Click to view payment trends" />
        </div>
      </main>

      {/* Expanded Chart Sections */}
      <AnimatePresence>
        {expanded === "seat" && (
          <ExpandableCard title="Seat / Member Type Breakdown">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={seatBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                {seatBreakdownData.map((item, i) => (
                  <Bar key={i} dataKey="count" fill={item.type === "Members" ? "#3b82f6" :
                                                     item.type === "Provisional Members" ? "#f59e0b" :
                                                     item.type === "Guests" ? "#10b981" : "#8b5cf6"} 
                       name={item.type} />
                ))}
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
                {assetsBreakdownData.map((item, i) => (
                  <Bar key={i} dataKey="count" fill={item.type === "Sheets" ? "#3b82f6" :
                                                     item.type === "Workspaces" ? "#22c55e" :
                                                     item.type === "Reports" ? "#f59e0b" : "#8b5cf6"} 
                       name={item.type} />
                ))}
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
                {billingBreakdownData.map((item, i) => (
                  <Bar key={i} dataKey="count" fill={item.type === "Monthly" ? "#3b82f6" :
                                                     item.type === "Quarterly" ? "#f59e0b" : "#10b981"} 
                       name={item.type} />
                ))}
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
                {paymentBreakdownData.map((item, i) => (
                  <Bar key={i} dataKey="count" fill={item.type === "Paid" ? "#3b82f6" :
                                                     item.type === "Pending" ? "#f59e0b" : "#ef4444"} 
                       name={item.type} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ExpandableCard>
        )}
      </AnimatePresence>

      {/* Pending Provisional Members */}
      <section className="px-10 pb-12">
        <div className="bg-white rounded-2xl shadow-md p-8 mt-6">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Pending Provisional Members</h2>
          <p className="text-gray-600 mb-4">
            Quick view of provisional members pending upgrade.
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
                        className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
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

      <footer className="text-center py-6 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

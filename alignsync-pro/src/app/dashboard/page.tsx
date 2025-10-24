"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
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
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Seat / Member Types</h2>
          <p>Members: <span className="text-blue-600 font-semibold">128</span></p>
          <p>Provisional: <span className="text-blue-600 font-semibold">34</span></p>
          <p>Guests: <span className="text-blue-600 font-semibold">20</span></p>
          <p>Viewers: <span className="text-blue-600 font-semibold">15</span></p>
          <p className="text-sm text-gray-500 mt-4">Click to view details</p>
        </div>

        {/* Assets */}
        <div
          onClick={() => toggleExpand("assets")}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Assets & Workspaces</h2>
          <p>Sheets: <span className="text-blue-600 font-semibold">17,184</span></p>
          <p>Workspaces: <span className="text-blue-600 font-semibold">1,248</span></p>
          <p>Reports: <span className="text-blue-600 font-semibold">24,937</span></p>
          <p>Dashboards: <span className="text-blue-600 font-semibold">6,838</span></p>
          <p className="text-sm text-gray-500 mt-4">Click to view details</p>
        </div>

        {/* Billing */}
        <div
          onClick={() => toggleExpand("billing")}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Billing Cycle</h2>
          <p>Cycle: <span className="text-blue-600 font-semibold">Monthly</span></p>
          <p>Next Renewal: <span className="text-blue-600 font-semibold">Oct 31, 2025</span></p>
          <p>Auto-Renew: <span className="text-blue-600 font-semibold">Enabled</span></p>
          <p className="text-sm text-gray-500 mt-4">Click to view breakdown</p>
        </div>

        {/* Payment */}
        <div
          onClick={() => toggleExpand("payment")}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl cursor-pointer transition"
        >
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Payment Due</h2>
          <p>Total Due: <span className="text-blue-600 font-semibold">$2,840</span></p>
          <p>Next Invoice: <span className="text-blue-600 font-semibold">Oct 31, 2025</span></p>
          <p>Status: <span className="text-blue-600 font-semibold">Active</span></p>
          <p className="text-sm text-gray-500 mt-4">Click to view payment trends</p>
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
                <Bar dataKey="count" fill="#3b82f6" name="Members" />
                <Bar dataKey="count" fill="#f59e0b" name="Provisional" />
                <Bar dataKey="count" fill="#10b981" name="Guests" />
                <Bar dataKey="count" fill="#8b5cf6" name="Viewers" />
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
                <Bar dataKey="count" fill="#3b82f6" name="Sheets" />
                <Bar dataKey="count" fill="#22c55e" name="Workspaces" />
                <Bar dataKey="count" fill="#f59e0b" name="Reports" />
                <Bar dataKey="count" fill="#8b5cf6" name="Dashboards" />
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
                <Bar dataKey="count" fill="#3b82f6" name="Monthly" />
                <Bar dataKey="count" fill="#f59e0b" name="Quarterly" />
                <Bar dataKey="count" fill="#10b981" name="Annual" />
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
                <Bar dataKey="count" fill="#3b82f6" name="Paid" />
                <Bar dataKey="count" fill="#f59e0b" name="Pending" />
                <Bar dataKey="count" fill="#ef4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </ExpandableCard>
        )}
      </AnimatePresence>

      <footer className="text-center py-6 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} AlignSync Pro. All rights reserved.
      </footer>
    </div>
  );
}

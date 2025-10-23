"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

export default function UserManagementPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingSync, setLoadingSync] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const session = await fetchAuthSession();
        const emailPayload = session.tokens?.idToken?.payload.email;
        setUserEmail(typeof emailPayload === "string" ? emailPayload : "Unknown User");

        // Mock data for user management page
        setUsers([
          { name: "Jane Cooper", currentTier: "Paid Member", lastActive: "2 days ago", status: "✅ Active", lastAssets: "3 uploaded docs, 2 shared workspaces" },
          { name: "Wade Warren", currentTier: "Provisional Member", lastActive: "5 days ago", status: "⚙️ Pending Upgrade", lastAssets: "1 draft proposal, no recent uploads" },
          { name: "Robert Fox", currentTier: "Guest", lastActive: "10 days ago", status: "❌ Remove Access", lastAssets: "Viewed internal dashboard" },
          { name: "Theresa Webb", currentTier: "Viewer", lastActive: "1 day ago", status: "✅ Active", lastAssets: "2 asset downloads, 1 feedback log" },
          { name: "Devon Lane", currentTier: "Provisional Member", lastActive: "8 days ago", status: "⚠️ Review Needed", lastAssets: "No activity in 7 days" },
        ]);
      } catch (err) {
        console.error("User not authenticated, redirecting...");
        router.push("/");
      }
    };
    fetchUsers();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const toggleSelect = (index: number) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const handleBulkChange = async (newTier: string) => {
    if (selectedUsers.size === 0) {
      toast.info("Select at least one user for bulk action.");
      return;
    }
    if (!confirm(`Are you sure you want to change ${selectedUsers.size} user(s) to ${newTier}?`)) return;

    setUsers(prev =>
      prev.map((u, i) =>
        selectedUsers.has(i) ? { ...u, currentTier: newTier, status: "⚙️ Pending Sync" } : u
      )
    );
    toast.success(`✅ ${selectedUsers.size} user(s) updated to ${newTier}`);
    setSelectedUsers(new Set());
  };

  const handleSave = async (index?: number) => {
    const targets = typeof index === "number" ? [index] : users.map((_, i) => i).filter(i => users[i].status.includes("⚙️"));
    if (targets.length === 0) {
      toast.info("No pending changes to sync.");
      return;
    }

    if (!confirm(`Are you sure you want to sync ${targets.length} user(s)?`)) return;

    setLoadingSync(true);
    await new Promise(res => setTimeout(res, 1000)); // mock API call

    setUsers(prev =>
      prev.map((u, i) =>
        targets.includes(i) && u.status.includes("⚙️") ? { ...u, status: "✅ Synced" } : u
      )
    );
    setLoadingSync(false);
    toast.success(`✅ Synced ${targets.length} user(s) successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <header className="bg-white shadow-sm px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">User Management</h1>
          <p className="text-gray-600">Welcome back, {userEmail}</p>
        </div>
        <div className="flex items-center space-x-8">
          <NavBar />
          <button onClick={handleSignOut} className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700">Sign Out</button>
        </div>
      </header>

      <section className="px-10 py-12 flex flex-col">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Pending / Active Users</h2>

          {/* Bulk Actions */}
          <div className="flex gap-3 mb-4">
            <select onChange={(e) => handleBulkChange(e.target.value)} className="border rounded-md px-3 py-1">
              <option>Bulk Actions</option>
              <option>Paid Member</option>
              <option>Provisional Member</option>
              <option>Guest</option>
              <option>Viewer</option>
              <option>Remove Access</option>
            </select>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
              <thead className="bg-[#f8fafc] border-b sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Select</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Current Tier</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Last Active</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Last Assets / Activity</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={selectedUsers.has(i)} onChange={() => toggleSelect(i)} />
                    </td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">
                      <select value={user.currentTier} onChange={(e) => setUsers(prev => prev.map((u, idx) => idx === i ? { ...u, currentTier: e.target.value, status: "⚙️ Pending Sync" } : u))} className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                        <option>Paid Member</option>
                        <option>Provisional Member</option>
                        <option>Guest</option>
                        <option>Viewer</option>
                        <option>Remove Access</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{user.lastActive}</td>
                    <td className="px-4 py-3 text-gray-600">{user.lastAssets}</td>
                    <td className={`px-4 py-3 font-semibold ${user.status.includes("✅") ? "text-green-600" : user.status.includes("⚙️") ? "text-blue-600" : user.status.includes("⚠️") ? "text-yellow-600" : "text-red-600"}`}>{user.status}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleSave(i)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">💾 Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loadingSync && <div className="mt-4 flex justify-center"><ClipLoader size={25} color="#2563eb" /></div>}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

export default function UserManagementPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingSync, setLoadingSync] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await fetchAuthSession();
        const emailPayload = session.tokens?.idToken?.payload.email;
        setUserEmail(typeof emailPayload === "string" ? emailPayload : "Unknown User");

        // Mock users data
        setUsers([
          { 
            name: "Jane Cooper", 
            currentTier: "Paid Member", 
            lastActive: "2 days ago", 
            status: "✅ Active", 
            lastAssets: "3 uploaded docs, 2 shared workspaces", 
            pendingProvisional: false, 
            memberSince: "2023-01-15" 
          },
          { 
            name: "Wade Warren", 
            currentTier: "Provisional Member", 
            lastActive: "5 days ago", 
            status: "⚙️ Pending Upgrade", 
            lastAssets: "1 draft proposal, no recent uploads", 
            pendingProvisional: true, 
            memberSince: "2025-01-01" 
          },
          { 
            name: "Robert Fox", 
            currentTier: "Guest", 
            lastActive: "10 days ago", 
            status: "❌ Remove Access", 
            lastAssets: "Viewed internal dashboard", 
            pendingProvisional: false, 
            memberSince: "2022-12-20" 
          },
          { 
            name: "Theresa Webb", 
            currentTier: "Viewer", 
            lastActive: "1 day ago", 
            status: "✅ Active", 
            lastAssets: "2 asset downloads, 1 feedback log", 
            pendingProvisional: false, 
            memberSince: "2023-05-05" 
          },
          { 
            name: "Devon Lane", 
            currentTier: "Provisional Member", 
            lastActive: "8 days ago", 
            status: "⚠️ Review Needed", 
            lastAssets: "No activity in 7 days", 
            pendingProvisional: true, 
            memberSince: "2025-01-10" 
          },
        ]);
      } catch (err) {
        console.error("User not authenticated, redirecting...");
        router.push("/");
      }
    };
    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    try { await signOut(); router.push("/"); } catch (err) { console.error(err); }
  };

  const handleSave = async (userIndex: number) => {
    const user = users[userIndex];
    if(!confirm(`Are you sure you want to sync changes for ${user.name}?`)) return;

    setLoadingSync(true);
    await new Promise(res => setTimeout(res, 1000));

    setUsers(prev => prev.map((u, i) => i === userIndex ? { ...u, status: "✅ Synced" } : u));
    setLoadingSync(false);
    toast.success(`✅ ${user.name} synced successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      
      <header className="bg-white shadow-sm px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">User Management</h1>
          <p className="text-gray-600">Welcome back, {userEmail}</p>
        </div>
        <div className="flex items-center

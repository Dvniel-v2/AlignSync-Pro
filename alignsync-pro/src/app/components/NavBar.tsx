"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "User Management", href: "/user-management" },
    { label: "Historical Logs", href: "/logs" },
    { label: "Assets", href: "/assets" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 ${
            pathname === item.href ? "text-blue-600 border-b-2 border-blue-600" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

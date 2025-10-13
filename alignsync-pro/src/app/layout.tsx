import type { Metadata } from "next";
import "./globals.css";
import AuthProviderWrapper from "./Providers/AuthProviderWrapper";

export const metadata: Metadata = {
  title: "AlignSync Pro",
  description: "AlignSync Pro - productivity synced and optimized",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}

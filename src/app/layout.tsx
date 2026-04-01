import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { SecurityBanner } from "@/components/security-banner";
import { RecentPinnedSidebar } from "@/components/recent-pinned-sidebar";

export const metadata: Metadata = {
  title: "Security Architect Refresher",
  description: "Mobile-first security and compliance knowledge base",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body className="font-sans antialiased bg-gray-50">
        <SecurityBanner />
        <TopNav />
        <div className="flex">
          <RecentPinnedSidebar />
          <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
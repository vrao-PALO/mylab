"use client";

import { RoleModeProvider } from "@/components/role-mode";
import { TopNav } from "@/components/top-nav";
import { SecurityBanner } from "@/components/security-banner";
import { RecentPinnedSidebar } from "@/components/recent-pinned-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleModeProvider>
      <SecurityBanner />
      <TopNav />
      <div className="flex">
        <RecentPinnedSidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </RoleModeProvider>
  );
}
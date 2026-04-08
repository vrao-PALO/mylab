"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Topic {
  path: string;
  title: string;
  timestamp: number;
}

function getRecentTopics(): Topic[] {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem("recentTopics");
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored) as Topic[];
    return parsed.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  } catch (e) {
    console.error("Failed to parse recent topics", e);
    return [];
  }
}

export function RecentPinnedSidebar() {
  const [recent] = React.useState<Topic[]>(getRecentTopics);

  const pinned = [
    { path: "/intake", title: "?? Intake" },
    { path: "/scope", title: "?? Scope" },
    { path: "/inputs", title: "?? Data Inputs" },
    { path: "/risk-exceptions", title: "?? Risks" },
  ];

  return (
    <aside className="hidden lg:block w-48 flex-shrink-0 border-r border-gray-200 bg-gray-50 p-4">
      <div className="space-y-6 text-sm">
        {/* Pinned Topics */}
        <div>
          <div className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wide">
            ?? Quick Access
          </div>
          <ul className="space-y-1">
            {pinned.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="flex items-center gap-2 text-blue-600 hover:underline">
                  {item.title}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Topics */}
        {recent.length > 0 && (
          <div>
            <div className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wide">
              ?? Recently Viewed
            </div>
            <ul className="space-y-1">
              {recent.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    {item.title}
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

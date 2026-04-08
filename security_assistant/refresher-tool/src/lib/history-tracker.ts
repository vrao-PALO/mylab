/**
 * Track navigation history for recent topics sidebar.
 * Called from layout or via middleware.
 */

interface RecentTopic {
  path: string;
  title: string;
  timestamp: number;
}

export function trackPageVisit(path: string, title: string): void {
  const stored = localStorage.getItem("recentTopics");
  let recent: RecentTopic[] = [];

  if (stored) {
    try {
      recent = JSON.parse(stored) as RecentTopic[];
    } catch (e) {
      console.warn("Failed to parse recent topics", e);
    }
  }

  // Remove if already exists (to avoid duplicates in recent list)
  recent = recent.filter((item) => item.path !== path);

  // Add to front
  recent.unshift({ path, title, timestamp: Date.now() });

  // Keep only last 20 (sidebar will show only top 5)
  recent = recent.slice(0, 20);

  localStorage.setItem("recentTopics", JSON.stringify(recent));
}

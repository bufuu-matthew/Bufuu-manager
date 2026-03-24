export type Platform =
  | "Gmail"
  | "Outlook"
  | "Twitter"
  | "Instagram"
  | "LinkedIn"
  | "Facebook"
  | "TikTok"
  | string;

export function getPlatformColor(platform: Platform): string {
  const map: Record<string, string> = {
    Gmail: "#EA4335",
    Outlook: "#0078D4",
    Twitter: "#1DA1F2",
    Instagram: "#E1306C",
    LinkedIn: "#0A66C2",
    Facebook: "#1877F2",
    TikTok: "#00C4CC",
  };
  return map[platform] ?? "#6B7280";
}

export function getPlatformBg(platform: Platform): string {
  const map: Record<string, string> = {
    Gmail: "bg-red-600/20 text-red-400",
    Outlook: "bg-blue-600/20 text-blue-400",
    Twitter: "bg-sky-500/20 text-sky-400",
    Instagram: "bg-pink-600/20 text-pink-400",
    LinkedIn: "bg-blue-700/20 text-blue-300",
    Facebook: "bg-indigo-600/20 text-indigo-400",
    TikTok: "bg-teal-600/20 text-teal-400",
  };
  return map[platform] ?? "bg-gray-600/20 text-gray-400";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatTimestamp(ts: bigint): string {
  const ms = Number(ts);
  const date = new Date(ms);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

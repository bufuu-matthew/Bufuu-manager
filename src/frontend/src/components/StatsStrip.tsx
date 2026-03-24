import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Mail, TrendingDown, TrendingUp, Users } from "lucide-react";
import type { DashboardStats } from "../backend.d";

interface StatsStripProps {
  stats: DashboardStats | null | undefined;
  isLoading: boolean;
}

export function StatsStrip({ stats, isLoading }: StatsStripProps) {
  const cards = [
    {
      label: "Total Clients",
      value: stats ? Number(stats.totalAccounts) : 0,
      icon: Users,
      trend: "+3 this month",
      up: true,
    },
    {
      label: "Active Accounts",
      value: stats ? Number(stats.activeCount) : 0,
      icon: TrendingUp,
      trend: `${stats ? Number(stats.disconnectedCount) : 0} disconnected`,
      up: false,
    },
    {
      label: "Unread Messages",
      value: stats ? Number(stats.unreadMessageCount) : 0,
      icon: Mail,
      trend: "Across all inboxes",
      up: false,
    },
    {
      label: "Scheduled Posts",
      value: 7,
      icon: Calendar,
      trend: "Next 7 days",
      up: true,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 px-6 pt-5 pb-4 shrink-0">
      {cards.map((card, i) => (
        <div
          key={card.label}
          data-ocid={`stats.card.${i + 1}`}
          className="bg-card rounded-lg border border-border p-4"
        >
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </>
          ) : (
            <>
              <div className="flex items-start justify-between mb-1">
                <span className="text-3xl font-bold text-foreground tabular-nums">
                  {card.value.toLocaleString()}
                </span>
                <card.icon size={16} className="text-muted-foreground mt-1" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {card.label}
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                {card.up ? (
                  <TrendingUp size={10} className="text-status-active" />
                ) : (
                  <TrendingDown size={10} className="text-status-idle" />
                )}
                {card.trend}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

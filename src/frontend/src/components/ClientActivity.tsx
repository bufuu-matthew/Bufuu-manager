import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SocialMediaAccount } from "../backend.d";
import {
  formatTimestamp,
  getInitials,
  getPlatformBg,
  getPlatformColor,
} from "../lib/platformUtils";

interface ClientActivityProps {
  accounts: SocialMediaAccount[];
}

export function ClientActivity({ accounts }: ClientActivityProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 p-6">
        {accounts.map((account, idx) => (
          <div
            key={account.id.toString()}
            data-ocid={`activity.account.item.${idx + 1}`}
            className="bg-card border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: getPlatformColor(account.platform) }}
              >
                {getInitials(account.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {account.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {account.clientName}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge
                className={`text-[10px] border-none ${getPlatformBg(account.platform)}`}
              >
                {account.platform}
              </Badge>
              <span
                className={`text-[10px] font-semibold ${
                  account.status === "Active"
                    ? "text-status-active"
                    : account.status === "Idle"
                      ? "text-status-idle"
                      : "text-status-disconnected"
                }`}
              >
                {account.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Last active: {formatTimestamp(account.lastActivity)}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

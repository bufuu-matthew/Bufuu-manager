import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Search } from "lucide-react";
import { useState } from "react";
import type { SocialMediaAccount } from "../backend.d";
import { getInitials, getPlatformColor } from "../lib/platformUtils";

interface ClientSidebarProps {
  accounts: SocialMediaAccount[];
  isLoading: boolean;
  collapsed: boolean;
  onToggle: () => void;
  selectedAccountId: bigint | null;
  onSelectAccount: (id: bigint | null) => void;
}

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "Active"
      ? "bg-status-active"
      : status === "Idle"
        ? "bg-status-idle"
        : "bg-status-disconnected";
  return <span className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />;
}

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export function ClientSidebar({
  accounts,
  isLoading,
  collapsed,
  onToggle,
  selectedAccountId,
  onSelectAccount,
}: ClientSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.clientName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col shrink-0 bg-sidebar border-r border-border overflow-hidden transition-all duration-300"
      style={{ width: collapsed ? 0 : 260 }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="text-sm font-semibold text-foreground whitespace-nowrap">
          Client Profiles
        </span>
        <button
          type="button"
          data-ocid="sidebar.toggle"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground transition-colors ml-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            data-ocid="sidebar.search_input"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs bg-accent border-border"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-1">
          {isLoading
            ? SKELETON_KEYS.map((k) => (
                <div key={k} className="flex items-center gap-2 px-3 py-2">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
              ))
            : filtered.map((account, idx) => (
                <button
                  type="button"
                  key={account.id.toString()}
                  data-ocid={`sidebar.account.item.${idx + 1}`}
                  onClick={() =>
                    onSelectAccount(
                      selectedAccountId === account.id ? null : account.id,
                    )
                  }
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-accent/60 ${
                    selectedAccountId === account.id
                      ? "bg-brand-blue/10 border-l-2 border-brand-blue"
                      : ""
                  }`}
                  style={{ minHeight: 44 }}
                >
                  <StatusDot status={account.status} />
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{
                      backgroundColor: getPlatformColor(account.platform),
                    }}
                  >
                    {getInitials(account.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {account.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {account.platform} · {account.status}
                    </p>
                  </div>
                </button>
              ))}
          {!isLoading && filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              No accounts found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

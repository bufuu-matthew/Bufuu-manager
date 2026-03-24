import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  PenSquare,
  Search,
  Zap,
} from "lucide-react";

interface TopBarProps {
  unreadCount: number;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onCompose: () => void;
}

export function TopBar({
  unreadCount,
  sidebarCollapsed,
  onSidebarToggle,
  onCompose,
}: TopBarProps) {
  return (
    <header className="h-14 shrink-0 flex items-center gap-4 px-4 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        {sidebarCollapsed && (
          <button
            type="button"
            data-ocid="topbar.sidebar_toggle"
            onClick={onSidebarToggle}
            className="text-muted-foreground hover:text-foreground transition-colors mr-1"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <Zap className="w-5 h-5 text-brand-blue" />
        <span className="text-base font-semibold text-foreground">
          SocialCommand
        </span>
      </div>

      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          data-ocid="topbar.search_input"
          placeholder="Search messages, accounts…"
          className="pl-9 h-8 text-sm bg-accent border-border"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          data-ocid="topbar.notifications.button"
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[9px] bg-destructive border-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </button>

        <Button
          data-ocid="topbar.compose.primary_button"
          size="sm"
          onClick={onCompose}
          className="h-8 px-3 text-xs bg-brand-blue hover:bg-brand-blue/80 text-white border-none gap-1.5"
        >
          <PenSquare size={13} />
          Compose Post
        </Button>

        <button
          type="button"
          data-ocid="topbar.user.button"
          className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-brand-blue/30 text-brand-blue">
              SJ
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-xs font-medium text-foreground leading-tight">
              Sarah J.
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Agency Manager
            </p>
          </div>
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

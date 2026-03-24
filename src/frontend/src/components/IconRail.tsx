import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart2,
  Inbox,
  LayoutDashboard,
  PenSquare,
  Settings,
  Zap,
} from "lucide-react";

interface IconRailProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onComposeClick: () => void;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "inbox", icon: Inbox, label: "Inbox" },
  { id: "compose", icon: PenSquare, label: "Compose Post" },
  { id: "analytics", icon: BarChart2, label: "Analytics" },
];

const bottomItems = [{ id: "settings", icon: Settings, label: "Settings" }];

export function IconRail({
  activeView,
  onViewChange,
  onComposeClick,
}: IconRailProps) {
  return (
    <div className="flex flex-col items-center w-14 shrink-0 bg-card border-r border-border py-3 gap-1">
      <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center mb-3">
        <Zap className="w-4 h-4 text-brand-blue" />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                data-ocid={`nav.${item.id}.button`}
                onClick={() =>
                  item.id === "compose"
                    ? onComposeClick()
                    : onViewChange(item.id)
                }
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activeView === item.id
                    ? "bg-brand-blue/20 text-brand-blue"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                data-ocid={`nav.${item.id}.button`}
                onClick={() => onViewChange(item.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activeView === item.id
                    ? "bg-brand-blue/20 text-brand-blue"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

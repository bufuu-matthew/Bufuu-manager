import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const TEAM_MEMBERS = [
  {
    name: "Sarah Johnson",
    role: "Agency Manager",
    initials: "SJ",
    color: "#2F7AF6",
    status: "Online",
    accounts: 45,
  },
  {
    name: "Marcus Chen",
    role: "Social Strategist",
    initials: "MC",
    color: "#2ECC71",
    status: "Online",
    accounts: 12,
  },
  {
    name: "Priya Patel",
    role: "Content Creator",
    initials: "PP",
    color: "#E1306C",
    status: "Away",
    accounts: 8,
  },
  {
    name: "Diego Alvarez",
    role: "Account Executive",
    initials: "DA",
    color: "#F2C14E",
    status: "Offline",
    accounts: 15,
  },
  {
    name: "Aisha Williams",
    role: "Analytics Lead",
    initials: "AW",
    color: "#00C4CC",
    status: "Online",
    accounts: 10,
  },
];

export function TeamTab() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={member.name}
            data-ocid={`team.member.item.${idx + 1}`}
            className="bg-card border border-border rounded-xl p-4 hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback
                  className="text-sm font-bold text-white"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {member.name}
                </p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge
                className={`text-[10px] border-none ${
                  member.status === "Online"
                    ? "bg-status-active/20 text-status-active"
                    : member.status === "Away"
                      ? "bg-status-idle/20 text-status-idle"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {member.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {member.accounts} accounts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

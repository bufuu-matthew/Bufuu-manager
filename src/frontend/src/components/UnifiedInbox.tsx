import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, MailOpen, Star } from "lucide-react";
import { useState } from "react";
import type { Message } from "../backend.d";
import { useMarkRead, useMarkStarred } from "../hooks/useQueries";
import {
  formatTimestamp,
  getInitials,
  getPlatformBg,
  getPlatformColor,
} from "../lib/platformUtils";

interface UnifiedInboxProps {
  messages: Message[];
  isLoading: boolean;
  selectedAccountId: bigint | null;
}

type Filter = "all" | "gmail" | "outlook" | "social";

const SOCIAL_PLATFORMS = [
  "Twitter",
  "Instagram",
  "LinkedIn",
  "Facebook",
  "TikTok",
];
const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export function UnifiedInbox({
  messages,
  isLoading,
  selectedAccountId,
}: UnifiedInboxProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const markRead = useMarkRead();
  const markStarred = useMarkStarred();

  let displayed = selectedAccountId
    ? messages.filter((m) => m.accountId === selectedAccountId)
    : messages;

  if (filter === "gmail")
    displayed = displayed.filter((m) => m.platform === "Gmail");
  else if (filter === "outlook")
    displayed = displayed.filter((m) => m.platform === "Outlook");
  else if (filter === "social")
    displayed = displayed.filter((m) => SOCIAL_PLATFORMS.includes(m.platform));

  if (unreadOnly) displayed = displayed.filter((m) => !m.isRead);
  if (starredOnly) displayed = displayed.filter((m) => m.isStarred);

  const filterDefs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "gmail", label: "Gmail" },
    { id: "outlook", label: "Outlook" },
    { id: "social", label: "Social" },
  ];

  function handleRowClick(msg: Message) {
    const idStr = msg.id.toString();
    setExpandedId((prev) => (prev === idStr ? null : idStr));
    if (!msg.isRead) {
      markRead.mutate({ id: msg.id, isRead: true });
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border shrink-0 flex-wrap">
        <div className="flex gap-1 bg-accent rounded-lg p-0.5">
          {filterDefs.map((f) => (
            <button
              type="button"
              key={f.id}
              data-ocid={`inbox.${f.id}.tab`}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-ocid="inbox.unread.toggle"
          onClick={() => setUnreadOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
            unreadOnly
              ? "bg-brand-blue/20 text-brand-blue border-brand-blue/30"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <MailOpen size={12} />
          Unread
        </button>
        <button
          type="button"
          data-ocid="inbox.starred.toggle"
          onClick={() => setStarredOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
            starredOnly
              ? "bg-status-idle/20 text-status-idle border-status-idle/30"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star size={12} />
          Starred
        </button>
        <span className="ml-auto text-xs text-muted-foreground">
          {displayed.length} messages
        </span>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="px-6 py-3 space-y-2">
            {SKELETON_KEYS.map((k) => (
              <div key={k} className="flex items-center gap-3 py-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div
            data-ocid="inbox.empty_state"
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          >
            <Mail size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No messages found</p>
            <p className="text-xs mt-1 opacity-70">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          displayed.map((msg, idx) => (
            <MessageRow
              key={msg.id.toString()}
              msg={msg}
              idx={idx}
              expanded={expandedId === msg.id.toString()}
              onClick={() => handleRowClick(msg)}
              onStarClick={(e) => {
                e.stopPropagation();
                markStarred.mutate({ id: msg.id, isStarred: !msg.isStarred });
              }}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
}

interface MessageRowProps {
  msg: Message;
  idx: number;
  expanded: boolean;
  onClick: () => void;
  onStarClick: (e: React.MouseEvent) => void;
}

function MessageRow({
  msg,
  idx,
  expanded,
  onClick,
  onStarClick,
}: MessageRowProps) {
  return (
    <button
      type="button"
      data-ocid={`inbox.message.item.${idx + 1}`}
      onClick={onClick}
      className={`group w-full text-left flex items-start gap-3 px-6 cursor-pointer transition-colors border-b border-border/50 ${
        expanded ? "bg-brand-blue/5" : "hover:bg-accent/50"
      }`}
      style={{ minHeight: 64 }}
    >
      <div className="flex items-center self-stretch pt-[22px]">
        <div
          className={`w-1.5 h-1.5 rounded-full transition-opacity ${!msg.isRead ? "bg-brand-blue" : "opacity-0"}`}
        />
      </div>

      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-[12px]"
        style={{ backgroundColor: getPlatformColor(msg.platform) }}
      >
        {getInitials(msg.sender)}
      </div>

      <div className="flex-1 min-w-0 py-3">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-sm ${!msg.isRead ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}
          >
            {msg.sender}
          </span>
          <Badge
            className={`text-[10px] px-1.5 py-0 h-4 font-medium border-none ${getPlatformBg(msg.platform)}`}
          >
            {msg.platform}
          </Badge>
        </div>
        <p
          className={`text-sm leading-snug truncate ${!msg.isRead ? "font-semibold text-foreground" : "text-muted-foreground"}`}
        >
          {msg.subject}
        </p>
        {expanded ? (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {msg.preview}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground truncate">
            {msg.preview}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 pt-3 shrink-0">
        <span className="text-[11px] text-muted-foreground">
          {formatTimestamp(msg.timestamp)}
        </span>
        <button
          type="button"
          data-ocid={`inbox.star.button.${idx + 1}`}
          onClick={onStarClick}
          className={`transition-colors ${msg.isStarred ? "text-status-idle" : "text-muted-foreground/30 group-hover:text-muted-foreground"}`}
        >
          <Star size={13} fill={msg.isStarred ? "currentColor" : "none"} />
        </button>
      </div>
    </button>
  );
}

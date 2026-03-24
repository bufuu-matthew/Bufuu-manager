import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Clock, ImagePlus, Send, Square, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SocialMediaAccount } from "../backend.d";
import { useCreatePost } from "../hooks/useQueries";
import {
  getInitials,
  getPlatformBg,
  getPlatformColor,
} from "../lib/platformUtils";

const PLATFORM_ICONS: Record<string, string> = {
  Facebook: "F",
  Instagram: "IG",
  LinkedIn: "in",
  Twitter: "X",
  TikTok: "TT",
  Gmail: "G",
  Outlook: "O",
};

const ALL_PLATFORMS = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Twitter",
  "TikTok",
  "Gmail",
  "Outlook",
];

interface GlobalPostComposerProps {
  accounts: SocialMediaAccount[];
  onClose: () => void;
}

export function GlobalPostComposer({
  accounts,
  onClose,
}: GlobalPostComposerProps) {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "Twitter",
    "LinkedIn",
  ]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(
    new Set(),
  );
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const createPost = useCreatePost();

  const MAX_CHARS = 280;
  const charPct = Math.min((content.length / MAX_CHARS) * 100, 100);

  const filteredAccounts = accounts.filter((a) =>
    selectedPlatforms.includes(a.platform),
  );

  function togglePlatform(p: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  function toggleAccount(id: string) {
    setSelectedAccountIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedAccountIds.size === filteredAccounts.length) {
      setSelectedAccountIds(new Set());
    } else {
      setSelectedAccountIds(
        new Set(filteredAccounts.map((a) => a.id.toString())),
      );
    }
  }

  async function handleSubmit() {
    if (!content.trim()) {
      toast.error("Please enter some content to post.");
      return;
    }
    if (selectedAccountIds.size === 0) {
      toast.error("Please select at least one account.");
      return;
    }
    const targetAccountIds = filteredAccounts
      .filter((a) => selectedAccountIds.has(a.id.toString()))
      .map((a) => a.id);
    try {
      await createPost.mutateAsync({
        id: 0n,
        content,
        targetAccountIds,
        status: scheduleMode === "now" ? "published" : "scheduled",
        createdAt: BigInt(Date.now()),
      });
      toast.success(`Post published to ${targetAccountIds.length} account(s)!`);
      onClose();
    } catch {
      toast.error("Failed to create post. Please try again.");
    }
  }

  function handleOverlayKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleOverlayKey}
    >
      <div
        data-ocid="composer.modal"
        className="w-full max-w-[640px] mx-4 bg-popover border border-border rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-card rounded-t-xl">
          <h2 className="text-sm font-semibold text-foreground">
            Global Post Composer
          </h2>
          <button
            type="button"
            data-ocid="composer.close_button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Content
                </span>
                <span
                  className={`text-xs font-mono ${content.length > MAX_CHARS ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {content.length}/{MAX_CHARS}
                </span>
              </div>
              <div className="relative">
                <Textarea
                  data-ocid="composer.content.textarea"
                  placeholder="What do you want to share today?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] bg-accent border-border resize-none text-sm"
                />
                <div className="absolute bottom-2 right-2 w-24 h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${charPct >= 100 ? "bg-destructive" : charPct > 80 ? "bg-status-idle" : "bg-brand-blue"}`}
                    style={{ width: `${charPct}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-medium text-muted-foreground block mb-2">
                Publish to platforms
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_PLATFORMS.map((p) => (
                  <button
                    type="button"
                    key={p}
                    data-ocid="composer.platform.toggle"
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      selectedPlatforms.includes(p)
                        ? "border-transparent text-white"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    style={{
                      backgroundColor: selectedPlatforms.includes(p)
                        ? getPlatformColor(p)
                        : undefined,
                    }}
                  >
                    <span className="font-bold text-sm">
                      {PLATFORM_ICONS[p]}
                    </span>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {filteredAccounts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Select accounts
                  </span>
                  <button
                    type="button"
                    data-ocid="composer.select_all.toggle"
                    onClick={selectAll}
                    className="flex items-center gap-1 text-xs text-brand-blue hover:underline"
                  >
                    {selectedAccountIds.size === filteredAccounts.length ? (
                      <>
                        <CheckSquare size={12} /> Deselect all
                      </>
                    ) : (
                      <>
                        <Square size={12} /> Select all
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-accent rounded-lg border border-border divide-y divide-border max-h-48 overflow-y-auto">
                  {filteredAccounts.map((account, idx) => (
                    <div
                      key={account.id.toString()}
                      data-ocid={`composer.account.item.${idx + 1}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-card/50 transition-colors"
                    >
                      <Checkbox
                        data-ocid={`composer.account.checkbox.${idx + 1}`}
                        id={`acc-${account.id}`}
                        checked={selectedAccountIds.has(account.id.toString())}
                        onCheckedChange={() =>
                          toggleAccount(account.id.toString())
                        }
                      />
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{
                          backgroundColor: getPlatformColor(account.platform),
                        }}
                      >
                        {getInitials(account.name)}
                      </div>
                      <Label
                        htmlFor={`acc-${account.id}`}
                        className="flex-1 text-xs font-medium cursor-pointer"
                      >
                        {account.name}
                      </Label>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${getPlatformBg(account.platform)}`}
                      >
                        {account.platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              data-ocid="composer.media.dropzone"
              className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-blue/50 transition-colors w-full"
            >
              <ImagePlus size={20} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">+ Add Media</p>
              <p className="text-[10px] text-muted-foreground/60">
                PNG, JPG, GIF, MP4 up to 50MB
              </p>
            </button>

            <div>
              <span className="text-xs font-medium text-muted-foreground block mb-2">
                When to publish
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="composer.publish_now.toggle"
                  onClick={() => setScheduleMode("now")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border ${
                    scheduleMode === "now"
                      ? "bg-brand-blue/20 text-brand-blue border-brand-blue/30"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Send size={12} />
                  Publish Now
                </button>
                <button
                  type="button"
                  data-ocid="composer.schedule.toggle"
                  onClick={() => setScheduleMode("schedule")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors border ${
                    scheduleMode === "schedule"
                      ? "bg-brand-blue/20 text-brand-blue border-brand-blue/30"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock size={12} />
                  Schedule
                </button>
                {scheduleMode === "schedule" && (
                  <input
                    data-ocid="composer.schedule_time.input"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="flex-1 bg-accent border border-border rounded-lg px-3 text-xs text-foreground"
                  />
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-card rounded-b-xl">
          <span className="text-xs text-muted-foreground">
            {selectedAccountIds.size > 0 ? (
              <span className="bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-md font-semibold">
                {selectedAccountIds.size} account
                {selectedAccountIds.size !== 1 ? "s" : ""} selected
              </span>
            ) : (
              "No accounts selected"
            )}
          </span>
          <div className="flex gap-2">
            <Button
              data-ocid="composer.save_draft.button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs border-border"
            >
              Save Draft
            </Button>
            <Button
              data-ocid="composer.create_post.primary_button"
              size="sm"
              onClick={handleSubmit}
              disabled={createPost.isPending}
              className="h-8 text-xs bg-brand-blue hover:bg-brand-blue/80 text-white border-none"
            >
              {createPost.isPending ? "Publishing…" : "Create Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

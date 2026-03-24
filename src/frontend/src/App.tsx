import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ClientActivity } from "./components/ClientActivity";
import { ClientSidebar } from "./components/ClientSidebar";
import { GlobalPostComposer } from "./components/GlobalPostComposer";
import { IconRail } from "./components/IconRail";
import { ReportingTab } from "./components/ReportingTab";
import { StatsStrip } from "./components/StatsStrip";
import { TeamTab } from "./components/TeamTab";
import { TopBar } from "./components/TopBar";
import { UnifiedInbox } from "./components/UnifiedInbox";
import { useActor } from "./hooks/useActor";
import {
  useAccounts,
  useDashboardStats,
  useMessages,
  useSeedData,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

function AppInner() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedAccountId, setSelectedAccountId] = useState<bigint | null>(
    null,
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const seededRef = useRef(false);

  const { actor, isFetching: actorLoading } = useActor();
  const { mutate: seedMutate } = useSeedData();

  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: messages = [], isLoading: messagesLoading } = useMessages();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  useEffect(() => {
    if (actor && !actorLoading && !seededRef.current) {
      seededRef.current = true;
      seedMutate();
    }
  }, [actor, actorLoading, seedMutate]);

  const unreadCount = stats ? Number(stats.unreadMessageCount) : 0;

  return (
    <div className="flex h-full w-full overflow-hidden dark">
      <TooltipProvider delayDuration={300}>
        <IconRail
          activeView={activeView}
          onViewChange={setActiveView}
          onComposeClick={() => setComposerOpen(true)}
        />

        <ClientSidebar
          accounts={accounts}
          isLoading={accountsLoading}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar
            unreadCount={unreadCount}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={() => setSidebarCollapsed(false)}
            onCompose={() => setComposerOpen(true)}
          />

          <div className="flex flex-col flex-1 overflow-hidden">
            <StatsStrip stats={stats} isLoading={statsLoading} />

            <Tabs
              defaultValue="inbox"
              className="flex flex-col flex-1 overflow-hidden px-6"
            >
              <TabsList className="shrink-0 bg-transparent border-b border-border rounded-none h-9 gap-0 p-0 justify-start mb-0">
                {[
                  { value: "inbox", label: "Unified Inbox" },
                  { value: "activity", label: "Client Activity" },
                  { value: "reporting", label: "Reporting" },
                  { value: "team", label: "Team" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    data-ocid={`tabs.${tab.value}.tab`}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:text-foreground data-[state=active]:bg-transparent text-muted-foreground text-xs font-medium px-4 h-9"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent
                value="inbox"
                className="flex flex-col flex-1 overflow-hidden mt-0 border-0 p-0"
              >
                <UnifiedInbox
                  messages={messages}
                  isLoading={messagesLoading}
                  selectedAccountId={selectedAccountId}
                />
              </TabsContent>
              <TabsContent
                value="activity"
                className="flex flex-col flex-1 overflow-hidden mt-0 border-0 p-0"
              >
                <ClientActivity accounts={accounts} />
              </TabsContent>
              <TabsContent
                value="reporting"
                className="flex flex-col flex-1 overflow-hidden mt-0 border-0 p-0"
              >
                <ReportingTab />
              </TabsContent>
              <TabsContent
                value="team"
                className="flex flex-col flex-1 overflow-hidden mt-0 border-0 p-0"
              >
                <TeamTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {composerOpen && (
          <GlobalPostComposer
            accounts={accounts}
            onClose={() => setComposerOpen(false)}
          />
        )}

        <Toaster position="bottom-right" />
      </TooltipProvider>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

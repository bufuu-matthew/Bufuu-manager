import { BarChart2 } from "lucide-react";

export function ReportingTab() {
  const bars = [
    { label: "Mon", value: 65 },
    { label: "Tue", value: 82 },
    { label: "Wed", value: 74 },
    { label: "Thu", value: 91 },
    { label: "Fri", value: 58 },
    { label: "Sat", value: 43 },
    { label: "Sun", value: 37 },
  ];
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={18} className="text-brand-blue" />
          <h3 className="text-sm font-semibold text-foreground">
            Weekly Engagement Overview
          </h3>
          <span className="ml-auto text-xs text-muted-foreground">
            Last 7 days
          </span>
        </div>
        <div className="flex items-end gap-4 h-48">
          {bars.map((bar) => (
            <div
              key={bar.label}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-muted-foreground">
                {bar.value}%
              </span>
              <div
                className="w-full rounded-t-sm bg-brand-blue/20 relative overflow-hidden"
                style={{ height: "100%" }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-brand-blue rounded-t-sm transition-all"
                  style={{ height: `${(bar.value / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{bar.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Avg. Engagement", value: "3.8%" },
            { label: "Total Reach", value: "142K" },
            { label: "Posts Published", value: "47" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-accent rounded-lg p-3 text-center"
            >
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

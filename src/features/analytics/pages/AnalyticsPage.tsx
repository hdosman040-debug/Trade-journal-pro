import { useState } from "react";
import { useJournal } from "../../../store/JournalContext";
import { RiskMetricsCard } from "../components/RiskMetricsCard";
import { PlaybookPerformanceChart } from "../components/PlaybookPerformanceChart";
import { PsychologyCorrelation } from "../components/PsychologyCorrelation";
import { Percent, TrendingUp, BarChart3, HelpCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

type AnalyticsTab = "RISK" | "PLAYBOOKS" | "PSYCHOLOGY";

export function AnalyticsPage() {
  const { trades } = useJournal();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("RISK");

  const hasClosedTrades = trades.some((t) => t.status === "CLOSED");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-bold text-foreground">Performance Analytics</h1>
        <p className="text-[10px] text-foreground-muted">Deep quantitative calculations and behavioral audits</p>
      </div>

      {hasClosedTrades ? (
        <>
          {/* Segmented Selector Sub-tabs for clean mobile viewports */}
          <div className="grid grid-cols-3 p-1 bg-background-card border border-border rounded-xl">
            <button
              onClick={() => setActiveTab("RISK")}
              className={cn(
                "py-2 text-[10px] font-bold rounded-lg transition-all no-tap-highlight cursor-pointer flex items-center justify-center space-x-1.5",
                activeTab === "RISK"
                  ? "bg-background border border-border text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              <Percent className="w-3.5 h-3.5 text-trade-long" />
              <span>Risk & Expectancy</span>
            </button>

            <button
              onClick={() => setActiveTab("PLAYBOOKS")}
              className={cn(
                "py-2 text-[10px] font-bold rounded-lg transition-all no-tap-highlight cursor-pointer flex items-center justify-center space-x-1.5",
                activeTab === "PLAYBOOKS"
                  ? "bg-background border border-border text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              <BarChart3 className="w-3.5 h-3.5 text-trade-profit" />
              <span>Setup Edge</span>
            </button>

            <button
              onClick={() => setActiveTab("PSYCHOLOGY")}
              className={cn(
                "py-2 text-[10px] font-bold rounded-lg transition-all no-tap-highlight cursor-pointer flex items-center justify-center space-x-1.5",
                activeTab === "PSYCHOLOGY"
                  ? "bg-background border border-border text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5 text-trade-loss" />
              <span>Behavioral Audit</span>
            </button>
          </div>

          {/* Dynamic Tab renders */}
          <div className="space-y-4">
            {activeTab === "RISK" && <RiskMetricsCard />}
            {activeTab === "PLAYBOOKS" && <PlaybookPerformanceChart />}
            {activeTab === "PSYCHOLOGY" && <PsychologyCorrelation />}
          </div>
        </>
      ) : (
        <div className="bg-background-card border border-border rounded-xl p-8 text-center max-w-sm mx-auto space-y-3">
          <div className="p-3 bg-background-surface border border-border rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6 text-foreground-dim" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Quantitative Diagnostics Lock</h3>
            <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
              Log closed trade transactions under your journal ledger to enable mathematical analytics calculators, risk indices, and behavior audits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
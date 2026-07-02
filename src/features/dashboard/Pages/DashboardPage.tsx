import { useJournal } from "../../../store/JournalContext";
import { StatsGrid } from "../components/StatsGrid";
import { EquityChart } from "../components/EquityChart";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowUpRight, ArrowDownRight, ArrowRight, Wallet } from "lucide-react";
import { formatCurrency, formatPercent } from "../../../lib/utils";
import { cn } from "../../../lib/utils";

export function DashboardPage() {
  const { metrics, equityCurve, trades } = useJournal();

  // Pick the latest 3 trades chronologically to display as Recent Activity
  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const hasClosedTrades = trades.some((t) => t.status === "CLOSED");

  return (
    <div className="space-y-4">
      {/* Account Balance Header */}
      <div className="p-4 bg-background-card border border-border rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-trade-long-soft border border-trade-long/20">
            <Wallet className="w-5 h-5 text-trade-long" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-foreground-muted tracking-wider uppercase">
              Current Account Balance
            </p>
            <h1 className="text-xl font-bold font-mono text-foreground mt-0.5">
              {formatCurrency(metrics.currentBalance)}
            </h1>
          </div>
        </div>

        <Link
          to="/trade/new"
          className="flex items-center space-x-1 bg-trade-long hover:bg-trade-long/90 text-white text-xs font-semibold py-2 px-3 rounded-xl shadow-glow-profit no-tap-highlight cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Trade</span>
        </Link>
      </div>

      {/* Visual Analytics Canvas (Guard renders chart only if closed data points are present) */}
      {hasClosedTrades ? (
        <EquityChart data={equityCurve} />
      ) : (
        <div className="bg-background-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-foreground">No historical data recorded</p>
          <p className="text-xs text-foreground-muted mt-1 max-w-xs mx-auto">
            Close your first open trade using the journal to generate visual equity curves and performance statistics.
          </p>
        </div>
      )}

      {/* Statistical Grid Panel */}
      <StatsGrid metrics={metrics} />

      {/* Recent Trade Log Feed */}
      <div className="bg-background-card border border-border rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
            Recent Activity
          </h2>
          <Link
            to="/journal"
            className="flex items-center space-x-1 text-trade-long hover:text-trade-long/80 text-[10px] font-semibold tracking-wide no-tap-highlight"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTrades.length > 0 ? (
          <div className="divide-y divide-border/60">
            {recentTrades.map((trade) => {
              const isProfit = trade.pnl !== undefined && trade.pnl >= 0;
              const isClosed = trade.status === "CLOSED";

              return (
                <div key={trade.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={cn(
                        "p-1.5 rounded-lg border",
                        trade.direction === "LONG"
                          ? "bg-trade-long-soft border-trade-long/20 text-trade-long"
                          : "bg-trade-loss-soft border-trade-loss/20 text-trade-loss"
                      )}
                    >
                      {trade.direction === "LONG" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-foreground tracking-wide">{trade.asset}</span>
                        <span className="text-[8px] font-bold uppercase px-1 rounded bg-background-surface border border-border/80 text-foreground-dim">
                          {trade.direction}
                        </span>
                      </div>
                      <span className="text-[10px] text-foreground-dim">
                        {new Date(trade.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {isClosed ? (
                      <>
                        <p className={cn("text-xs font-bold font-mono", isProfit ? "text-trade-profit" : "text-trade-loss")}>
                          {isProfit ? "+" : ""}
                          {formatCurrency(trade.pnl || 0)}
                        </p>
                        <p className="text-[9px] text-foreground-dim font-mono">
                          {formatPercent(trade.pnlPercentage || 0)}
                        </p>
                      </>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-trade-short px-2 py-0.5 bg-trade-short/10 border border-trade-short/20 rounded-md">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xs text-foreground-dim py-4">No active logs recorded yet.</p>
        )}
      </div>
    </div>
  );
}
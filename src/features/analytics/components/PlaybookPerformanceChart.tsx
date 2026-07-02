import { useJournal } from "../../../store/JournalContext";
import { formatCurrency } from "../../../lib/utils";
import { BookOpen, HelpCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

export function PlaybookPerformanceChart() {
  const { trades, playbooks } = useJournal();

  // Map each playbook to its performance metrics
  const playbookStats = playbooks.map((pb) => {
    const pbTrades = trades.filter((t) => t.playbookId === pb.id && t.status === "CLOSED");
    const total = pbTrades.length;
    const wins = pbTrades.filter((t) => (t.pnl || 0) > 0).length;
    const netProfit = pbTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      ...pb,
      total,
      winRate,
      netProfit,
    };
  }).filter(stat => stat.total > 0); // Only evaluate playbooks with trade data

  // Determine maximum absolute profit for proportional scaling
  const maxProfit = Math.max(...playbookStats.map(s => Math.abs(s.netProfit)), 1);

  return (
    <div className="bg-background-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-4 h-4 text-trade-long" />
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Playbook Performance Metrics</h2>
      </div>

      {playbookStats.length > 0 ? (
        <div className="space-y-4.5">
          {playbookStats.map((pb) => {
            const isPositive = pb.netProfit >= 0;
            const barWidth = (Math.abs(pb.netProfit) / maxProfit) * 100;

            return (
              <div key={pb.id} className="space-y-2">
                <div className="flex items-start justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-foreground">{pb.name}</h3>
                    <p className="text-[9px] text-foreground-dim uppercase font-mono mt-0.5">
                      Executed: <strong className="text-foreground">{pb.total}</strong> | Win Rate: <strong className="text-trade-long">{pb.winRate.toFixed(1)}%</strong>
                    </p>
                  </div>
                  <span className={cn("font-bold font-mono", isPositive ? "text-trade-profit" : "text-trade-loss")}>
                    {isPositive ? "+" : ""}
                    {formatCurrency(pb.netProfit)}
                  </span>
                </div>

                {/* Custom proportional bar chart */}
                <div className="relative w-full h-2 rounded-full bg-background-surface overflow-hidden border border-border/40">
                  <div
                    style={{
                      width: `${barWidth}%`,
                      marginLeft: isPositive ? "0" : "auto", // Right-align negative, left-align positive for symmetry
                    }}
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isPositive ? "bg-trade-profit shadow-glow-profit" : "bg-trade-loss shadow-glow-loss"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 flex flex-col items-center justify-center space-y-2">
          <HelpCircle className="w-6 h-6 text-foreground-dim" />
          <p className="text-xs text-foreground-dim">Assign playbook setups to closed trades to trace statistical edge charts.</p>
        </div>
      )}
    </div>
  );
}
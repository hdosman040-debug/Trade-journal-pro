import { useJournal } from "../../../store/JournalContext";
import { formatCurrency } from "../../../lib/utils";
import { BrainCircuit, Star, AlertCircle, Smile } from "lucide-react";
import { cn } from "../../../lib/utils";

export function PsychologyCorrelation() {
  const { trades, psychologyLogs } = useJournal();

  // 1. Discipline Rating Correlation (Trades with 4-5 stars vs 1-2 stars)
  const closedTrades = trades.filter((t) => t.status === "CLOSED");
  
  const highDisciplineTrades = closedTrades.filter((t) => (t.rating || 5) >= 4);
  const lowDisciplineTrades = closedTrades.filter((t) => (t.rating || 5) <= 2);

  const avgHighPnL = highDisciplineTrades.length > 0
    ? highDisciplineTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / highDisciplineTrades.length
    : 0;

  const avgLowPnL = lowDisciplineTrades.length > 0
    ? lowDisciplineTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / lowDisciplineTrades.length
    : 0;

  // 2. Behavioral Triggers Analysis
  const triggerFrequencies: { [key: string]: number } = {};
  psychologyLogs.forEach((log) => {
    log.triggers.forEach((trigger) => {
      triggerFrequencies[trigger] = (triggerFrequencies[trigger] || 0) + 1;
    });
  });

  const activeTriggers = Object.entries(triggerFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Get top 3 triggers

  return (
    <div className="bg-background-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <BrainCircuit className="w-4 h-4 text-trade-loss" />
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Psychological Behavior Audit</h2>
      </div>

      {/* Discipline Rating vs Profit Outcome */}
      <div className="space-y-3 border-b border-border/50 pb-3.5">
        <span className="text-[10px] font-bold text-foreground-muted block uppercase">Execution Discipline Correlation</span>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-background-surface border border-border rounded-xl space-y-1">
            <div className="flex items-center space-x-1 text-trade-profit">
              <Star className="w-3.5 h-3.5 fill-trade-profit" />
              <span className="text-[9px] font-bold uppercase">High Discipline</span>
            </div>
            <p className={cn("text-xs font-bold font-mono", avgHighPnL >= 0 ? "text-trade-profit" : "text-trade-loss")}>
              {avgHighPnL >= 0 ? "+" : ""}
              {formatCurrency(avgHighPnL)} avg PnL
            </p>
            <span className="text-[8px] text-foreground-dim block uppercase">Rating of 4 - 5 stars</span>
          </div>

          <div className="p-3 bg-background-surface border border-border rounded-xl space-y-1">
            <div className="flex items-center space-x-1 text-trade-loss">
              <Star className="w-3.5 h-3.5 fill-trade-loss" />
              <span className="text-[9px] font-bold uppercase">Low Discipline</span>
            </div>
            <p className={cn("text-xs font-bold font-mono", avgLowPnL >= 0 ? "text-trade-profit" : "text-trade-loss")}>
              {avgLowPnL >= 0 ? "+" : ""}
              {formatCurrency(avgLowPnL)} avg PnL
            </p>
            <span className="text-[8px] text-foreground-dim block uppercase">Rating of 1 - 2 stars</span>
          </div>
        </div>
      </div>

      {/* Behavioral cognitive biases */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-bold text-foreground-muted block uppercase">Vulnerability Alerts</span>

        {activeTriggers.length > 0 ? (
          <div className="space-y-2">
            {activeTriggers.map(([trigger, count]) => (
              <div key={trigger} className="flex items-center justify-between p-2.5 bg-trade-loss-soft border border-trade-loss/20 rounded-lg">
                <div className="flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-trade-loss" />
                  <span className="text-foreground font-semibold">{trigger}</span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-background-card border border-border/80 px-2 py-0.5 rounded text-foreground-muted">
                  Logged: {count} times
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-2.5 bg-trade-profit-soft border border-trade-profit/20 rounded-lg text-xs">
            <Smile className="w-4 h-4 text-trade-profit" />
            <p className="text-foreground-muted">No mental bias triggers are active. Composition is focused.</p>
          </div>
        )}
      </div>
    </div>
  );
}
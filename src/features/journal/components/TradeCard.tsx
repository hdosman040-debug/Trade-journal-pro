import { Trade } from "../../../types/trade";
import { useJournal } from "../../../store/JournalContext";
import { formatCurrency, formatPercent } from "../../../lib/utils";
import { Star, Trash2, Calendar, Target, Shield, HelpCircle, CheckSquare } from "lucide-react";
import { cn } from "../../../lib/utils";

interface TradeCardProps {
  trade: Trade;
  onResolveRequest: (trade: Trade) => void;
}

export function TradeCard({ trade, onResolveRequest }: TradeCardProps) {
  const { playbooks, deleteTrade } = useJournal();

  // Find assigned playbook name
  const playbook = playbooks.find((p) => p.id === trade.playbookId);
  const isClosed = trade.status === "CLOSED";
  const isProfit = trade.pnl !== undefined && trade.pnl >= 0;

  return (
    <div className="bg-background-card border border-border rounded-xl p-4 space-y-3.5 shadow-card-shadow relative overflow-hidden">
      {/* Visual orientation strip flag */}
      <div className={cn("absolute top-0 left-0 w-1 h-full", trade.direction === "LONG" ? "bg-trade-long" : "bg-trade-loss")} />

      {/* Card Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm tracking-wide text-foreground">{trade.asset}</span>
          <span
            className={cn(
              "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border",
              trade.direction === "LONG"
                ? "bg-trade-long-soft border-trade-long/20 text-trade-long"
                : "bg-trade-loss-soft border-trade-loss/20 text-trade-loss"
            )}
          >
            {trade.direction}
          </span>
          {playbook && (
            <span className="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-background-surface border border-border/80 text-foreground-muted truncate max-w-[100px]">
              {playbook.name}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isClosed ? (
            <span className="text-[9px] font-bold tracking-wider uppercase bg-background-surface text-foreground-dim border border-border/80 px-2 py-0.5 rounded-md">
              CLOSED
            </span>
          ) : (
            <span className="text-[9px] font-bold tracking-wider uppercase bg-trade-short-soft text-trade-short border border-trade-short/20 px-2 py-0.5 rounded-md animate-pulse">
              ACTIVE
            </span>
          )}
          <button
            onClick={() => deleteTrade(trade.id)}
            className="p-1 rounded-md text-foreground-dim hover:text-trade-loss transition-colors no-tap-highlight"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Parameters Matrix Grid */}
      <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-xs font-mono">
        <div>
          <span className="text-[9px] text-foreground-dim block uppercase">Position Size</span>
          <span className="text-foreground font-semibold">{trade.size}</span>
        </div>
        <div>
          <span className="text-[9px] text-foreground-dim block uppercase">Entry Level</span>
          <span className="text-foreground font-semibold">{trade.entryPrice.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[9px] text-foreground-dim block uppercase">Exit Level</span>
          <span className="text-foreground font-semibold">
            {isClosed && trade.exitPrice ? trade.exitPrice.toLocaleString() : "—"}
          </span>
        </div>

        {/* Protection points layer */}
        <div className="flex items-center space-x-1">
          <Shield className="w-3.5 h-3.5 text-trade-loss" />
          <div>
            <span className="text-[8px] text-foreground-dim block uppercase">Stop Loss</span>
            <span className="text-foreground font-semibold">{trade.stopLoss ? trade.stopLoss.toLocaleString() : "None"}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Target className="w-3.5 h-3.5 text-trade-profit" />
          <div>
            <span className="text-[8px] text-foreground-dim block uppercase">Take Profit</span>
            <span className="text-foreground font-semibold">{trade.takeProfit ? trade.takeProfit.toLocaleString() : "None"}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-foreground-dim" />
          <div>
            <span className="text-[8px] text-foreground-dim block uppercase">Logged Date</span>
            <span className="text-foreground font-semibold">
              {new Date(trade.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Trade Commentary Section */}
      {trade.notes && (
        <div className="p-2 bg-background-surface rounded-lg border border-border/80 text-xs text-foreground-muted">
          {trade.notes}
        </div>
      )}

      {/* Card Footer row: Performance Outcome or Active Resolve CTA */}
      <div className="border-t border-border/60 pt-3 flex items-center justify-between">
        {isClosed ? (
          <>
            <div className="flex items-center space-x-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3.5 h-3.5",
                    star <= (trade.rating || 5) ? "fill-trade-short text-trade-short" : "text-border"
                  )}
                />
              ))}
            </div>

            <div className="text-right">
              <span className={cn("text-sm font-bold font-mono tracking-tight", isProfit ? "text-trade-profit" : "text-trade-loss")}>
                {isProfit ? "+" : ""}
                {formatCurrency(trade.pnl || 0)}
              </span>
              <span className="text-[10px] text-foreground-dim font-mono ml-1.5">
                ({formatPercent(trade.pnlPercentage || 0)})
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1.5 text-[10px] text-trade-short font-medium">
              <HelpCircle className="w-4 h-4 animate-spin" />
              <span>Realizing active risk...</span>
            </div>
            <button
              onClick={() => onResolveRequest(trade)}
              className="bg-trade-long hover:bg-trade-long/90 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-glow-profit flex items-center space-x-1 no-tap-highlight cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Resolve Position</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
import { useJournal } from "../../../store/JournalContext";
import { formatCurrency } from "../../../lib/utils";
import { Scale, Target, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/utils";

export function RiskMetricsCard() {
  const { metrics } = useJournal();

  const winRateDecimal = metrics.winRate / 100;
  const lossRateDecimal = 1 - winRateDecimal;

  // Expectancy = (Win Rate * Avg Win) - (Loss Rate * Avg Loss)
  const expectancy = (winRateDecimal * metrics.averageWin) - (lossRateDecimal * metrics.averageLoss);

  // Risk to Reward ratio (R:R)
  const riskRewardRatio = metrics.averageLoss > 0 ? metrics.averageWin / metrics.averageLoss : 0;

  // Proportional weight for average win/loss visual bar
  const totalBarWeight = metrics.averageWin + metrics.averageLoss;
  const winPercent = totalBarWeight > 0 ? (metrics.averageWin / totalBarWeight) * 100 : 50;
  const lossPercent = totalBarWeight > 0 ? (metrics.averageLoss / totalBarWeight) * 100 : 50;

  return (
    <div className="bg-background-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Scale className="w-4 h-4 text-trade-long" />
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Risk & Expectancy Matrices</h2>
      </div>

      {/* Expectancy Display */}
      <div className="grid grid-cols-2 gap-4 border-b border-border/50 pb-3.5">
        <div className="p-3 bg-background-surface border border-border rounded-lg">
          <span className="text-[10px] font-bold text-foreground-muted block uppercase">Trading Expectancy</span>
          <p className={cn("text-base font-bold font-mono mt-1", expectancy >= 0 ? "text-trade-profit" : "text-trade-loss")}>
            {expectancy >= 0 ? "+" : ""}
            {formatCurrency(expectancy)}
          </p>
          <span className="text-[8px] text-foreground-dim block mt-0.5 uppercase">Expected return per trade</span>
        </div>

        <div className="p-3 bg-background-surface border border-border rounded-lg">
          <span className="text-[10px] font-bold text-foreground-muted block uppercase">Risk Reward (R:R) Ratio</span>
          <p className="text-base font-bold font-mono text-foreground mt-1">
            1 : {riskRewardRatio.toFixed(2)}
          </p>
          <span className="text-[8px] text-foreground-dim block mt-0.5 uppercase">Ratio of avg win size</span>
        </div>
      </div>

      {/* Win / Loss sizing comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-trade-profit" />
            <span className="text-foreground-muted">Avg Win:</span>
            <span className="text-trade-profit font-mono">{formatCurrency(metrics.averageWin)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-foreground-muted">Avg Loss:</span>
            <span className="text-trade-loss font-mono">{formatCurrency(metrics.averageLoss)}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-trade-loss" />
          </div>
        </div>

        {/* Proportional visual comparison bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-border/40">
          <div
            style={{ width: `${winPercent}%` }}
            className="bg-trade-profit h-full transition-all duration-500 shadow-glow-profit"
          />
          <div
            style={{ width: `${lossPercent}%` }}
            className="bg-trade-loss h-full transition-all duration-500 shadow-glow-loss"
          />
        </div>
        
        <div className="flex justify-between text-[8px] text-foreground-dim uppercase font-bold tracking-wider font-mono">
          <span>Profit Weight ({winPercent.toFixed(0)}%)</span>
          <span>Risk Weight ({lossPercent.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}
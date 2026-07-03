import { AccountMetrics } from "../../../types/trade";
import { formatCurrency, formatPercent } from "../../../lib/utils";
import { TrendingUp, Percent, Award, ShieldAlert } from "lucide-react";
import { cn } from "../../../lib/utils";

interface StatsGridProps {
  metrics: AccountMetrics;
}

export function StatsGrid({ metrics }: StatsGridProps) {
  const profitFactorColor = (val: number) => {
    if (val >= 1.5) return "text-trade-profit"; // Excellent performance
    if (val >= 1.0) return "text-trade-short";  // Breakeven/Moderate performance
    return "text-trade-loss";                   // Negative system
  };

  const statCards = [
    {
      title: "Net Profit / PnL",
      value: formatCurrency(metrics.netProfit),
      percent: formatPercent((metrics.netProfit / metrics.initialBalance) * 100),
      icon: TrendingUp,
      valueClass: metrics.netProfit >= 0 ? "text-trade-profit" : "text-trade-loss",
      accent: metrics.netProfit >= 0 ? "bg-trade-profit-soft" : "bg-trade-loss-soft",
    },
    {
      title: "Win Rate",
      value: `${metrics.winRate}%`,
      percent: `out of ${metrics.closedTrades} closed`,
      icon: Percent,
      valueClass: "text-foreground",
      accent: "bg-background-surface",
    },
    {
      title: "Profit Factor",
      value: metrics.profitFactor.toFixed(2),
      percent: "gross ratio",
      icon: Award,
      valueClass: profitFactorColor(metrics.profitFactor),
      accent: "bg-background-surface",
    },
    {
      title: "Max Drawdown",
      value: `${metrics.maxDrawdownPercentage}%`,
      percent: "historical peak",
      icon: ShieldAlert,
      valueClass: metrics.maxDrawdownPercentage > 10 ? "text-trade-loss" : "text-trade-short",
      accent: "bg-background-surface",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="bg-background-card border border-border rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wide">
                {card.title}
              </span>
              <div className={cn("p-1.5 rounded-lg border border-border/40", card.accent)}>
                <Icon className="w-3.5 h-3.5 text-foreground-dim" />
              </div>
            </div>
            
            <div className="mt-3">
              <p className={cn("text-base font-bold font-mono tracking-tight", card.valueClass)}>
                {card.value}
              </p>
              <p className="text-[9px] text-foreground-dim font-medium tracking-wide mt-0.5">
                {card.percent}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
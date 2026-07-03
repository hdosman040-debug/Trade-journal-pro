import { Trade, AccountMetrics, EquityCurvePoint } from "../types/trade";

export function calculateTradePnL(
  direction: "LONG" | "SHORT",
  entry: number,
  exit: number,
  size: number
): { pnl: number; pnlPercentage: number } {
  const diff = direction === "LONG" ? exit - entry : entry - exit;
  const pnl = diff * size;
  const pnlPercentage = (diff / entry) * 100;
  return { pnl: Number(pnl.toFixed(2)), pnlPercentage: Number(pnlPercentage.toFixed(2)) };
}

export function calculateAccountMetrics(trades: Trade[], initialBalance: number = 10000): AccountMetrics {
  const closedTrades = trades.filter((t) => t.status === "CLOSED");
  const openTrades = trades.filter((t) => t.status === "OPEN");
  let netProfit = 0, wins = 0, losses = 0, grossProfit = 0, grossLoss = 0, winSum = 0, lossSum = 0;

  closedTrades.forEach((trade) => {
    const pnl = trade.pnl || 0;
    netProfit += pnl;
    if (pnl > 0) { wins++; grossProfit += pnl; winSum += pnl; }
    else if (pnl < 0) { losses++; grossLoss += Math.abs(pnl); lossSum += Math.abs(pnl); }
  });

  const totalClosed = closedTrades.length;
  const winRate = totalClosed > 0 ? (wins / totalClosed) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;
  const averageWin = wins > 0 ? winSum / wins : 0;
  const averageLoss = losses > 0 ? lossSum / losses : 0;

  let peak = initialBalance, maxDrawdown = 0, currentBalance = initialBalance;
  [...closedTrades]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((trade) => {
      currentBalance += trade.pnl || 0;
      if (currentBalance > peak) peak = currentBalance;
      const dd = ((peak - currentBalance) / peak) * 100;
      if (dd > maxDrawdown) maxDrawdown = dd;
    });

  const finalBalance = initialBalance + netProfit;

  return {
    initialBalance,
    currentBalance: Number(finalBalance.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    totalTrades: trades.length,
    openTrades: openTrades.length,
    closedTrades: totalClosed,
    winRate: Number(winRate.toFixed(2)),
    profitFactor: Number(profitFactor.toFixed(2)),
    averageWin: Number(averageWin.toFixed(2)),
    averageLoss: Number(averageLoss.toFixed(2)),
    maxDrawdownPercentage: Number(maxDrawdown.toFixed(2)),
  };
}

export function generateEquityCurve(trades: Trade[], initialBalance: number = 10000): EquityCurvePoint[] {
  const sortedClosed = [...trades]
    .filter((t) => t.status === "CLOSED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const points: EquityCurvePoint[] = [{
    date: sortedClosed.length > 0
      ? new Date(new Date(sortedClosed[0].date).getTime() - 86400000).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    balance: initialBalance,
    pnl: 0,
  }];

  let cumulativeBalance = initialBalance;
  sortedClosed.forEach((trade) => {
    cumulativeBalance += trade.pnl || 0;
    points.push({ date: trade.date.split("T")[0], balance: Number(cumulativeBalance.toFixed(2)), pnl: trade.pnl || 0 });
  });

  return points;
}

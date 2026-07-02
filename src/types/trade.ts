export type TradeDirection = "LONG" | "SHORT";
export type TradeStatus = "OPEN" | "CLOSED";

export interface PlaybookSetup {
  id: string;
  name: string;
  description?: string;
}

export interface Trade {
  id: string;
  date: string;               // ISO date string format (YYYY-MM-DDTHH:mm:ss.sssZ)
  asset: string;              // e.g., "BTC/USDT", "EUR/USD", "AAPL"
  direction: TradeDirection;
  status: TradeStatus;
  entryPrice: number;
  exitPrice?: number;         // Optional for active/open trades
  size: number;               // Quantity/Contracts traded
  stopLoss?: number;
  takeProfit?: number;
  pnl?: number;               // Realized profit/loss (calculated or manual override)
  pnlPercentage?: number;     // Realized % performance
  playbookId?: string;        // Tied to custom setups
  notes?: string;
  rating?: number;            // Review score 1-5 stars
}

export interface AccountMetrics {
  initialBalance: number;
  currentBalance: number;
  netProfit: number;
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winRate: number;            // Percentage e.g., 55.4
  profitFactor: number;       // Gross Profit / Gross Loss
  averageWin: number;
  averageLoss: number;
  maxDrawdownPercentage: number;
}

export interface EquityCurvePoint {
  date: string;
  balance: number;
  pnl: number;
}
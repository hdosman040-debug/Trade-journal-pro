import { Trade, PlaybookSetup } from "../types/trade";

const TRADES_KEY = "journalpro_trades";
const PLAYBOOKS_KEY = "journalpro_playbooks";
const BALANCE_KEY = "journalpro_balance";
const PSYCHOLOGY_KEY = "journalpro_psychology";

export interface PsychologyLog {
  id: string;
  date: string;
  mood: "CALM" | "CONFIDENT" | "NEUTRAL" | "ANXIOUS" | "FRUSTRATED";
  disciplineScore: number; // 1-10 scale
  focusLevel: number;       // 1-10 scale
  notes: string;
  triggers: string[];       // e.g. ["FOMO", "OVERTRADING", "REVENGE_TRADING", "HESITATION"]
}

const DEFAULT_PLAYBOOKS: PlaybookSetup[] = [
  { id: "pb-1", name: "Support & Resistance Bounce", description: "Trading off horizontal support or resistance lines." },
  { id: "pb-2", name: "Trendline Breakout", description: "Entering on structural volume breakout of a trendline." },
  { id: "pb-3", name: "Fair Value Gap (FVG) Fill", description: "ICT setup entry targeting standard balance gaps." },
];

const SEED_TRADES: Trade[] = [
  {
    id: "trade-1",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    asset: "BTC/USDT",
    direction: "LONG",
    status: "CLOSED",
    entryPrice: 62500,
    exitPrice: 64200,
    size: 0.1,
    pnl: 170.00,
    pnlPercentage: 2.72,
    playbookId: "pb-2",
    notes: "Perfect structural breakout. High volume verification.",
    rating: 5,
  },
  {
    id: "trade-2",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    asset: "ETH/USDT",
    direction: "SHORT",
    status: "CLOSED",
    entryPrice: 3450,
    exitPrice: 3510,
    size: 2.0,
    pnl: -120.00,
    pnlPercentage: -1.74,
    playbookId: "pb-1",
    notes: "Got squeezed at resistance. Stopped out cleanly.",
    rating: 3,
  },
  {
    id: "trade-3",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    asset: "SOL/USDT",
    direction: "LONG",
    status: "CLOSED",
    entryPrice: 142.50,
    exitPrice: 151.20,
    size: 15,
    pnl: 130.50,
    pnlPercentage: 6.11,
    playbookId: "pb-3",
    notes: "Filled the H4 FVG. Fast expansion.",
    rating: 4,
  },
];

// Seed data representing chronological emotional performance logging
const SEED_PSYCHOLOGY: PsychologyLog[] = [
  {
    id: "psy-1",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mood: "CONFIDENT",
    disciplineScore: 9,
    focusLevel: 8,
    notes: "Traded according to rules. Handled the ETH stop-loss maturely without breaking focus.",
    triggers: ["HESITATION"],
  },
  {
    id: "psy-2",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    mood: "CALM",
    disciplineScore: 10,
    focusLevel: 9,
    notes: "Felt very relaxed. FVG filled perfectly, didn't move my SL or take profit early.",
    triggers: [],
  },
];

export const storageService = {
  getInitialBalance(): number {
    const val = localStorage.getItem(BALANCE_KEY);
    if (!val) {
      localStorage.setItem(BALANCE_KEY, "10000");
      return 10000;
    }
    return parseFloat(val);
  },

  setInitialBalance(balance: number): void {
    localStorage.setItem(BALANCE_KEY, balance.toString());
  },

  getPlaybooks(): PlaybookSetup[] {
    const data = localStorage.getItem(PLAYBOOKS_KEY);
    if (!data) {
      localStorage.setItem(PLAYBOOKS_KEY, JSON.stringify(DEFAULT_PLAYBOOKS));
      return DEFAULT_PLAYBOOKS;
    }
    return JSON.parse(data);
  },

  savePlaybook(playbook: PlaybookSetup): PlaybookSetup[] {
    const list = this.getPlaybooks();
    list.push(playbook);
    localStorage.setItem(PLAYBOOKS_KEY, JSON.stringify(list));
    return list;
  },

  getTrades(): Trade[] {
    const data = localStorage.getItem(TRADES_KEY);
    if (!data) {
      localStorage.setItem(TRADES_KEY, JSON.stringify(SEED_TRADES));
      return SEED_TRADES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return SEED_TRADES;
    }
  },

  saveTrades(trades: Trade[]): void {
    localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  },

  getPsychologyLogs(): PsychologyLog[] {
    const data = localStorage.getItem(PSYCHOLOGY_KEY);
    if (!data) {
      localStorage.setItem(PSYCHOLOGY_KEY, JSON.stringify(SEED_PSYCHOLOGY));
      return SEED_PSYCHOLOGY;
    }
    try {
      return JSON.parse(data);
    } catch {
      return SEED_PSYCHOLOGY;
    }
  },

  savePsychologyLogs(logs: PsychologyLog[]): void {
    localStorage.setItem(PSYCHOLOGY_KEY, JSON.stringify(logs));
  }
};
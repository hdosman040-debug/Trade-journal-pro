import { Trade, PlaybookSetup } from "../types/trade";

const TRADES_KEY = "journalpro_trades";
const PLAYBOOKS_KEY = "journalpro_playbooks";
const BALANCE_KEY = "journalpro_balance";
const PSYCHOLOGY_KEY = "journalpro_psychology";

export interface PsychologyLog {
  id: string;
  date: string;
  mood: "CALM" | "CONFIDENT" | "NEUTRAL" | "ANXIOUS" | "FRUSTRATED";
  disciplineScore: number;
  focusLevel: number;
  notes: string;
  triggers: string[];
}

const DEFAULT_PLAYBOOKS: PlaybookSetup[] = [
  { id: "pb-1", name: "Support & Resistance Bounce", description: "Trading off horizontal support or resistance lines." },
  { id: "pb-2", name: "Trendline Breakout", description: "Entering on structural volume breakout of a trendline." },
  { id: "pb-3", name: "Fair Value Gap (FVG) Fill", description: "ICT setup entry targeting standard balance gaps." },
];

const SEED_TRADES: Trade[] = [
  {
    id: "trade-1",
    date: new Date().toISOString(),
    asset: "BTC/USDT",
    direction: "LONG",
    status: "CLOSED",
    entryPrice: 62500,
    exitPrice: 64200,
    size: 0.1,
    pnl: 170.00,
    pnlPercentage: 2.72,
    playbookId: "pb-2",
    notes: "Perfect structural breakout.",
    rating: 5,
  },
];

export const storageService = {
  getInitialBalance(): number {
    try {
      const val = localStorage.getItem(BALANCE_KEY);
      if (!val) {
        localStorage.setItem(BALANCE_KEY, "10000");
        return 10000;
      }
      return parseFloat(val) || 10000;
    } catch {
      return 10000;
    }
  },

  setInitialBalance(balance: number): void {
    try {
      localStorage.setItem(BALANCE_KEY, balance.toString());
    } catch (e) {
      console.error("Storage write failed", e);
    }
  },

  getPlaybooks(): PlaybookSetup[] {
    try {
      const data = localStorage.getItem(PLAYBOOKS_KEY);
      if (!data) {
        localStorage.setItem(PLAYBOOKS_KEY, JSON.stringify(DEFAULT_PLAYBOOKS));
        return DEFAULT_PLAYBOOKS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PLAYBOOKS;
    }
  },

  savePlaybook(playbook: PlaybookSetup): PlaybookSetup[] {
    const list = this.getPlaybooks();
    list.push(playbook);
    try {
      localStorage.setItem(PLAYBOOKS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    return list;
  },

  getTrades(): Trade[] {
    try {
      const data = localStorage.getItem(TRADES_KEY);
      if (!data) return SEED_TRADES;
      return JSON.parse(data) || SEED_TRADES;
    } catch {
      return SEED_TRADES;
    }
  },

  saveTrades(trades: Trade[]): void {
    try {
      // Ensure absolute data sanitization before committing to device storage
      const serialized = JSON.stringify(trades, (_key, value) => {
        if (typeof value === "number" && isNaN(value)) return null;
        return value;
      });
      localStorage.setItem(TRADES_KEY, serialized);
    } catch (e) {
      console.error("Telegram LocalStorage block crash prevented:", e);
    }
  },

  getPsychologyLogs(): PsychologyLog[] {
    try {
      const data = localStorage.getItem(PSYCHOLOGY_KEY);
      if (!data) return [];
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  },

  savePsychologyLogs(logs: PsychologyLog[]): void {
    try {
      localStorage.setItem(PSYCHOLOGY_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }
};
// Build safe: 1783098859

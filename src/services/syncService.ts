import { supabase } from "../lib/supabaseClient";
import { Trade, PlaybookSetup } from "../types/trade";
import { PsychologyLog } from "./storage";

export const syncService = {
  /**
   * Syncs custom playbook strategy setups to Supabase using batch upserts.
   */
  async syncPlaybooks(playbooks: PlaybookSetup[], userId: string): Promise<void> {
    if (!supabase) return;

    const payloads = playbooks.map((pb) => ({
      id: pb.id,
      user_id: userId,
      name: pb.name,
      description: pb.description,
    }));

    const { error } = await supabase.from("playbooks").upsert(payloads);
    if (error) throw error;
  },

  /**
   * Syncs trade transaction parameters to Supabase.
   */
  async syncTrades(trades: Trade[], userId: string): Promise<void> {
    if (!supabase) return;

    const payloads = trades.map((t) => ({
      id: t.id,
      user_id: userId,
      date: t.date,
      asset: t.asset,
      direction: t.direction,
      status: t.status,
      entry_price: t.entryPrice,
      exit_price: t.exitPrice ?? null,
      size: t.size,
      stop_loss: t.stopLoss ?? null,
      take_profit: t.takeProfit ?? null,
      pnl: t.pnl ?? null,
      pnl_percentage: t.pnlPercentage ?? null,
      playbook_id: t.playbookId ?? null,
      notes: t.notes ?? null,
      rating: t.rating ?? null,
    }));

    const { error } = await supabase.from("trades").upsert(payloads);
    if (error) throw error;
  },

  /**
   * Syncs psychological log diaries to Supabase.
   */
  async syncPsychologyLogs(logs: PsychologyLog[], userId: string): Promise<void> {
    if (!supabase) return;

    const payloads = logs.map((l) => ({
      id: l.id,
      user_id: userId,
      date: l.date,
      mood: l.mood,
      discipline_score: l.disciplineScore,
      focus_level: l.focusLevel,
      notes: l.notes,
      triggers: l.triggers,
    }));

    const { error } = await supabase.from("psychology_logs").upsert(payloads);
    if (error) throw error;
  },
};
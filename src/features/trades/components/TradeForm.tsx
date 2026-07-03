import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../../../store/JournalContext";
import { tradeSchema, TradeFormInput } from "../../journal/schemas/tradeSchema";
import { calculateTradePnL } from "../../../utils/tradeCalculations";
import { Star, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

// Safely generate local datetime-local compatible format string (YYYY-MM-DDTHH:mm)
const getLocalDatetimeString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function TradeForm() {
  const { playbooks, addTrade } = useJournal();
  const navigate = useNavigate();
  const [livePnL, setLivePnL] = useState<{ pnl: number; pnlPercentage: number } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TradeFormInput>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      direction: "LONG",
      status: "CLOSED",
      date: getLocalDatetimeString(),
      rating: 5,
    },
  });

  const direction = watch("direction");
  const status = watch("status");
  const entryPrice = watch("entryPrice");
  const exitPrice = watch("exitPrice");
  const size = watch("size");
  const rating = watch("rating") || 5;

  // Reactively calculate projected trade performance dynamically as the user types
  useEffect(() => {
    const ep = Number(entryPrice);
    const xp = Number(exitPrice);
    const sz = Number(size);

    if (!isNaN(ep) && !isNaN(xp) && !isNaN(sz) && ep > 0 && xp > 0 && sz > 0) {
      const result = calculateTradePnL(direction, ep, xp, sz);
      setLivePnL(result);
    } else {
      setLivePnL(null);
    }
  }, [direction, entryPrice, exitPrice, size]);

  const onSubmit = (data: TradeFormInput) => {
    let pnl = undefined;
    let pnlPercentage = undefined;

    // Strict sanitization of values to prevent NaN state propagation inside LocalStorage/Telegram
    const entry = Number(data.entryPrice);
    const exit = data.exitPrice ? Number(data.exitPrice) : null;
    const sl = data.stopLoss ? Number(data.stopLoss) : null;
    const tp = data.takeProfit ? Number(data.takeProfit) : null;

    const cleanExit = exit && !isNaN(exit) ? exit : undefined;
    const cleanSL = sl && !isNaN(sl) ? sl : undefined;
    const cleanTP = tp && !isNaN(tp) ? tp : undefined;

    if (data.status === "CLOSED" && cleanExit) {
      const calcs = calculateTradePnL(data.direction, entry, cleanExit, data.size);
      pnl = calcs.pnl;
      pnlPercentage = calcs.pnlPercentage;
    }

    addTrade({
      ...data,
      entryPrice: entry,
      exitPrice: cleanExit,
      stopLoss: cleanSL,
      takeProfit: cleanTP,
      pnl,
      pnlPercentage,
    });

    navigate("/journal");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-8">
      {/* Direction & Status Segmented Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Direction</label>
          <div className="grid grid-cols-2 p-1 bg-background-surface rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setValue("direction", "LONG")}
              className={cn(
                "py-1.5 text-xs font-semibold rounded-lg transition-all no-tap-highlight",
                direction === "LONG"
                  ? "bg-trade-long text-white shadow"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              LONG
            </button>
            <button
              type="button"
              onClick={() => setValue("direction", "SHORT")}
              className={cn(
                "py-1.5 text-xs font-semibold rounded-lg transition-all no-tap-highlight",
                direction === "SHORT"
                  ? "bg-trade-loss text-white shadow"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              SHORT
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Status</label>
          <div className="grid grid-cols-2 p-1 bg-background-surface rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setValue("status", "OPEN")}
              className={cn(
                "py-1.5 text-xs font-semibold rounded-lg transition-all no-tap-highlight",
                status === "OPEN"
                  ? "bg-background border border-border text-foreground"
                  : "text-foreground-muted"
              )}
            >
              OPEN
            </button>
            <button
              type="button"
              onClick={() => setValue("status", "CLOSED")}
              className={cn(
                "py-1.5 text-xs font-semibold rounded-lg transition-all no-tap-highlight",
                status === "CLOSED"
                  ? "bg-background border border-border text-foreground"
                  : "text-foreground-muted"
              )}
            >
              CLOSED
            </button>
          </div>
        </div>
      </div>

      {/* Asset Symbol & Position Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Asset Symbol</label>
          <input
            type="text"
            placeholder="e.g., SOL/USDT"
            {...register("asset")}
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          />
          {errors.asset && <p className="text-[10px] text-trade-loss mt-1">{errors.asset.message}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Position Size</label>
          <input
            type="text"
            inputMode="decimal"
            step="any"
            placeholder="0.00"
            {...register("size", { valueAsNumber: true })}
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          />
          {errors.size && <p className="text-[10px] text-trade-loss mt-1">{errors.size.message}</p>}
        </div>
      </div>

      {/* Entry Price & Exit Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Entry Price</label>
          <input
            type="text"
            inputMode="decimal"
            step="any"
            placeholder="0.00"
            {...register("entryPrice", { valueAsNumber: true })}
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          />
          {errors.entryPrice && <p className="text-[10px] text-trade-loss mt-1">{errors.entryPrice.message}</p>}
        </div>

        <div>
          <label className={cn("text-xs font-semibold mb-2 block", status === "OPEN" ? "text-foreground-dim" : "text-foreground-muted")}>
            Exit Price
          </label>
          <input
            type="text"
            inputMode="decimal"
            step="any"
            placeholder="0.00"
            disabled={status === "OPEN"}
            {...register("exitPrice", { valueAsNumber: true })}
            className="w-full bg-background-surface border border-border disabled:opacity-40 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          />
          {errors.exitPrice && <p className="text-[10px] text-trade-loss mt-1">{errors.exitPrice.message}</p>}
        </div>
      </div>

      {/* Risk Metrics: Stop Loss & Take Profit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Stop Loss (Optional)</label>
          <input
            type="text"
            inputMode="decimal"
            step="any"
            placeholder="0.00"
            {...register("stopLoss", { valueAsNumber: true })}
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          />
          {errors.stopLoss && <p className="text-[10px] text-trade-loss mt-1">{errors.stopLoss.message}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Take Profit (Optional)</label>
          <input
            type="text"
            inputMode="decimal"
            step="any"
            placeholder="0.00"
            {...register("takeProfit", { valueAsNumber: true })}
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          />
          {errors.takeProfit && <p className="text-[10px] text-trade-loss mt-1">{errors.takeProfit.message}</p>}
        </div>
      </div>

      {/* Playbook Setup & Execution Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Playbook Setup</label>
          <select
            {...register("playbookId")}
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          >
            <option value="">No Playbook Setup</option>
            {playbooks.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground-muted mb-2 block">Execution Date</label>
          <input
            type="datetime-local"
            {...register("date")}
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
          />
          {errors.date && <p className="text-[10px] text-trade-loss mt-1">{errors.date.message}</p>}
        </div>
      </div>

      {/* Text Area Notes */}
      <div>
        <label className="text-xs font-semibold text-foreground-muted mb-2 block">Execution Notes & Insights</label>
        <textarea
          rows={3}
          placeholder="Market sentiment, psychological state, execution errors..."
          {...register("notes")}
          className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all resize-none"
        />
      </div>

      {/* Star Performance Rating (Hidden for Open Positions) */}
      {status === "CLOSED" && (
        <div className="p-4 bg-background-card rounded-xl border border-border">
          <label className="text-xs font-semibold text-foreground-muted mb-2 block text-center">
            Execution Discipline Rating
          </label>
          <div className="flex items-center justify-center space-x-2 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue("rating", star)}
                className="p-1 focus:outline-none no-tap-highlight"
              >
                <Star
                  className={cn(
                    "w-6 h-6 transition-colors",
                    star <= rating ? "fill-trade-short text-trade-short" : "text-foreground-dim"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Mathematical Profit / Loss Output Drawer */}
      {livePnL && (
        <div
          className={cn(
            "p-3 rounded-xl border flex items-center justify-between shadow-sm animate-fadeIn",
            livePnL.pnl >= 0
              ? "bg-trade-profit-soft border-trade-profit/20"
              : "bg-trade-loss-soft border-trade-loss/20"
          )}
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className={cn("w-4 h-4", livePnL.pnl >= 0 ? "text-trade-profit" : "text-trade-loss")} />
            <span className="text-xs font-semibold">Realized Profit/Loss Outcome:</span>
          </div>
          <span className={cn("font-mono text-sm font-bold", livePnL.pnl >= 0 ? "text-trade-profit" : "text-trade-loss")}>
            {livePnL.pnl >= 0 ? "+" : ""}
            {livePnL.pnl.toLocaleString()} USD ({livePnL.pnlPercentage}%)
          </span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-trade-long hover:bg-trade-long/90 disabled:opacity-45 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-glow-profit transition-all no-tap-highlight cursor-pointer"
      >
        {isSubmitting ? "Logging Trade..." : "Commit Trade to Journal"}
      </button>
    </form>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trade } from "../../../types/trade";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ResolveTradeModalProps {
  isOpen: boolean;
  trade: Trade | null;
  onClose: () => void;
  onResolve: (id: string, exitPrice: number, notes?: string) => void;
}

export function ResolveTradeModal({ isOpen, trade, onClose, onResolve }: ResolveTradeModalProps) {
  const [exitPrice, setExitPrice] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  if (!trade) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(exitPrice);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setValidationError("Please enter a valid exit price greater than 0.");
      return;
    }

    setValidationError("");
    onResolve(trade.id, parsedPrice, additionalNotes);
    setExitPrice("");
    setAdditionalNotes("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Slide-up Container sheet suitable for Telegram mini-app bounds */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-background-card border-t border-border rounded-t-2xl p-5 shadow-card-shadow z-10 overflow-hidden pb-safe"
          >
            {/* Grab handle bar to represent sheet layout */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Resolve Active Trade</h3>
                <p className="text-[10px] text-foreground-muted">Close trade for {trade.asset}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-background-surface border border-border text-foreground-muted hover:text-foreground no-tap-highlight"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reference trade configuration parameters */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-background-surface border border-border rounded-xl text-xs font-mono">
                <div>
                  <span className="text-foreground-dim block text-[10px] uppercase">Direction</span>
                  <span className={cn("font-bold", trade.direction === "LONG" ? "text-trade-long" : "text-trade-loss")}>
                    {trade.direction}
                  </span>
                </div>
                <div>
                  <span className="text-foreground-dim block text-[10px] uppercase">Entry Level</span>
                  <span className="text-foreground font-semibold">{trade.entryPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Exit input parameters */}
              <div>
                <label className="text-xs font-semibold text-foreground-muted mb-1.5 block">Exit Execution Price</label>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  placeholder="0.00"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
                />
                {validationError && (
                  <div className="flex items-center space-x-1.5 mt-1.5 text-trade-loss">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <p className="text-[10px]">{validationError}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-muted mb-1.5 block">Closing Commentary (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Why was the trade closed? Technical target, stopped out, manual exit?"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-trade-profit hover:bg-trade-profit/90 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-glow-profit flex items-center justify-center space-x-2 no-tap-highlight cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Position Resolution</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
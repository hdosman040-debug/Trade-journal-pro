import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJournal } from "../../../store/JournalContext";
import { X, Heart, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

interface PsychologyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TRIGGERS = [
  { id: "FOMO", label: "Fear of Missing Out (FOMO)" },
  { id: "OVERTRADING", label: "Overtrading / Hyperactivity" },
  { id: "REVENGE_TRADING", label: "Revenge Trading" },
  { id: "HESITATION", label: "Execution Hesitation / Fear" },
  { id: "GREED", label: "Greed (Stretched targets / TP adjustments)" },
];

export function PsychologyLogModal({ isOpen, onClose }: PsychologyLogModalProps) {
  const { addPsychologyLog } = useJournal();
  
  const [mood, setMood] = useState<"CALM" | "CONFIDENT" | "NEUTRAL" | "ANXIOUS" | "FRUSTRATED">("NEUTRAL");
  const [disciplineScore, setDisciplineScore] = useState(8);
  const [focusLevel, setFocusLevel] = useState(8);
  const [notes, setNotes] = useState("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");

  const handleToggleTrigger = (id: string) => {
    if (triggers.includes(id)) {
      setTriggers(triggers.filter((t) => t !== id));
    } else {
      setTriggers([...triggers, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      setValidationError("Please share your state of mind comments.");
      return;
    }

    setValidationError("");
    addPsychologyLog({
      date: new Date().toISOString(),
      mood,
      disciplineScore,
      focusLevel,
      notes: notes.trim(),
      triggers,
    });

    setMood("NEUTRAL");
    setDisciplineScore(8);
    setFocusLevel(8);
    setNotes("");
    setTriggers([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-background-card border-t border-border rounded-t-2xl p-5 shadow-card-shadow z-10 pb-safe max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Psychological Check-in</h3>
                <p className="text-[10px] text-foreground-muted">Document emotional states and biases</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-background-surface border border-border text-foreground-muted hover:text-foreground no-tap-highlight"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mood Segment selector */}
              <div>
                <label className="text-xs font-semibold text-foreground-muted mb-2 block">Current Mindstate Mood</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(["CALM", "CONFIDENT", "NEUTRAL", "ANXIOUS", "FRUSTRATED"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={cn(
                        "py-2 text-[9px] font-bold rounded-lg border transition-all no-tap-highlight cursor-pointer truncate",
                        mood === m
                          ? "bg-trade-long-soft border-trade-long text-trade-long"
                          : "bg-background-surface border-border text-foreground-dim"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-foreground-muted mb-1">
                    <span>Discipline (1-10)</span>
                    <span className="font-mono text-foreground font-bold">{disciplineScore}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={disciplineScore}
                    onChange={(e) => setDisciplineScore(parseInt(e.target.value))}
                    className="w-full accent-trade-long cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-foreground-muted mb-1">
                    <span>Mental Focus (1-10)</span>
                    <span className="font-mono text-foreground font-bold">{focusLevel}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={focusLevel}
                    onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                    className="w-full accent-trade-long cursor-pointer"
                  />
                </div>
              </div>

              {/* Cognitive Bias Triggers Checklist */}
              <div>
                <label className="text-xs font-semibold text-foreground-muted mb-2 block">Bias Triggers Faced Today</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                  {AVAILABLE_TRIGGERS.map((trigger) => (
                    <button
                      key={trigger.id}
                      type="button"
                      onClick={() => handleToggleTrigger(trigger.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs rounded-xl border transition-all flex items-center justify-between no-tap-highlight",
                        triggers.includes(trigger.id)
                          ? "bg-trade-loss-soft border-trade-loss/40 text-trade-loss"
                          : "bg-background-surface border-border text-foreground-muted"
                      )}
                    >
                      <span>{trigger.label}</span>
                      {triggers.includes(trigger.id) && <span className="text-[10px] font-bold">ACTIVE</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cognitive Diary entries */}
              <div>
                <label className="text-xs font-semibold text-foreground-muted mb-1.5 block">State of Mind commentary</label>
                <textarea
                  rows={2}
                  placeholder="Documenting anxiety, deviations from trading plan, physical condition, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all resize-none"
                />
                {validationError && (
                  <div className="flex items-center space-x-1.5 mt-1.5 text-trade-loss">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <p className="text-[10px]">{validationError}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-trade-loss hover:bg-trade-loss/90 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-glow-loss flex items-center justify-center space-x-2 no-tap-highlight cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                <span>Save Psychology check-in</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
import { useState } from "react";
import { useJournal } from "../../../store/JournalContext";
import { CreatePlaybookModal } from "../../playbook/components/CreatePlaybookModal";
import { PsychologyLogModal } from "../components/PsychologyLogModal";
import { formatCurrency } from "../../../lib/utils";
import { BookOpen, BrainCircuit, UserCheck, Plus, Trash2, Heart } from "lucide-react";
import { cn } from "../../../lib/utils";

export function SettingsPage() {
  const {
    trades,
    playbooks,
    psychologyLogs,
    initialBalance,
    updateInitialBalance,
    deletePsychologyLog,
  } = useJournal();

  const [balanceInput, setBalanceInput] = useState(initialBalance.toString());
  const [isPlaybookModalOpen, setIsPlaybookModalOpen] = useState(false);
  const [isPsychologyModalOpen, setIsPsychologyModalOpen] = useState(false);

  // Synchronize input focus
  const handleBalanceUpdate = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      updateInitialBalance(val);
    }
  };

  // On-the-fly playbooks scorecard engine
  const playbookStats = playbooks.map((pb) => {
    const pbTrades = trades.filter((t) => t.playbookId === pb.id && t.status === "CLOSED");
    const total = pbTrades.length;
    const wins = pbTrades.filter((t) => (t.pnl || 0) > 0).length;
    const netProfit = pbTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      ...pb,
      total,
      winRate: Number(winRate.toFixed(1)),
      netProfit,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-bold text-foreground">SaaS Configuration Panel</h1>
        <p className="text-[10px] text-foreground-muted">Configure initial capital levels, setup frameworks and psychology</p>
      </div>

      {/* Profile Capital configurations */}
      <div className="p-4 bg-background-card border border-border rounded-xl space-y-3">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-trade-long" />
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Capital Level Settings</h2>
        </div>

        <div>
          <label className="text-[10px] font-bold text-foreground-muted block uppercase mb-1.5">Initial Base Balance (USD)</label>
          <input
            type="number"
            value={balanceInput}
            onChange={(e) => setBalanceInput(e.target.value)}
            onBlur={handleBalanceUpdate}
            placeholder="10000"
            className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-active transition-all"
          />
        </div>
      </div>

      {/* Playbook Setup planner panel */}
      <div className="p-4 bg-background-card border border-border rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-trade-long" />
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Playbook Strategy Planner</h2>
          </div>
          <button
            onClick={() => setIsPlaybookModalOpen(true)}
            className="flex items-center space-x-1 bg-background-surface border border-border hover:bg-background-hover text-foreground-muted text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all no-tap-highlight cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Model</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
          {playbookStats.map((pb) => (
            <div key={pb.id} className="p-3 bg-background-surface border border-border/80 rounded-xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-foreground">{pb.name}</h3>
                  {pb.description && <p className="text-[10px] text-foreground-dim mt-0.5 line-clamp-1">{pb.description}</p>}
                </div>
                <span className={cn("text-[9px] font-bold font-mono tracking-wide px-2 py-0.5 rounded", pb.netProfit >= 0 ? "bg-trade-profit-soft text-trade-profit" : "bg-trade-loss-soft text-trade-loss")}>
                  {pb.netProfit >= 0 ? "+" : ""}{formatCurrency(pb.netProfit)}
                </span>
              </div>
              {/* Secondary performance matrix */}
              <div className="flex items-center space-x-4 text-[9px] text-foreground-dim font-semibold font-mono uppercase">
                <span>Trades Executed: <strong className="text-foreground">{pb.total}</strong></span>
                <span>Win Ratio: <strong className="text-trade-long">{pb.winRate}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Psychology Mental Tracker logs */}
      <div className="p-4 bg-background-card border border-border rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-trade-loss" />
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Mental State Logs</h2>
          </div>
          <button
            onClick={() => setIsPsychologyModalOpen(true)}
            className="flex items-center space-x-1 bg-background-surface border border-border hover:bg-background-hover text-foreground-muted text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all no-tap-highlight cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-trade-loss" />
            <span>Log Composure</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
          {psychologyLogs.length > 0 ? (
            psychologyLogs
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((log) => (
                <div key={log.id} className="p-3 bg-background-surface border border-border/80 rounded-xl space-y-2 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-background-card border border-border text-foreground">
                          {log.mood}
                        </span>
                        <span className="text-[10px] text-foreground-dim">
                          {new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground-muted mt-2 font-medium">{log.notes}</p>
                    </div>
                    <button
                      onClick={() => deletePsychologyLog(log.id)}
                      className="p-1 text-foreground-dim hover:text-trade-loss transition-colors no-tap-highlight cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {log.triggers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {log.triggers.map((trigger) => (
                        <span key={trigger} className="text-[8px] font-bold uppercase tracking-wider bg-trade-loss-soft border border-trade-loss/20 px-1.5 py-0.5 rounded text-trade-loss">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quantitative metrics footer */}
                  <div className="flex items-center space-x-4 text-[9px] text-foreground-dim font-bold font-mono uppercase border-t border-border/40 pt-2">
                    <span>Discipline: <strong className="text-trade-short">{log.disciplineScore}/10</strong></span>
                    <span>Focus Level: <strong className="text-trade-long">{log.focusLevel}/10</strong></span>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-xs text-foreground-dim py-4">No composure diaries filed yet.</p>
          )}
        </div>
      </div>

      {/* Background slide sheets */}
      <CreatePlaybookModal
        isOpen={isPlaybookModalOpen}
        onClose={() => setIsPlaybookModalOpen(false)}
      />
      <PsychologyLogModal
        isOpen={isPsychologyModalOpen}
        onClose={() => setIsPsychologyModalOpen(false)}
      />
    </div>
  );
}
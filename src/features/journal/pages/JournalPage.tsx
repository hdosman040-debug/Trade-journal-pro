import { useState } from "react";
import { useJournal } from "../../../store/JournalContext";
import { TradeCard } from "../components/TradeCard";
import { ResolveTradeModal } from "../components/ResolveTradeModal";
import { TradingCalendar } from "../../calendar/components/TradingCalendar";
import { Search, Filter, Plus, Calendar, List, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Trade } from "../../../types/trade";
import { formatCurrency } from "../../../lib/utils";
import { cn } from "../../../lib/utils";

type StatusFilter = "ALL" | "OPEN" | "CLOSED";
type DirectionFilter = "ALL" | "LONG" | "SHORT";
type ViewMode = "LIST" | "CALENDAR";

export function JournalPage() {
  const { trades, playbooks, updateTrade } = useJournal();

  // Mode state controls (List vs Calendar views)
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");

  // Ledger Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [directionFilter] = useState<DirectionFilter>("ALL");
  const [playbookFilter, setPlaybookFilter] = useState<string>("ALL");

  // Calendar Focus selection state (Defaults to current ISO date stamp)
  const [focusedDate, setFocusedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Dynamic position resolution state
  const [resolutionTarget, setResolutionTarget] = useState<Trade | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const handleResolveRequest = (trade: Trade) => {
    setResolutionTarget(trade);
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolve = (id: string, exitPrice: number, additionalNotes?: string) => {
    const targetTrade = trades.find((t) => t.id === id);
    if (!targetTrade) return;

    const appendNotes = additionalNotes
      ? `${targetTrade.notes || ""}\n\nResolved Exit Notes: ${additionalNotes}`.trim()
      : targetTrade.notes;

    updateTrade(id, {
      exitPrice,
      status: "CLOSED",
      notes: appendNotes,
    });
  };

  // Perform dynamic multi-tier structural filtering for Ledger view
  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trade.notes && trade.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || trade.status === statusFilter;
    const matchesDirection = directionFilter === "ALL" || trade.direction === directionFilter;
    const matchesPlaybook = playbookFilter === "ALL" || trade.playbookId === playbookFilter;

    return matchesSearch && matchesStatus && matchesDirection && matchesPlaybook;
  });

  // Calculate chronological list specifically for selected Calendar focused date
  const calendarFocusedTrades = trades.filter((trade) => {
    return trade.date.split("T")[0] === focusedDate;
  });

  const dailyNetPnL = calendarFocusedTrades.reduce((sum, t) => sum + (t.status === "CLOSED" ? (t.pnl || 0) : 0), 0);

  return (
    <div className="space-y-4">
      {/* Title & Toggle view switcher toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Trading Logs Journal</h1>
          <p className="text-[10px] text-foreground-muted">Index and organize historical actions</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* List vs Calendar Toggle */}
          <div className="flex p-0.5 bg-background-card border border-border rounded-xl">
            <button
              onClick={() => setViewMode("LIST")}
              className={cn(
                "p-1.5 rounded-lg transition-all no-tap-highlight cursor-pointer",
                viewMode === "LIST" ? "bg-background text-trade-long border border-border" : "text-foreground-dim"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("CALENDAR")}
              className={cn(
                "p-1.5 rounded-lg transition-all no-tap-highlight cursor-pointer",
                viewMode === "CALENDAR" ? "bg-background text-trade-long border border-border" : "text-foreground-dim"
              )}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/trade/new"
            className="p-2 rounded-xl bg-trade-long hover:bg-trade-long/90 text-white shadow-glow-profit no-tap-highlight"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* RENDER MODES CONTAINER */}
      {viewMode === "LIST" ? (
        <div className="space-y-4">
          {/* Ledger view Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-dim" />
            <input
              type="text"
              placeholder="Search assets or keyword comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-card border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-active transition-all"
            />
          </div>

          {/* Ledger filters */}
          <div className="space-y-2 pb-1">
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center space-x-1 text-[9px] text-foreground-dim uppercase font-bold pr-1 border-r border-border mr-1 shrink-0">
                <Filter className="w-3 h-3" />
                <span>Status</span>
              </div>
              {(["ALL", "OPEN", "CLOSED"] as StatusFilter[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all shrink-0 no-tap-highlight cursor-pointer",
                    statusFilter === st
                      ? "bg-background-card border-active text-foreground"
                      : "bg-background-surface border-border/80 text-foreground-dim"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center space-x-1 text-[9px] text-foreground-dim uppercase font-bold pr-1 border-r border-border mr-1 shrink-0">
                <Calendar className="w-3 h-3" />
                <span>Setup</span>
              </div>

              <button
                onClick={() => setPlaybookFilter("ALL")}
                className={cn(
                  "text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all shrink-0 no-tap-highlight cursor-pointer",
                  playbookFilter === "ALL"
                    ? "bg-background-card border-active text-foreground"
                    : "bg-background-surface border-border/80 text-foreground-dim"
                )}
              >
                All Setups
              </button>

              {playbooks.map((pb) => (
                <button
                  key={pb.id}
                  onClick={() => setPlaybookFilter(pb.id)}
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all shrink-0 no-tap-highlight cursor-pointer max-w-[120px] truncate",
                    playbookFilter === pb.id
                      ? "bg-background-card border-active text-foreground"
                      : "bg-background-surface border-border/80 text-foreground-dim"
                  )}
                >
                  {pb.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ledger Lists Output */}
          <div className="space-y-3 pb-6">
            {filteredTrades.length > 0 ? (
              filteredTrades
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((trade) => (
                  <TradeCard key={trade.id} trade={trade} onResolveRequest={handleResolveRequest} />
                ))
            ) : (
              <div className="bg-background-card border border-border rounded-xl p-8 text-center">
                <p className="text-xs text-foreground-muted">No trades match your active query filters.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {/* Render Calendar grid matrix */}
          <TradingCalendar
            trades={trades}
            selectedDate={focusedDate}
            onDateSelect={(dt) => setFocusedDate(dt)}
          />

          {/* Detailed analysis of focused calendar date */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-xs font-bold text-foreground">
                  Activity for {new Date(focusedDate + "T00:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </h3>
                <p className="text-[10px] text-foreground-muted">
                  Executed <strong className="text-foreground">{calendarFocusedTrades.length}</strong> transaction logs
                </p>
              </div>
              {calendarFocusedTrades.length > 0 && dailyNetPnL !== 0 && (
                <div className="text-right">
                  <p className="text-[9px] text-foreground-dim uppercase font-bold tracking-wider">Net PnL Outcome</p>
                  <p className={cn("text-xs font-bold font-mono mt-0.5", dailyNetPnL >= 0 ? "text-trade-profit" : "text-trade-loss")}>
                    {dailyNetPnL >= 0 ? "+" : ""}
                    {formatCurrency(dailyNetPnL)}
                  </p>
                </div>
              )}
            </div>

            {/* List focused days transactions */}
            {calendarFocusedTrades.length > 0 ? (
              <div className="space-y-3">
                {calendarFocusedTrades.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} onResolveRequest={handleResolveRequest} />
                ))}
              </div>
            ) : (
              <div className="bg-background-card border border-border rounded-xl p-6 text-center flex items-center justify-center space-x-2 text-foreground-dim">
                <Info className="w-4 h-4 text-foreground-dim" />
                <span className="text-xs">No transaction executions recorded on this date.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Resolution Sheet Overlay */}
      <ResolveTradeModal
        isOpen={isResolveModalOpen}
        trade={resolutionTarget}
        onClose={() => setIsResolveModalOpen(false)}
        onResolve={handleConfirmResolve}
      />
    </div>
  );
}
import { useState } from "react";
import { Trade } from "../../../types/trade";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";

interface TradingCalendarProps {
  trades: Trade[];
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (date: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function TradingCalendar({ trades, selectedDate, onDateSelect }: TradingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Dependency-free calendar logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Navigate months safely
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group trades by date string (YYYY-MM-DD) and calculate net PnL
  const dailyPnLMap = trades.reduce<{ [dateStr: string]: { pnl: number; tradeCount: number; hasOpen: boolean } }>(
    (acc, trade) => {
      const dateStr = trade.date.split("T")[0];
      if (!acc[dateStr]) {
        acc[dateStr] = { pnl: 0, tradeCount: 0, hasOpen: false };
      }

      acc[dateStr].tradeCount++;
      if (trade.status === "CLOSED" && trade.pnl !== undefined) {
        acc[dateStr].pnl += trade.pnl;
      } else if (trade.status === "OPEN") {
        acc[dateStr].hasOpen = true;
      }

      return acc;
    },
    {}
  );

  // Build grid blocks
  const calendarCells: React.ReactNode[] = [];

  // Pad empty pre-month slots
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="aspect-square bg-transparent border-none" />);
  }

  // Generate active date blocks
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day.toString().padStart(2, "0");
    const monthStr = (month + 1).toString().padStart(2, "0");
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    const stats = dailyPnLMap[dateKey];
    const isSelected = dateKey === selectedDate;

    let dayStyle = "border-border bg-background-surface hover:bg-background-hover text-foreground-muted";
    let glowDot = null;

    if (stats) {
      if (stats.pnl > 0) {
        dayStyle = "border-trade-profit/40 bg-trade-profit-soft/10 text-trade-profit font-bold";
      } else if (stats.pnl < 0) {
        dayStyle = "border-trade-loss/40 bg-trade-loss-soft/10 text-trade-loss font-bold";
      } else if (stats.hasOpen) {
        dayStyle = "border-trade-short/40 bg-trade-short-soft/10 text-trade-short font-bold";
      }
      
      // Open trade visual indicator dot
      if (stats.hasOpen) {
        glowDot = <span className="absolute bottom-1 w-1 h-1 rounded-full bg-trade-short animate-pulse" />;
      }
    }

    calendarCells.push(
      <button
        key={`day-${day}`}
        onClick={() => onDateSelect(dateKey)}
        className={cn(
          "aspect-square relative flex flex-col items-center justify-center rounded-xl border text-xs font-semibold no-tap-highlight transition-all duration-200 cursor-pointer",
          dayStyle,
          isSelected && "ring-2 ring-active border-active scale-[1.05]"
        )}
      >
        <span className="z-10">{day}</span>
        
        {/* Dynamic miniature profit labels inside grid boxes */}
        {stats && stats.pnl !== 0 && (
          <span className="text-[7px] font-mono font-medium truncate max-w-full px-1 absolute top-1 z-10">
            {stats.pnl > 0 ? "+" : ""}
            {Math.round(stats.pnl)}
          </span>
        )}
        {glowDot}
      </button>
    );
  }

  return (
    <div className="bg-background-card border border-border rounded-xl p-4 space-y-4">
      {/* Month Navigation Control Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">
          {MONTHS[month]} <span className="text-foreground-dim font-mono">{year}</span>
        </h2>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-background-surface border border-border text-foreground-muted hover:text-foreground no-tap-highlight cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-background-surface border border-border text-foreground-muted hover:text-foreground no-tap-highlight cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Grid Row */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[10px] font-bold text-foreground-dim uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Numerical Calendar blocks */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarCells}
      </div>

      {/* Legend guide map */}
      <div className="flex items-center justify-center space-x-4 text-[9px] text-foreground-dim uppercase font-bold tracking-wider pt-2 border-t border-border/50">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded bg-trade-profit-soft border border-trade-profit/40" />
          <span>Green Day</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded bg-trade-loss-soft border border-trade-loss/40" />
          <span>Red Day</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded bg-trade-short-soft border border-trade-short/40" />
          <span>Active Risk</span>
        </div>
      </div>
    </div>
  );
}
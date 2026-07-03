import { useTradeStore } from '../../../store/useTradeStore';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

export const TradeHistory = () => {
  const { trades } = useTradeStore();

  if (trades.length === 0) return <p className="text-slate-500 text-center">No trades logged yet.</p>;

  return (
    <div className="space-y-3">
      {trades.map((trade) => (
        <Card key={trade.id} className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-100">{trade.asset}</h3>
            <p className="text-xs text-slate-400 uppercase">{trade.direction}</p>
          </div>
          <Badge status={trade.pnl == null ? "be" : trade.pnl > 0 ? "win" : trade.pnl < 0 ? "loss" : "be"} />
        </Card>
      ))}
    </div>
  );
};

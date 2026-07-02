import { create } from 'zustand';
import { Trade } from '../types/trade';

interface TradeStore {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'createdAt'>) => void;
}

export const useTradeStore = create<TradeStore>((set) => ({
  trades: [],
  addTrade: (trade) =>
    set((state) => ({
      trades: [
        {
          ...trade,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
        ...state.trades,
      ],
    })),
}));

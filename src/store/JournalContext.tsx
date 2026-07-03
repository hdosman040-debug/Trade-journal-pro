import React, { createContext, useContext, useState, useEffect } from "react";
import { Trade, PlaybookSetup, AccountMetrics, EquityCurvePoint } from "../types/trade";
import { storageService, PsychologyLog } from "../services/storage";
import { calculateAccountMetrics, generateEquityCurve } from "../utils/tradeCalculations";
import { supabase } from "../lib/supabaseClient";
import { syncService } from "../services/syncService";

interface JournalContextType {
  trades: Trade[];
  playbooks: PlaybookSetup[];
  initialBalance: number;
  metrics: AccountMetrics;
  equityCurve: EquityCurvePoint[];
  psychologyLogs: PsychologyLog[];
  syncStatus: "OFFLINE" | "SYNCING" | "CONNECTED" | "ERROR";
  addTrade: (trade: Omit<Trade, "id">) => void;
  updateTrade: (id: string, updatedFields: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  updateInitialBalance: (balance: number) => void;
  addPlaybook: (name: string, description?: string) => void;
  addPsychologyLog: (log: Omit<PsychologyLog, "id">) => void;
  deletePsychologyLog: (id: string) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [playbooks, setPlaybooks] = useState<PlaybookSetup[]>([]);
  const [initialBalance, setInitialBalance] = useState<number>(10000);
  const [psychologyLogs, setPsychologyLogs] = useState<PsychologyLog[]>([]);

  // Cloud syncing state tracking
  const [userId, setUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"OFFLINE" | "SYNCING" | "CONNECTED" | "ERROR">("OFFLINE");

  // 1. Initial State Hydration from local disk
  useEffect(() => {
    setTrades(storageService.getTrades());
    setPlaybooks(storageService.getPlaybooks());
    setInitialBalance(storageService.getInitialBalance());
    setPsychologyLogs(storageService.getPsychologyLogs());
  }, []);

  // 2. Authenticate user silently and initiate background syncing loops
  useEffect(() => {
    if (!supabase) {
      setSyncStatus("OFFLINE");
      return;
    }

    const authenticateAndSync = async () => {
      try {
        setSyncStatus("SYNCING");
        
        // Retrieve current active session
        if (!supabase) return;
    let sessionUser = (await supabase.auth.getUser()).data.user;

        // If no active session, execute instant silent login
        if (!sessionUser) {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          sessionUser = data.user;
        }

        if (sessionUser) {
          setUserId(sessionUser.id);
          setSyncStatus("CONNECTED");
        }
      } catch (err) {
        console.error("Supabase cloud authentication failed:", err);
        setSyncStatus("ERROR");
      }
    };

    authenticateAndSync();
  }, []);

  // 3. Synchronize cache modifications automatically
  useEffect(() => {
    if (!userId || syncStatus === "OFFLINE" || !supabase) return;

    const performSync = async () => {
      try {
        setSyncStatus("SYNCING");
        await syncService.syncPlaybooks(playbooks, userId);
        await syncService.syncTrades(trades, userId);
        await syncService.syncPsychologyLogs(psychologyLogs, userId);
        setSyncStatus("CONNECTED");
      } catch (err) {
        console.error("Background sync failed:", err);
        setSyncStatus("ERROR");
      }
    };

    // Debounce syncing calls to avoid spamming PostgreSQL endpoints
    const syncTimeout = setTimeout(performSync, 1500);
    return () => clearTimeout(syncTimeout);
  }, [trades, playbooks, psychologyLogs, userId]);

  const saveAndSetTrades = (newTrades: Trade[]) => {
    setTrades(newTrades);
    storageService.saveTrades(newTrades);
  };

  const addTrade = (tradeData: Omit<Trade, "id">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: `trade-${Date.now()}`,
    };
    const updated = [newTrade, ...trades];
    saveAndSetTrades(updated);
  };

  const updateTrade = (id: string, updatedFields: Partial<Trade>) => {
    const updated = trades.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    saveAndSetTrades(updated);
  };

  const deleteTrade = (id: string) => {
    const updated = trades.filter((t) => t.id !== id);
    saveAndSetTrades(updated);
  };

  const updateInitialBalance = (balance: number) => {
    setInitialBalance(balance);
    storageService.setInitialBalance(balance);
  };

  const addPlaybook = (name: string, description?: string) => {
    const newPlaybook: PlaybookSetup = {
      id: `pb-${Date.now()}`,
      name,
      description,
    };
    const updatedList = storageService.savePlaybook(newPlaybook);
    setPlaybooks(updatedList);
  };

  const addPsychologyLog = (logData: Omit<PsychologyLog, "id">) => {
    const newLog: PsychologyLog = {
      ...logData,
      id: `psy-${Date.now()}`,
    };
    const updated = [newLog, ...psychologyLogs];
    setPsychologyLogs(updated);
    storageService.savePsychologyLogs(updated);
  };

  const deletePsychologyLog = (id: string) => {
    const updated = psychologyLogs.filter((l) => l.id !== id);
    setPsychologyLogs(updated);
    storageService.savePsychologyLogs(updated);
  };

  const metrics = calculateAccountMetrics(trades, initialBalance);
  const equityCurve = generateEquityCurve(trades, initialBalance);

  return (
    <JournalContext.Provider
      value={{
        trades,
        playbooks,
        initialBalance,
        metrics,
        equityCurve,
        psychologyLogs,
        syncStatus,
        addTrade,
        updateTrade,
        deleteTrade,
        updateInitialBalance,
        addPlaybook,
        addPsychologyLog,
        deletePsychologyLog,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
};
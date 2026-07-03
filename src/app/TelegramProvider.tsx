import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface TelegramContextType {
  tg: TelegramWebApp | null;
  isTelegram: boolean;
  username: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  tg: null,
  isTelegram: false,
  username: null,
  isAuthenticated: false,
  isLoadingAuth: true,
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      webApp.ready();
      webApp.expand();

      try {
        if (typeof webApp.setHeaderColor === "function") webApp.setHeaderColor("#12141C");
        if (typeof webApp.setBackgroundColor === "function") webApp.setBackgroundColor("#090A0F");
      } catch (e) {
        console.warn("Theme parameters not set:", e);
      }

      setTg(webApp);
      setIsTelegram(true);

      if (webApp.initDataUnsafe?.user?.first_name) {
        setUsername(webApp.initDataUnsafe.user.first_name);
      }

      const authenticateUser = async () => {
        if (!supabase) {
          setIsLoadingAuth(false);
          return;
        }

        const rawInitData = webApp.initData;
        if (!rawInitData) {
          setIsLoadingAuth(false);
          return;
        }

        try {
          // Parse raw URL query parameters from Telegram initData
          const params = new URLSearchParams(rawInitData);
          const hash = params.get("hash");
          
          if (!hash) throw new Error("Missing structural hash payload.");

          // Gather validation items and sort alphabetically per Telegram specification
          const keys = Array.from(params.keys()).filter((k) => k !== "hash").sort();
          const sortedPairs = keys.map((key) => `${key}=${params.get(key)}`);
          const sortedString = sortedPairs.join("\n");

          // Build context package
          const payload = {
            sorted_string: sortedString,
            user: webApp.initDataUnsafe?.user || null,
            auth_date: params.get("auth_date"),
          };

          // Invoke Database RPC directly, bypassing missing edge environment
          const { data, error } = await supabase.rpc("verify_telegram_user", {
            auth_data_json: payload,
            telegram_hash: hash,
            bot_token: "YOUR_TELEGRAM_BOT_TOKEN" // Ideally managed via vault or safe decryption
          });

          if (error) throw error;

          if (data?.success) {
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Database secure auth handshake failed:", err);
        } finally {
          setIsLoadingAuth(false);
        }
      };

      authenticateUser();
    } else {
      setIsLoadingAuth(false);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ tg, isTelegram, username, isAuthenticated, isLoadingAuth }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegramContext = () => useContext(TelegramContext);

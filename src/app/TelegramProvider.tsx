import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
  tg: TelegramWebApp | null;
  isTelegram: boolean;
  username: string | null;
}

const TelegramContext = createContext<TelegramContextType>({
  tg: null,
  isTelegram: false,
  username: null,
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      // 1. Handshake with Telegram client
      webApp.ready();
      
      // 2. Expand webview bounds to maximum mobile viewport
      webApp.expand();

      // 3. Configure platform container status headers
      webApp.headerColor = "#12141C"; // Matches bg-background-card
      webApp.backgroundColor = "#090A0F"; // Matches bg-background

      setTg(webApp);
      setIsTelegram(true);

      // Extract username metadata to personalize dashboard headers
      if (webApp.initDataUnsafe?.user?.first_name) {
        setUsername(webApp.initDataUnsafe.user.first_name);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ tg, isTelegram, username }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegramContext = () => useContext(TelegramContext);
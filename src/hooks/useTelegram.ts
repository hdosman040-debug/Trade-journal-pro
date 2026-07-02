import { useEffect } from "react";
import { useTelegramContext } from "../app/TelegramProvider";

export function useTelegram() {
  const { tg, isTelegram, username } = useTelegramContext();

  /**
   * Safely triggers vibrational hardware responses (Haptic feedback) on devices.
   */
  const triggerHaptic = (
    type: "light" | "medium" | "heavy" | "success" | "warning" | "error"
  ) => {
    if (!tg) return;

    try {
      if (type === "success" || type === "warning" || type === "error") {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      console.warn("Haptic triggers failed on current platform driver.", e);
    }
  };

  /**
   * Coordinates native back navigation binding lifecycles automatically.
   */
  const setupNativeBackButton = (onBackAction: () => void) => {
    useEffect(() => {
      if (!tg) return;

      const backButton = tg.BackButton;
      
      // Mount native overlays
      backButton.show();
      backButton.onClick(onBackAction);

      // Unmount safely to prevent double-listener conflicts
      return () => {
        backButton.hide();
        backButton.offClick(onBackAction);
      };
    }, [tg, onBackAction]);
  };

  return {
    tg,
    isTelegram,
    username,
    triggerHaptic,
    setupNativeBackButton,
  };
}
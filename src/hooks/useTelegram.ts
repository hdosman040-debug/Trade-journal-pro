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

  return {
    tg,
    isTelegram,
    username,
    triggerHaptic,
  };
}

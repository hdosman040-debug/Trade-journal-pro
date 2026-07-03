import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TradeForm } from "../components/TradeForm";
import { useTelegram } from "../../../hooks/useTelegram";
import { ChevronLeft } from "lucide-react";

export function NewTradePage() {
  const navigate = useNavigate();
  const { tg, isTelegram } = useTelegram();

  // Safe Top-Level React Hook Execution Context for Telegram BackButton
  useEffect(() => {
    if (!tg || !tg.BackButton) return;

    const backButton = tg.BackButton;
    const handleBack = () => navigate(-1);

    try {
      backButton.show();
      backButton.onClick(handleBack);
    } catch (e) {
      console.warn("BackButton not available on this client:", e);
    }

    return () => {
      try {
        backButton.hide();
        backButton.offClick(handleBack);
      } catch (e) {
        console.warn("BackButton cleanup failed:", e);
      }
    };
  }, [tg, navigate]);

  return (
    <div className="space-y-4">
      {/* Hide redundant web fallback controls if running inside native Telegram container */}
      {!isTelegram && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg bg-background-card border border-border text-foreground-muted hover:text-foreground no-tap-highlight cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Log New Trade</h1>
            <p className="text-[10px] text-foreground-muted">Input precise structural parameters</p>
          </div>
        </div>
      )}

      {/* The Interactive Form container */}
      <div className="bg-background-card border border-border rounded-xl p-4">
        <TradeForm />
      </div>
    </div>
  );
}

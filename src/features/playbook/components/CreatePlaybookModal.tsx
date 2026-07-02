import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJournal } from "../../../store/JournalContext";
import { X, BookOpen, AlertCircle } from "lucide-react";

interface CreatePlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlaybookModal({ isOpen, onClose }: CreatePlaybookModalProps) {
  const { addPlaybook } = useJournal();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setValidationError("Playbook setup name is required.");
      return;
    }

    setValidationError("");
    addPlaybook(name.trim(), description.trim() || undefined);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-background-card border-t border-border rounded-t-2xl p-5 shadow-card-shadow z-10 pb-safe"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Add Custom Playbook</h3>
                <p className="text-[10px] text-foreground-muted">Define a strict trading model setup</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-background-surface border border-border text-foreground-muted hover:text-foreground no-tap-highlight"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground-muted mb-1.5 block">Setup Model Name</label>
                <input
                  type="text"
                  placeholder="e.g., Order Block Mitigation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-active transition-all"
                />
                {validationError && (
                  <div className="flex items-center space-x-1.5 mt-1.5 text-trade-loss">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <p className="text-[10px]">{validationError}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-muted mb-1.5 block">Execution Guidelines</label>
                <textarea
                  rows={3}
                  placeholder="What indicators, structure elements, or confirmations must present before firing execution?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background-surface border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-active transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-trade-long hover:bg-trade-long/90 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-glow-profit flex items-center justify-center space-x-2 no-tap-highlight cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Save Playbook Setup</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
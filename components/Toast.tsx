"use client";

import { AnimatePresence, motion } from "framer-motion";

export type ToastState = {
  message: string;
  tone?: "success" | "error" | "info";
};

export function Toast({ toast }: { toast: ToastState | null }) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.message}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-6 right-6 z-50 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
            toast.tone === "error"
              ? "border-rose-300/60 bg-rose-50 text-rose-700"
              : toast.tone === "success"
                ? "border-emerald-300/60 bg-emerald-50 text-emerald-700"
                : "border-slate-300/60 bg-white text-slate-700"
          }`}
        >
          {toast.message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

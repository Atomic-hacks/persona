"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { GenerationType } from "@/lib/types";

export type TabItem = {
  id: GenerationType;
  label: string;
  description: string;
};

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[];
  active: GenerationType;
  onChange: (id: GenerationType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative rounded-full border px-4 py-2 text-sm font-medium transition",
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
            )}
            type="button"
          >
            {isActive ? (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-slate-900"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            ) : null}
            <span className={cn("relative", isActive && "text-white")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

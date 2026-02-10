"use client";

import { forwardRef } from "react";
import type {
  GenerationType,
  GeneratorInputMap,
  GeneratorOutputMap,
} from "@/lib/types";
import { cn } from "@/lib/cn";

const HEADER: Record<GenerationType, { label: string; badge: string }> = {
  persona: { label: "Persona Snapshot", badge: "Persona" },
  scenario: { label: "Scenario Pulse", badge: "Scenario" },
  misinterpretation: { label: "Misinterpretation Radar", badge: "Misread" },
};

type OutputCardProps =
  | {
      type: "persona";
      input: GeneratorInputMap["persona"];
      output: GeneratorOutputMap["persona"];
      className?: string;
    }
  | {
      type: "scenario";
      input: GeneratorInputMap["scenario"];
      output: GeneratorOutputMap["scenario"];
      className?: string;
    }
  | {
      type: "misinterpretation";
      input: GeneratorInputMap["misinterpretation"];
      output: GeneratorOutputMap["misinterpretation"];
      className?: string;
    };

export const OutputCard = forwardRef<HTMLDivElement, OutputCardProps>(
  ({ type, input, output, className }, ref) => {
    const header = HEADER[type];

    return (
      <div
        ref={ref}
        id="export-card"
        className={cn(
          "w-full max-w-[520px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",
          "text-slate-900",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {header.badge}
            </p>
            <h3 className="text-xl font-semibold text-slate-900">
              {header.label}
            </h3>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {header.badge}
          </span>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-relaxed">
          {type === "persona" ? (
            <>
              <div>
                <p className="text-sm font-semibold">{output.title}</p>
                <p className="text-slate-600">{output.oneLiner}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Obsessions
                </p>
                <p>{output.obsessions.join(" · ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Triggers
                </p>
                <p>{output.triggers.join(" · ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Hooks
                </p>
                <p>{output.hooks.join(" · ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tweet Drafts
                </p>
                <ul className="list-disc pl-4">
                  {output.tweetDrafts.map((tweet) => (
                    <li key={tweet}>{tweet}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {type === "scenario" ? (
            <>
              <div>
                <p className="text-sm font-semibold">{output.headline}</p>
                <p className="text-slate-600">{output.scenario}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Chaos {output.chaosLevel}/10
                </span>
                {output.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Next Moves
                </p>
                <p>{output.nextMoves.join(" · ")}</p>
              </div>
            </>
          ) : null}

          {type === "misinterpretation" ? (
            <>
              <div>
                <p className="text-sm font-semibold">{output.headline}</p>
                <p className="text-slate-600">
                  Risk signal: {output.riskSignal}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Misreads
                </p>
                <ul className="list-disc pl-4">
                  {output.misreads.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Predicted Replies
                </p>
                <ul className="list-disc pl-4">
                  {output.predictedReplies.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Fix
                </p>
                <p>{output.fix}</p>
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Inputs: {Object.values(input).join(" · ")}
        </div>
      </div>
    );
  },
);

OutputCard.displayName = "OutputCard";

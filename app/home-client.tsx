"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { OutputCard } from "@/components/OutputCard";
import { Toast, type ToastState } from "@/components/Toast";
import { containsBannedWords } from "@/lib/moderation";
import {
  generateContent,
  randomExample,
  PACK_IDS,
  TONES,
  type GenerationType,
  type PackId,
  type Tone,
  type GeneratorInputMap,
  type GeneratorOutputMap,
} from "@/lib/generators";
import { toPng } from "html-to-image";

const TABS: TabItem[] = [
  {
    id: "persona",
    label: "Persona Generator",
    description: "Make a crisp persona snapshot.",
  },
  {
    id: "scenario",
    label: "Scenario Generator",
    description: "Spin a high-signal scenario.",
  },
  {
    id: "misinterpretation",
    label: "Misinterpretation Generator",
    description: "Spot the risky misreads.",
  },
];

const STORAGE_KEY = "persona:recent";

type OutputState<T extends GenerationType> = {
  output: GeneratorOutputMap[T];
  outputText: string;
  shareCaption: string;
  shareUrl?: string;
};

type RecentItem = {
  id: string;
  shareUrl: string;
  type: GenerationType;
  createdAt: string;
};

type TrendingItem = {
  id: string;
  type: GenerationType;
  output_text: string;
};

const defaultInputs: GeneratorInputMap = {
  persona: {
    topic: "AI content ops",
    goal: "ship weekly proof points",
    voice: "direct",
  },
  scenario: {
    setting: "Your growth team",
    constraint: "the main channel goes dark",
    voice: "scrappy",
  },
  misinterpretation: {
    statement: "We might test the new onboarding flow next week",
    audience: "founders",
    channel: "email",
  },
};

function buildInitialFromParams(params: ReturnType<typeof useSearchParams>) {
  const type = params.get("type") as GenerationType | null;
  const pack = (params.get("pack") as PackId | null) ?? "general";
  const tone = (params.get("tone") as Tone | null) ?? "chill";

  if (!type) {
    return {
      active: "persona" as GenerationType,
      inputs: defaultInputs,
      outputs: {},
      pack,
      tone,
    };
  }

  const nextInputs: GeneratorInputMap = { ...defaultInputs };

  if (type === "persona") {
    nextInputs.persona = {
      topic: params.get("topic") ?? nextInputs.persona.topic,
      goal: params.get("goal") ?? nextInputs.persona.goal,
      voice: params.get("voice") ?? nextInputs.persona.voice,
    };
  }

  if (type === "scenario") {
    nextInputs.scenario = {
      setting: params.get("setting") ?? nextInputs.scenario.setting,
      constraint: params.get("constraint") ?? nextInputs.scenario.constraint,
      voice: params.get("voice") ?? nextInputs.scenario.voice,
    };
  }

  if (type === "misinterpretation") {
    nextInputs.misinterpretation = {
      statement:
        params.get("statement") ?? nextInputs.misinterpretation.statement,
      audience: params.get("audience") ?? nextInputs.misinterpretation.audience,
      channel: params.get("channel") ?? nextInputs.misinterpretation.channel,
    };
  }

  const generated = generateContent(type, nextInputs[type], pack, tone);

  return {
    active: type,
    inputs: nextInputs,
    outputs: {
      [type]: {
        output: generated.output,
        outputText: generated.output_text,
        shareCaption: generated.share_caption,
      },
    },
    pack,
    tone,
  };
}

export default function HomeClient() {
  const params = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const initial = buildInitialFromParams(params);
  const [active, setActive] = useState<GenerationType>(initial.active);
  const [inputs, setInputs] = useState<GeneratorInputMap>(initial.inputs);
  const [outputs, setOutputs] = useState<
    Partial<{
      [K in GenerationType]: OutputState<K>;
    }>
  >(initial.outputs);
  const [pack, setPack] = useState<PackId>(initial.pack);
  const [tone, setTone] = useState<Tone>(initial.tone);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isCopyingCaption, setIsCopyingCaption] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [recent, setRecent] = useState<RecentItem[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    fetch(`/api/trending?days=7&limit=10`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items) setTrending(data.items);
      })
      .catch(() => null)
      .finally(() => setIsTrendingLoading(false));
  }, []);

  const remixHint = useMemo(() => {
    const type = params.get("type") as GenerationType | null;
    return type ? type : null;
  }, [params]);

  const currentOutput = outputs[active];

  function updateRecent(item: RecentItem) {
    const next = [item, ...recent.filter((entry) => entry.id !== item.id)].slice(
      0,
      5,
    );
    setRecent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleGenerate() {
    if (isGenerating) return;
    setIsGenerating(true);
    const generated = generateContent(active, inputs[active], pack, tone);
    setOutputs((prev) => ({
      ...prev,
      [active]: {
        output: generated.output,
        outputText: generated.output_text,
        shareCaption: generated.share_caption,
      },
    }));
    setIsGenerating(false);
  }

  function handleRandom() {
    if (isRandomizing) return;
    setIsRandomizing(true);
    const example = randomExample(active);
    setInputs((prev) => ({ ...prev, [active]: example }));
    const generated = generateContent(active, example, pack, tone);
    setOutputs((prev) => ({
      ...prev,
      [active]: {
        output: generated.output,
        outputText: generated.output_text,
        shareCaption: generated.share_caption,
      },
    }));
    setIsRandomizing(false);
  }

  async function handleCopy() {
    if (!currentOutput) return;
    if (isCopying) return;
    setIsCopying(true);
    await navigator.clipboard.writeText(currentOutput.outputText);
    setToast({ message: "Copied to clipboard.", tone: "success" });
    setIsCopying(false);
  }

  async function handleCopyCaption() {
    if (!currentOutput?.shareCaption) {
      setToast({ message: "Generate something first.", tone: "error" });
      return;
    }
    if (!currentOutput.shareUrl) {
      setToast({ message: "Save first to get a link.", tone: "error" });
      return;
    }
    if (isCopyingCaption) return;
    setIsCopyingCaption(true);
    const caption = currentOutput.shareCaption.replace(
      "{link}",
      currentOutput.shareUrl,
    );
    await navigator.clipboard.writeText(caption);
    setToast({ message: "Share caption copied.", tone: "success" });
    setIsCopyingCaption(false);
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    if (isDownloading) return;
    setIsDownloading(true);
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = `${active}-card.png`;
    link.href = dataUrl;
    link.click();
    setIsDownloading(false);
  }

  async function handleSave() {
    if (isSaving) return;
    const inputValues = Object.values(inputs[active]).join(" ");
    if (containsBannedWords(inputValues)) {
      setToast({
        message: "That input needs a quick edit. Try softer wording.",
        tone: "error",
      });
      return;
    }
    if (!currentOutput) {
      setToast({ message: "Generate something first.", tone: "error" });
      return;
    }

    setIsSaving(true);
    const outputPayload = {
      ...currentOutput.output,
      share_caption: currentOutput.shareCaption,
      meta: { pack, tone },
    };

    const response = await fetch("/api/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: active,
        input: inputs[active],
        output: outputPayload,
        output_text: currentOutput.outputText,
      }),
    });

    const raw = await response.text();
    const payload = raw ? safeJsonParse(raw) : null;

    if (!response.ok) {
      setToast({
        message: payload?.error ?? "Could not save. Check server logs.",
        tone: "error",
      });
      if (!payload) {
        console.error("Save failed with non-JSON response:", raw);
      }
      setIsSaving(false);
      return;
    }

    if (!payload?.id || !payload?.shareUrl) {
      setToast({ message: "Save failed. No share link returned.", tone: "error" });
      console.error("Save response missing fields:", raw);
      setIsSaving(false);
      return;
    }
    const shareUrl = payload.shareUrl as string;

    updateRecent({
      id: payload.id,
      shareUrl,
      type: active,
      createdAt: new Date().toISOString(),
    });

    setOutputs((prev) => ({
      ...prev,
      [active]: {
        ...(prev[active] as OutputState<GenerationType>),
        shareUrl,
      },
    }));

    await navigator.clipboard.writeText(shareUrl);
    setToast({ message: "Saved. Share link copied.", tone: "success" });
    setIsSaving(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toast toast={toast} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                persona
              </p>
              <h1 className="text-4xl font-semibold tracking-tight">
                Content Lab
              </h1>
            </div>
            <span className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500">
              Generate. Save. Share.
            </span>
          </div>
          <p className="max-w-2xl text-base text-slate-600">
            Punchy generators for personas, scenarios, and misreads. Capture the
            output, save it, and remix the loop.
          </p>
        </header>

        <section className="flex flex-col gap-6">
          <Tabs items={TABS} active={active} onChange={setActive} />
          <p className="text-sm text-slate-500">
            {TABS.find((tab) => tab.id === active)?.description}
          </p>
          {remixHint ? (
            <p className="text-xs text-slate-400">Remix loaded from share.</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Selector
              label="Pack"
              value={pack}
              options={PACK_IDS}
              onChange={(value) => setPack(value as PackId)}
            />
            <Selector
              label="Tone"
              value={tone}
              options={TONES}
              onChange={(value) => setTone(value as Tone)}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
            <div className="space-y-6">
              {active === "persona" ? (
                <div className="space-y-4">
                  <Field
                    label="Topic"
                    value={inputs.persona.topic}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        persona: { ...prev.persona, topic: value },
                      }))
                    }
                  />
                  <Field
                    label="Goal"
                    value={inputs.persona.goal}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        persona: { ...prev.persona, goal: value },
                      }))
                    }
                  />
                  <Field
                    label="Voice"
                    value={inputs.persona.voice}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        persona: { ...prev.persona, voice: value },
                      }))
                    }
                  />
                </div>
              ) : null}

              {active === "scenario" ? (
                <div className="space-y-4">
                  <Field
                    label="Setting"
                    value={inputs.scenario.setting}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        scenario: { ...prev.scenario, setting: value },
                      }))
                    }
                  />
                  <Field
                    label="Constraint"
                    value={inputs.scenario.constraint}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        scenario: { ...prev.scenario, constraint: value },
                      }))
                    }
                  />
                  <Field
                    label="Voice"
                    value={inputs.scenario.voice}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        scenario: { ...prev.scenario, voice: value },
                      }))
                    }
                  />
                </div>
              ) : null}

              {active === "misinterpretation" ? (
                <div className="space-y-4">
                  <Field
                    label="Statement"
                    value={inputs.misinterpretation.statement}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        misinterpretation: {
                          ...prev.misinterpretation,
                          statement: value,
                        },
                      }))
                    }
                  />
                  <Field
                    label="Audience"
                    value={inputs.misinterpretation.audience}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        misinterpretation: {
                          ...prev.misinterpretation,
                          audience: value,
                        },
                      }))
                    }
                  />
                  <Field
                    label="Channel"
                    value={inputs.misinterpretation.channel}
                    onChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        misinterpretation: {
                          ...prev.misinterpretation,
                          channel: value,
                        },
                      }))
                    }
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
                <button
                  type="button"
                  onClick={handleRandom}
                  disabled={isRandomizing}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRandomizing ? "Randomizing..." : "Random"}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save & Get Share Link"}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={isCopying}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCopying ? "Copying..." : "Copy Text"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  disabled={isCopyingCaption}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCopyingCaption ? "Copying..." : "Copy Share Caption"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDownloading ? "Downloading..." : "Download PNG"}
                </button>
              </div>
            </div>

            <div className="flex items-start justify-center">
              <AnimatePresence mode="wait">
                {currentOutput ? (
                  <motion.div
                    key={active}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                  >
                    {active === "persona" ? (
                      <OutputCard
                        ref={cardRef}
                        type="persona"
                        input={inputs.persona}
                        output={currentOutput.output as GeneratorOutputMap["persona"]}
                      />
                    ) : null}
                    {active === "scenario" ? (
                      <OutputCard
                        ref={cardRef}
                        type="scenario"
                        input={inputs.scenario}
                        output={currentOutput.output as GeneratorOutputMap["scenario"]}
                      />
                    ) : null}
                    {active === "misinterpretation" ? (
                      <OutputCard
                        ref={cardRef}
                        type="misinterpretation"
                        input={inputs.misinterpretation}
                        output={currentOutput.output as GeneratorOutputMap["misinterpretation"]}
                      />
                    ) : null}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    className="flex h-[360px] w-full max-w-xl items-center justify-center rounded-3xl border border-dashed border-slate-200 text-sm text-slate-400"
                  >
                    Generate to preview the card.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Trending</h2>
              <span className="text-xs text-slate-400">Last 7 days</span>
            </div>
            <div className="grid gap-3">
              {isTrendingLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                  Loading trending...
                </div>
              ) : trending.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                  Nothing trending yet. Save a few and check back.
                </div>
              ) : (
                trending.map((item) => (
                  <a
                    key={item.id}
                    href={`/r/${item.id}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 transition hover:border-slate-300"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.type}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {item.output_text}
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent</h2>
              <span className="text-xs text-slate-400">
                For fun. Don’t be weird.
              </span>
            </div>
            <div className="grid gap-3">
              {recent.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                  No saved links yet.
                </div>
              ) : (
                recent.map((item) => (
                  <a
                    key={item.id}
                    href={item.shareUrl}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 transition hover:border-slate-300"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.type}
                    </div>
                    <div className="mt-2 font-medium">{item.shareUrl}</div>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function Selector({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-semibold text-slate-800 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function safeJsonParse(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

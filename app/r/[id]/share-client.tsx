"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { OutputCard } from "@/components/OutputCard";
import { Toast, type ToastState } from "@/components/Toast";
import type {
  GenerationType,
  GeneratorInputMap,
  GeneratorOutputMap,
  PackId,
  Tone,
  StoredOutput,
} from "@/lib/types";

export type SharePayload = {
  id: string;
  type: GenerationType;
  input: GeneratorInputMap[GenerationType];
  output: StoredOutput<GenerationType>;
  output_text: string;
};

export default function ShareClient({ payload }: { payload: SharePayload }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isRemixing, setIsRemixing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isCopyingCaption, setIsCopyingCaption] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const key = `persona:viewed:${payload.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/generations/${payload.id}/view`, { method: "POST" });
  }, [payload.id]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  function buildRemixParams() {
    const params = new URLSearchParams();
    params.set("type", payload.type);
    const input = payload.input as GeneratorInputMap[typeof payload.type];
    Object.entries(input).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    const meta = payload.output.meta as { pack?: PackId; tone?: Tone } | undefined;
    if (meta?.pack) params.set("pack", meta.pack);
    if (meta?.tone) params.set("tone", meta.tone);
    return params.toString();
  }

  async function handleCopy() {
    if (isCopying) return;
    setIsCopying(true);
    await navigator.clipboard.writeText(payload.output_text);
    setToast({ message: "Copied to clipboard.", tone: "success" });
    setIsCopying(false);
  }

  async function handleCopyCaption() {
    const caption = payload.output.share_caption;
    if (!caption) {
      setToast({ message: "No share caption yet.", tone: "error" });
      return;
    }
    if (isCopyingCaption) return;
    setIsCopyingCaption(true);
    const link = window.location.href;
    await navigator.clipboard.writeText(caption.replace("{link}", link));
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
    link.download = `${payload.type}-card.png`;
    link.href = dataUrl;
    link.click();
    setIsDownloading(false);
  }

  async function handleRemix() {
    if (isRemixing) return;
    setIsRemixing(true);
    await fetch(`/api/generations/${payload.id}/remix`, { method: "POST" });
    router.push(`/?${buildRemixParams()}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toast toast={toast} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            persona
          </p>
          <h1 className="text-3xl font-semibold">Share Link</h1>
          <p className="text-sm text-slate-500">
            Remix, copy, or download this output.
          </p>
        </header>

        <div className="flex flex-col items-center gap-6">
          {payload.type === "persona" ? (
            <OutputCard
              ref={cardRef}
              type="persona"
              input={payload.input as GeneratorInputMap["persona"]}
              output={payload.output as GeneratorOutputMap["persona"]}
            />
          ) : null}
          {payload.type === "scenario" ? (
            <OutputCard
              ref={cardRef}
              type="scenario"
              input={payload.input as GeneratorInputMap["scenario"]}
              output={payload.output as GeneratorOutputMap["scenario"]}
            />
          ) : null}
          {payload.type === "misinterpretation" ? (
            <OutputCard
              ref={cardRef}
              type="misinterpretation"
              input={payload.input as GeneratorInputMap["misinterpretation"]}
              output={payload.output as GeneratorOutputMap["misinterpretation"]}
            />
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRemix}
              disabled={isRemixing}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRemixing ? "Remixing..." : "Remix"}
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
          <p className="text-xs text-slate-400">For fun. Don’t be weird.</p>
        </div>
      </div>
    </div>
  );
}

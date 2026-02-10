import { z } from "zod";
import type { GeneratorSpec } from "@/lib/generators/spec";
import type { Pack } from "@/lib/generators/packs";

export type MisinterpretationInput = {
  statement: string;
  audience: string;
  channel: string;
};

export type MisinterpretationOutput = {
  headline: string;
  misreads: string[];
  riskSignal: string;
  predictedReplies: string[];
  fix: string;
};

const inputSchema = z
  .object({
    statement: z.string().min(2),
    audience: z.string().min(2),
    channel: z.string().min(2),
  })
  .passthrough();

export const misinterpretationSpec: GeneratorSpec<
  MisinterpretationInput,
  MisinterpretationOutput,
  Pack
> = {
  type: "misinterpretation",
  inputSchema,
  normalizeInput: (input) => {
    const parsed = inputSchema.parse(input);
    return {
      statement: parsed.statement.trim(),
      audience: parsed.audience.trim(),
      channel: parsed.channel.trim(),
    };
  },
  generate: ({ input, pack, pick, pickMany, range, tone }) => {
    const headline = `Misread in ${input.channel} by ${input.audience}`;
    const misreads = pickMany(pack.misreads, 3);
    const predictedReplies = pickMany(pack.replies, 3);
    const riskSignal = `${range(2, 9)}.${range(1, 9)} / 10`;
    const fix = pick([
      "Add a one-line disclaimer.",
      "Pin a follow-up with the actual scope.",
      "Repeat the timeline in plain English.",
      "Move it to a short doc + link it.",
    ]);

    const output: MisinterpretationOutput = {
      headline,
      misreads,
      riskSignal,
      predictedReplies,
      fix,
    };

    const output_text = [
      headline,
      `Risk signal: ${riskSignal}`,
      "Misreads:",
      ...misreads.map((item) => `- ${item}`),
      "Predicted replies:",
      ...predictedReplies.map((item) => `- ${item}`),
      `Fix: ${fix}`,
    ].join("\n");

    const share_caption = pick(pack.captions[tone]);

    return { output, output_text, share_caption };
  },
};

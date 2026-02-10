import { z } from "zod";
import type { GeneratorSpec } from "@/lib/generators/spec";
import type { Pack } from "@/lib/generators/packs";

export type ScenarioInput = {
  setting: string;
  constraint: string;
  voice: string;
};

export type ScenarioOutput = {
  headline: string;
  scenario: string;
  chaosLevel: number;
  tags: string[];
  nextMoves: string[];
};

const inputSchema = z
  .object({
    setting: z.string().min(2),
    constraint: z.string().min(2),
    voice: z.string().min(2),
  })
  .passthrough();

export const scenarioSpec: GeneratorSpec<ScenarioInput, ScenarioOutput, Pack> = {
  type: "scenario",
  inputSchema,
  normalizeInput: (input) => {
    const parsed = inputSchema.parse(input);
    return {
      setting: parsed.setting.trim(),
      constraint: parsed.constraint.trim(),
      voice: parsed.voice.trim(),
    };
  },
  generate: ({ input, pack, pick, pickMany, range, tone }) => {
    const headline = `${pick(pack.scenarioOpeners)} ${input.setting}`;
    const twist = pick(pack.scenarioTwists);
    const scenario = `${input.setting} is running on ${input.voice} energy when ${input.constraint} hits. Then ${twist}.`;
    const chaosLevel = range(4, 9);
    const tags = pickMany(
      ["pivot", "speedrun", "content debt", "scrappy ops", "hard reset"],
      3,
    );
    const nextMoves = pickMany(pack.scenarioMoves, 2);

    const output: ScenarioOutput = {
      headline,
      scenario,
      chaosLevel,
      tags,
      nextMoves,
    };

    const output_text = [
      headline,
      scenario,
      `Chaos level: ${chaosLevel}/10`,
      `Tags: ${tags.join(", ")}`,
      `Next moves: ${nextMoves.join(" | ")}`,
    ].join("\n");

    const share_caption = pick(pack.captions[tone]);

    return { output, output_text, share_caption };
  },
};

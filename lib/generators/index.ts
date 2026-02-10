/* eslint-disable @typescript-eslint/no-explicit-any */
import { PACKS } from "@/lib/generators/packs";
import type { Pack } from "@/lib/generators/packs";
import {
  GENERATION_TYPES,
  GeneratorSpec,
  PACK_IDS,
  TONES,
  type GenerationType,
  type PackId,
  type Tone,
} from "@/lib/generators/spec";
import { seedFromParts, mulberry32, pick, pickMany, range } from "@/lib/generators/seed";
import { personaSpec, type PersonaInput, type PersonaOutput } from "@/lib/generators/persona";
import { scenarioSpec, type ScenarioInput, type ScenarioOutput } from "@/lib/generators/scenario";
import { misinterpretationSpec, type MisinterpretationInput, type MisinterpretationOutput } from "@/lib/generators/misinterpretation";

export { GENERATION_TYPES, PACK_IDS, TONES };
export type { GenerationType, PackId, Tone };
export type { PersonaInput, PersonaOutput };
export type { ScenarioInput, ScenarioOutput };
export type { MisinterpretationInput, MisinterpretationOutput };

const SPECS: Record<GenerationType, GeneratorSpec<any, any, Pack>> = {
  persona: personaSpec,
  scenario: scenarioSpec,
  misinterpretation: misinterpretationSpec,
};

export type GeneratorInputMap = {
  persona: PersonaInput;
  scenario: ScenarioInput;
  misinterpretation: MisinterpretationInput;
};

export type GeneratorOutputMap = {
  persona: PersonaOutput;
  scenario: ScenarioOutput;
  misinterpretation: MisinterpretationOutput;
};

export type GeneratedPayload<T extends GenerationType> = {
  output: GeneratorOutputMap[T];
  output_text: string;
  share_caption: string;
};

export type StoredOutput<T extends GenerationType> = GeneratorOutputMap[T] & {
  share_caption?: string;
  meta?: {
    pack: PackId;
    tone: Tone;
  };
};

export function getPack(id: PackId) {
  return PACKS[id];
}

export function generateContent<T extends GenerationType>(
  type: T,
  input: GeneratorInputMap[T],
  packId: PackId,
  tone: Tone,
): GeneratedPayload<T> {
  const spec = SPECS[type];
  const pack = PACKS[packId] as Pack;
  const normalized = spec.normalizeInput(input) as GeneratorInputMap[T];
  const seed = seedFromParts(type, packId, tone, JSON.stringify(normalized));
  const rand = mulberry32(seed);

  return (spec as GeneratorSpec<GeneratorInputMap[T], GeneratorOutputMap[T], Pack>).generate({
    seed,
    tone,
    pack,
    input: normalized as GeneratorInputMap[T],
    rand,
    pick: <U>(list: U[]) => pick(rand, list),
    pickMany: <U>(list: U[], count: number) => pickMany(rand, list, count),
    range: (min: number, max: number) => range(rand, min, max),
  }) as GeneratedPayload<T>;
}

export const EXAMPLE_INPUTS: GeneratorInputMap = {
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

export function randomExample<T extends GenerationType>(type: T) {
  const pools: { [K in GenerationType]: GeneratorInputMap[K][] } = {
    persona: [
      EXAMPLE_INPUTS.persona,
      {
        topic: "creator workflows",
        goal: "double weekly output",
        voice: "calm",
      },
      {
        topic: "B2B SaaS launches",
        goal: "keep retention tight",
        voice: "sharp",
      },
    ],
    scenario: [
      EXAMPLE_INPUTS.scenario,
      {
        setting: "Your design pod",
        constraint: "the brief changes overnight",
        voice: "focused",
      },
      {
        setting: "A founder-led marketing sprint",
        constraint: "the deadline shrinks to 48 hours",
        voice: "high-energy",
      },
    ],
    misinterpretation: [
      EXAMPLE_INPUTS.misinterpretation,
      {
        statement: "We can explore the pricing change later",
        audience: "sales",
        channel: "Slack",
      },
      {
        statement: "We might ship a beta for power users",
        audience: "community",
        channel: "Twitter",
      },
    ],
  };
  const pool = pools[type] as GeneratorInputMap[T][];
  return pool[Math.floor(Math.random() * pool.length)];
}

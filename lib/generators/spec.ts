import { z } from "zod";

export const GENERATION_TYPES = [
  "persona",
  "scenario",
  "misinterpretation",
] as const;
export type GenerationType = (typeof GENERATION_TYPES)[number];

export const TONES = ["chill", "savage", "professional"] as const;
export type Tone = (typeof TONES)[number];

export const PACK_IDS = ["general", "devTwitter", "naijaTwitter"] as const;
export type PackId = (typeof PACK_IDS)[number];

export type GeneratorContext<I, P> = {
  seed: number;
  tone: Tone;
  pack: P;
  input: I;
  rand: () => number;
  pick<T>(list: T[]): T;
  pickMany<T>(list: T[], count: number): T[];
  range(min: number, max: number): number;
};

export type GeneratorResult<O> = {
  output: O;
  output_text: string;
  share_caption: string;
};

export type GeneratorSpec<I, O, P> = {
  type: GenerationType;
  inputSchema: z.ZodType<I>;
  normalizeInput: (input: unknown) => I;
  generate: (ctx: GeneratorContext<I, P>) => GeneratorResult<O>;
};

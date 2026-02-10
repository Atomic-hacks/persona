import { z } from "zod";
import type { GeneratorSpec } from "@/lib/generators/spec";
import type { Pack } from "@/lib/generators/packs";

export type PersonaInput = {
  topic: string;
  goal: string;
  voice: string;
};

export type PersonaOutput = {
  title: string;
  oneLiner: string;
  obsessions: string[];
  triggers: string[];
  hooks: string[];
  tweetDrafts: string[];
};

const inputSchema = z
  .object({
    topic: z.string().min(2),
    goal: z.string().min(2),
    voice: z.string().min(2),
  })
  .passthrough();

export const personaSpec: GeneratorSpec<PersonaInput, PersonaOutput, Pack> = {
  type: "persona",
  inputSchema,
  normalizeInput: (input) => {
    const parsed = inputSchema.parse(input);
    return {
      topic: parsed.topic.trim(),
      goal: parsed.goal.trim(),
      voice: parsed.voice.trim(),
    };
  },
  generate: ({ input, pack, tone, pick, pickMany, range }) => {
    const title = pick(pack.personaTitles);
    const obsessions = pickMany(pack.personaObsessions, 3);
    const triggers = pickMany(pack.personaTriggers, 2);
    const hooks = pickMany(pack.personaHooks, 3);

    const tweetDrafts = pack.personaTweetFormats.map((format) =>
      format
        .replace("{topic}", input.topic)
        .replace("{goal}", input.goal)
        .concat(` (${range(4, 9)}/10)`),
    );

    const oneLiner = `${input.voice} ${input.topic} builder chasing ${input.goal}.`;

    const output: PersonaOutput = {
      title,
      oneLiner,
      obsessions,
      triggers,
      hooks,
      tweetDrafts,
    };

    const output_text = [
      `Persona: ${title}`,
      oneLiner,
      `Obsessions: ${obsessions.join(", ")}`,
      `Triggers: ${triggers.join(", ")}`,
      `Hooks: ${hooks.join(", ")}`,
      "Tweet drafts:",
      ...tweetDrafts.map((tweet) => `- ${tweet}`),
    ].join("\n");

    const share_caption = pick(pack.captions[tone]);

    return { output, output_text, share_caption };
  },
};

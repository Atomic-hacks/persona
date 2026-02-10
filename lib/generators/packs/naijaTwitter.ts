import type { Tone } from "@/lib/generators/spec";

export const naijaTwitterPack = {
  id: "naijaTwitter",
  label: "Naija Twitter",
  personaTitles: [
    "Soft-Life Strategist",
    "Vibes & Velocity",
    "No Long Talk",
    "Chop-Life Operator",
    "Evidence Merchant",
    "Heat-Check Captain",
  ],
  personaObsessions: [
    "sharp delivery",
    "results you can screenshot",
    "clean receipts",
    "quick flexes",
    "short threads",
    "consistent drops",
  ],
  personaTriggers: [
    "long story without point",
    "empty promises",
    "unnecessary drama",
    "unclear goals",
  ],
  personaHooks: [
    "no long talk, ship it",
    "turn the gist into a template",
    "keep it short, keep it strong",
    "drop receipts and keep moving",
  ],
  personaTweetFormats: [
    "No long talk about {topic}. Here’s the cheat code:",
    "If you want {goal}, do this first:",
    "I tested {topic} so you don’t have to:",
    "Real gist: {topic} works when you do this:",
  ],
  scenarioOpeners: [
    "Hot afternoon:",
    "Right before the pitch:",
    "After the tweet goes viral:",
    "The day the client returns:",
  ],
  scenarioTwists: [
    "client wants everything yesterday",
    "the timeline shrinks overnight",
    "a competitor quotes your thread",
    "your best asset disappears",
  ],
  scenarioMoves: [
    "cut the noise, ship the core",
    "rename the plan, sell the angle",
    "turn pressure into a template",
    "drop a fast follow-up and move",
  ],
  misreads: [
    "They thought it was already live.",
    "They took the gist as the final plan.",
    "They heard promise, not proposal.",
    "They assumed budget was unlimited.",
  ],
  replies: [
    "So we can announce?",
    "Is this confirmed?",
    "Should we pause the old one?",
    "Is this the new normal?",
  ],
  captions: {
    chill: [
      "My persona just exposed me 😅 Try yours: {link}",
      "This scenario loud. Spin yours: {link}",
      "Misread levels high. Try it: {link}",
    ],
    savage: [
      "Persona dragged me. Your turn: {link}",
      "Scenario dragged us. Spin yours: {link}",
      "Misreads everywhere. Try it: {link}",
    ],
    professional: [
      "Persona snapshot done. Try yours: {link}",
      "Scenario pulse done. Generate yours: {link}",
      "Misinterpretation check done. Try it: {link}",
    ],
  } satisfies Record<Tone, string[]>,
};

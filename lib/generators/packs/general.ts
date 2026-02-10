import type { Tone } from "@/lib/generators/spec";

export const generalPack = {
  id: "general",
  label: "General",
  personaTitles: [
    "Signal Seeker",
    "Clarity Addict",
    "Execution Engine",
    "Low-Drama Operator",
    "Narrative Cleaner",
    "Feedback Magnet",
  ],
  personaObsessions: [
    "clear outcomes",
    "repeatable systems",
    "fast feedback loops",
    "clean screenshots",
    "practical templates",
    "tight copy",
  ],
  personaTriggers: [
    "vague roadmaps",
    "meetings without owners",
    "vanity metrics",
    "fluffy launch notes",
    "undefined success",
  ],
  personaHooks: [
    "ship the thin slice",
    "turn chaos into a playbook",
    "optimize for momentum",
    "build for reuse",
    "write once, deploy everywhere",
  ],
  personaTweetFormats: [
    "3 things I learned about {topic} this week:",
    "If you want {goal}, stop doing this:",
    "The fastest way to {goal} is:",
    "I tested 5 {topic} workflows. The winner:",
  ],
  scenarioOpeners: [
    "Launch morning:",
    "Mid-sprint surprise:",
    "Right after you ship:",
    "You wake up to:",
  ],
  scenarioTwists: [
    "half the budget disappears",
    "leadership wants a new angle",
    "the audience shifts overnight",
    "a competitor copies the format",
  ],
  scenarioMoves: [
    "cut scope to the heartbeat",
    "rename the story in 12 words",
    "ship a scrappy v1 and log learnings",
    "turn the mishap into a case study",
  ],
  misreads: [
    "They heard a promise, not a pilot.",
    "They assumed it shipped already.",
    "They took the joke as policy.",
    "They thought the timeline was fixed.",
  ],
  replies: [
    "Wait, is this locked in?",
    "So can we tell partners?",
    "Is this the new default?",
    "Should we pause the old plan?",
  ],
  captions: {
    chill: [
      "My internet persona just exposed me 😅 Try yours: {link}",
      "This scenario is too real. Spin yours: {link}",
      "We got cooked in the misread simulator. Your turn: {link}",
    ],
    savage: [
      "My persona read me for filth. Try yours: {link}",
      "This scenario dragged us. Spin yours: {link}",
      "Misread meter is flashing red. Try it: {link}",
    ],
    professional: [
      "Generated a quick persona snapshot. Try yours: {link}",
      "Scenario pulse for the week. Generate yours: {link}",
      "Misinterpretation check complete. Try it: {link}",
    ],
  } satisfies Record<Tone, string[]>,
};

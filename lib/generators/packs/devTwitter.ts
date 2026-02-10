import type { Tone } from "@/lib/generators/spec";

export const devTwitterPack = {
  id: "devTwitter",
  label: "Dev Twitter",
  personaTitles: [
    "Ship-It Gremlin",
    "MVP Archaeologist",
    "DX Whisperer",
    "Latency Hater",
    "Build Log Maximalist",
    "Refactor Realist",
  ],
  personaObsessions: [
    "pragmatic wins",
    "punchy screenshots",
    "clean diffs",
    "automations that save minutes",
    "clean readmes",
    "crisp changelogs",
  ],
  personaTriggers: [
    "vibes-based roadmaps",
    "heroic all-nighters",
    "unclear ownership",
    "overly clever abstractions",
  ],
  personaHooks: [
    "ship the small thing daily",
    "log the decisions, not the drama",
    "turn bugs into content",
    "show the diff",
  ],
  personaTweetFormats: [
    "Ship log: {topic} -> {goal} in 72 hours:",
    "Stop polishing {topic}. Do this instead:",
    "I rebuilt {topic} in a weekend. Results:",
    "Dev confession: {goal} got easier when I did this:",
  ],
  scenarioOpeners: [
    "Deploy day:",
    "Two minutes before demo:",
    "CI is red:",
    "Right after merge:",
  ],
  scenarioTwists: [
    "prod traffic spikes 10x",
    "someone merges without tests",
    "the new feature becomes the homepage",
    "a customer live-tweets the bug",
  ],
  scenarioMoves: [
    "ship a hotfix + write the postmortem",
    "cut scope and save the demo",
    "rename the feature and update the changelog",
    "make a template from the chaos",
  ],
  misreads: [
    "They read the spike as a promise.",
    "They assumed the API was stable.",
    "They thought the GIF was the final UI.",
    "They took the quick hack as the new pattern.",
  ],
  replies: [
    "Is this prod-ready?",
    "Can I ship this today?",
    "Is the old endpoint dead?",
    "Should we announce?",
  ],
  captions: {
    chill: [
      "Dev Twitter persona dropped. Try yours: {link}",
      "This scenario hit prod 😅 Spin yours: {link}",
      "Misread simulator is wild. Try it: {link}",
    ],
    savage: [
      "My persona got roasted. Your turn: {link}",
      "This scenario is chaos. Spin yours: {link}",
      "Misreads were loud. Try it: {link}",
    ],
    professional: [
      "Generated a dev persona snapshot. Try yours: {link}",
      "Scenario pulse for the team. Generate yours: {link}",
      "Misinterpretation check for rollout. Try it: {link}",
    ],
  } satisfies Record<Tone, string[]>,
};

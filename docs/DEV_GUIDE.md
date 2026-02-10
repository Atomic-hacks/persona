# Persona Content Lab – Dev Guide

## 1) Where Generator Packs Live
Packs live in:
- `lib/generators/packs/`

Each pack is a plain object with short template arrays used by the generators. The active pack is selected on the Home page and passed into the generator pipeline.

## 2) How to Add a New Pack (Example)
1. Create a new file, e.g. `lib/generators/packs/latamTwitter.ts`.
2. Copy the structure from `lib/generators/packs/general.ts`.
3. Add it to the export map in `lib/generators/packs/index.ts`.

Example structure:
- `personaTitles`, `personaObsessions`, `personaTriggers`, `personaHooks`, `personaTweetFormats`
- `scenarioOpeners`, `scenarioTwists`, `scenarioMoves`
- `misreads`, `replies`
- `captions` (per tone)

## 3) How to Add a New Tone
Tones live in `lib/generators/spec.ts`:
- Add the new tone string to `TONES`.
- Add a caption list for the new tone in every pack file.

If you want tone to affect more than captions, use it inside each generator file:
- `lib/generators/persona.ts`
- `lib/generators/scenario.ts`
- `lib/generators/misinterpretation.ts`

## 4) How to Tweak Output Templates Without Touching Core Logic
Update the arrays inside any pack file in `lib/generators/packs/`. The generators pull directly from these arrays, so you can tweak language without editing generator logic.

## 5) Where Share Captions Are Generated
Share captions are generated inside each generator file:
- `lib/generators/persona.ts`
- `lib/generators/scenario.ts`
- `lib/generators/misinterpretation.ts`

They select a short caption from `pack.captions[tone]`. The caption is stored with the output and used for “Copy Share Caption”.

## 6) Where Trending Query Is Implemented
- API route: `app/api/trending/route.ts`
- DB access: `lib/repo/generations.ts` (`getTrending`)

The query returns top items by `view_count` within the last N days.

## 7) How Remix Works End-to-End
1. On the share page, Remix builds query params:
   - `type`, `pack`, `tone`, and the original input fields.
2. The Home page reads those params in `buildInitialFromParams` and pre-fills inputs.
3. The generator runs immediately to show the remixed card.
4. Remix click also hits `POST /api/generations/[id]/remix`.

Key files:
- `app/r/[id]/share-client.tsx` (builds Remix params, triggers remix API)
- `app/home-client.tsx` (reads params, pre-fills inputs, generates output)

## Notes
- Generator core entry point: `lib/generators/index.ts`
- Deterministic seed: `lib/generators/seed.ts`

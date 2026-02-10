import { generalPack } from "@/lib/generators/packs/general";
import { devTwitterPack } from "@/lib/generators/packs/devTwitter";
import { naijaTwitterPack } from "@/lib/generators/packs/naijaTwitter";
import type { PackId } from "@/lib/generators/spec";

export const PACKS = {
  general: generalPack,
  devTwitter: devTwitterPack,
  naijaTwitter: naijaTwitterPack,
} satisfies Record<PackId, typeof generalPack>;

export type Pack = (typeof PACKS)[keyof typeof PACKS];

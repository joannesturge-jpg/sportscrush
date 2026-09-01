import { CharacterProfile, EvidenceItem } from "@/lib/game/types";

export type LaptopContent =
  | { type: "briefing" }
  | { type: "evidence"; item: EvidenceItem }
  | { type: "character"; item: CharacterProfile }
  | { type: "solved"; summary: string; suspectName: string };

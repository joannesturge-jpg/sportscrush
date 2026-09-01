import { Room, Story } from "./types";

export type PublicStory = Omit<Story, "solutionCharacterId" | "solutionSummary">;

export function toPublicStory(story: Story): PublicStory {
  const { solutionCharacterId, solutionSummary, ...rest } = story;
  return rest;
}

export interface PublicRoom extends Room {
  solution?: { characterId: string; summary: string };
}

export function toPublicRoom(room: Room, solution: { characterId: string; summary: string }): PublicRoom {
  if (!room.solved) return { ...room };
  return { ...room, solution };
}

import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/game/store";
import { toPublicRoom } from "@/lib/game/public";
import { promStory } from "@/lib/game/story";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name : "";
  if (!name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const { room, player } = roomStore.createRoom(name);
  return NextResponse.json({
    room: toPublicRoom(room, { characterId: promStory.solutionCharacterId, summary: promStory.solutionSummary }),
    player,
  });
}

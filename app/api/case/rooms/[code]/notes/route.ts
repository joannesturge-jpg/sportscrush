import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/game/store";
import { toPublicRoom } from "@/lib/game/public";
import { promStory } from "@/lib/game/story";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const body = await req.json().catch(() => ({}));
  const playerId = typeof body.playerId === "string" ? body.playerId : "";
  const notes = typeof body.notes === "string" ? body.notes : "";

  const result = roomStore.updateNotes(params.code, playerId, notes);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    room: toPublicRoom(result, { characterId: promStory.solutionCharacterId, summary: promStory.solutionSummary }),
  });
}

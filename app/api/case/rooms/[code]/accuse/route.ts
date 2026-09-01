import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/game/store";
import { toPublicRoom } from "@/lib/game/public";
import { promStory } from "@/lib/game/story";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const body = await req.json().catch(() => ({}));
  const playerId = typeof body.playerId === "string" ? body.playerId : "";
  const suspectId = typeof body.suspectId === "string" ? body.suspectId : "";

  if (!suspectId) {
    return NextResponse.json({ error: "Pick a suspect first." }, { status: 400 });
  }

  const result = roomStore.accuse(params.code, playerId, suspectId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const correct = suspectId === promStory.solutionCharacterId;
  return NextResponse.json({
    correct,
    room: toPublicRoom(result, { characterId: promStory.solutionCharacterId, summary: promStory.solutionSummary }),
  });
}

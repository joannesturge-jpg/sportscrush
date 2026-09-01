import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/game/store";
import { toPublicRoom } from "@/lib/game/public";
import { promStory } from "@/lib/game/story";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name : "";

  const result = roomStore.joinRoom(params.code, name);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    room: toPublicRoom(result.room, {
      characterId: promStory.solutionCharacterId,
      summary: promStory.solutionSummary,
    }),
    player: result.player,
  });
}

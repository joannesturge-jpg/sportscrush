import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/game/store";
import { toPublicRoom } from "@/lib/game/public";
import { promStory } from "@/lib/game/story";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const room = roomStore.getRoom(params.code);
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
  return NextResponse.json({
    room: toPublicRoom(room, { characterId: promStory.solutionCharacterId, summary: promStory.solutionSummary }),
  });
}

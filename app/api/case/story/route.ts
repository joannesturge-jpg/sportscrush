import { NextResponse } from "next/server";
import { promStory } from "@/lib/game/story";
import { toPublicStory } from "@/lib/game/public";

export async function GET() {
  return NextResponse.json({ story: toPublicStory(promStory) });
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ProductFormData, StandardizedProduct } from "@/lib/types";
import { FORMAT_TEMPLATE } from "@/lib/format-template";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const form: ProductFormData = await req.json();

  const systemPrompt = `You are a product listing specialist for a sports card and collectibles resale business.
Always respond with valid JSON only - no markdown fences, no extra text.

${FORMAT_TEMPLATE}`;

  const userPrompt = `Create a standardized listing for this product.

Product info:
- Raw product name: ${form.name}
- Condition: ${form.condition}
- Sealed: ${form.sealed}
- Quantity: ${form.quantity}

Return ONLY this JSON with no markdown:
{
  "title": "full standardized product title",
  "description": "HTML description",
  "tags": ["tag1", "tag2"]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const standardized: StandardizedProduct = JSON.parse(text);

    return NextResponse.json({ standardized });
  } catch (err) {
    console.error("Standardize error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Standardization failed" },
      { status: 500 }
    );
  }
}

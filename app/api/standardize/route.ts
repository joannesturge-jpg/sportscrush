import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ProductFormData, StandardizedProduct } from "@/lib/types";
import { FORMAT_TEMPLATE } from "@/lib/format-template";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const form: ProductFormData = await req.json();

  const systemPrompt = `You are a product listing specialist for a sports card and collectibles resale business.
Your job is to:
1. Search your knowledge to find the correct full product name for vintage sports cards and collectibles
2. Standardize the title and write a description that matches the company's exact format

${FORMAT_TEMPLATE}

Always respond with valid JSON only — no markdown fences, no extra text.`;

  const userPrompt = `Create a standardized listing for this product.

Product info provided:
- Raw product name: ${form.name}
- Condition: ${form.condition}
- Sealed: ${form.sealed}
- Quantity: ${form.quantity}

Steps:
1. Use your knowledge to identify the exact full product name (year, brand, sport/league, set name, pack/card count). Look for details like total card count, total pack count, any special subsets or rookie cards included.
2. Write the title following the format template examples exactly.
3. Write the HTML description following the format template exactly. NO em dashes (—) anywhere — use hyphens (-) or commas instead. Use the condition and sealed status to inform the description.
4. Generate 5-8 relevant tags (e.g. sport name, year, brand, "factory sealed", "vintage", "collectible").

Return a JSON object with these exact keys:
{
  "title": "full standardized product title",
  "description": "HTML description following the format template",
  "tags": ["tag1", "tag2"]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
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

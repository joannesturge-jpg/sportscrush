/**
 * Product name and description format for SportsCrush listings.
 */
export const FORMAT_TEMPLATE = `
## TITLE FORMAT
Search Google for the full, accurate product name. Then format it to match these examples exactly:
- 1990 Fleer Premier Edition Football Cards Sealed Box – 36 Unopened Packs
- 1990 Score NHL Rookie & Traded – 110 Player Card Factory Sealed Complete Set
- 1990-91 Upper Deck NHL Hockey High Number Series Factory Sealed
- 1990-91 Upper Deck NHL Collector's Choice Wayne Gretzky Factory Sealed Set – 36 Packs
- 1991 Score MLB Collector Kirby Puckett Factory Sealed Set – 900 Player Cards
- 1991 Score MLB Rookie & Traded Factory Sealed Set – 110 Player Cards & 10 Magic Motion Cards

Rules for the title:
- Include year/season, brand, sport/league, and product type
- If sealed, include "Factory Sealed" or "Sealed" in the title
- After the dash (–), include key details like pack count or card count if known
- Do NOT use em dashes (—), only use en dashes (–) in titles

## DESCRIPTION FORMAT
Write HTML using this exact structure (no em dashes — use hyphens or commas instead):

<p><strong>[Exciting opening hook sentence about the product -- straight from [year]!]</strong></p>
<p>[2-3 sentence paragraph describing what makes this product special for collectors. Mention year, brand, sport, sealed status, and the thrill of collecting it.]</p>
<ul>
[Bullet points with key facts: sealed status, pack/card count, year, gift suitability, condition]
</ul>

Rules for the description:
- NO em dashes (—) anywhere. Use hyphens (-) or commas instead.
- Use <strong> for the opening hook only
- Keep bullet points short and punchy
- Tone: enthusiastic but not over-the-top, aimed at sports card collectors
`;

import { NextRequest, NextResponse } from "next/server";
import { ProductFormData, StandardizedProduct, PublishResult } from "@/lib/types";

interface PublishPayload {
  formData: ProductFormData;
  standardized: StandardizedProduct;
}

export async function POST(req: NextRequest) {
  const { formData, standardized }: PublishPayload = await req.json();

  const results = await Promise.allSettled([
    pushToSheets(formData, standardized),
    pushToShopify(formData, standardized),
    pushToEbay(formData, standardized),
    pushToShipStation(formData, standardized),
  ]);

  const publishResults: PublishResult[] = results.map((r, i) => {
    const platform = (["sheets", "shopify", "ebay", "shipstation"] as const)[i];
    if (r.status === "fulfilled") return r.value;
    return { platform, success: false, error: String(r.reason) };
  });

  return NextResponse.json({ results: publishResults });
}

// ─── Google Sheets (via Apps Script web app) ──────────────────────────────────

async function pushToSheets(
  form: ProductFormData,
  std: StandardizedProduct
): Promise<PublishResult> {
  const platform = "sheets" as const;
  const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;

  if (!scriptUrl) {
    return { platform, success: false, configured: false, error: "Not configured yet" };
  }

  const now = new Date().toISOString().split("T")[0];

  const res = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      row: [
        now,
        std.title,
        form.condition,
        form.sealed,
        form.quantity,
        form.lengthIn,
        form.widthIn,
        form.heightIn,
        form.weightOz,
        std.tags.join(", "),
        "",
      ],
    }),
  });

  if (!res.ok) throw new Error(`Sheets script ${res.status}: ${await res.text()}`);

  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Apps Script error");

  return { platform, success: true };
}

// ─── Shopify ──────────────────────────────────────────────────────────────────

async function pushToShopify(
  form: ProductFormData,
  std: StandardizedProduct
): Promise<PublishResult> {
  const platform = "shopify" as const;
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!domain || !token) {
    return { platform, success: false, configured: false, error: "Not configured yet" };
  }

  const productBody = {
    product: {
      title: std.title,
      body_html: std.description,
      tags: std.tags.join(", "),
      status: "draft",
      variants: [
        {
          inventory_management: "shopify",
          inventory_policy: "deny",
          inventory_quantity: form.quantity,
          weight: form.weightOz,
          weight_unit: "oz",
          requires_shipping: true,
        },
      ],
    },
  };

  const createRes = await fetch(
    `https://${domain}.myshopify.com/admin/api/2024-01/products.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify(productBody),
    }
  );

  if (!createRes.ok) throw new Error(`Shopify ${createRes.status}: ${await createRes.text()}`);

  const { product } = await createRes.json();
  const inventoryItemId = product.variants[0]?.inventory_item_id;

  if (inventoryItemId) {
    const locRes = await fetch(
      `https://${domain}.myshopify.com/admin/api/2024-01/locations.json`,
      { headers: { "X-Shopify-Access-Token": token } }
    );
    if (locRes.ok) {
      const { locations } = await locRes.json();
      const locationId = locations?.[0]?.id;
      if (locationId) {
        await fetch(
          `https://${domain}.myshopify.com/admin/api/2024-01/inventory_levels/set.json`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
            body: JSON.stringify({ location_id: locationId, inventory_item_id: inventoryItemId, available: form.quantity }),
          }
        );
      }
    }
  }

  return {
    platform, success: true,
    url: `https://${domain}.myshopify.com/admin/products/${product.id}`,
    id: String(product.id),
  };
}

// ─── eBay ─────────────────────────────────────────────────────────────────────

async function pushToEbay(
  form: ProductFormData,
  std: StandardizedProduct
): Promise<PublishResult> {
  const platform = "ebay" as const;
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;
  const devId = process.env.EBAY_DEV_ID;
  const userToken = process.env.EBAY_USER_TOKEN;

  if (!appId || !certId || !devId || !userToken) {
    return { platform, success: false, configured: false, error: "Not configured yet" };
  }

  const sandbox = process.env.EBAY_SANDBOX === "true";
  const endpoint = sandbox
    ? "https://api.sandbox.ebay.com/ws/api.dll"
    : "https://api.ebay.com/ws/api.dll";

  const ebayConditionId =
    form.condition === "Mint" ? (form.sealed === "Yes" ? 1000 : 3000) :
    form.condition === "Good" ? 4000 : 7000;

  const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<AddFixedPriceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>${userToken}</eBayAuthToken></RequesterCredentials>
  <Item>
    <Title>${escapeXml(std.title.slice(0, 80))}</Title>
    <Description><![CDATA[${std.description}]]></Description>
    <PrimaryCategory><CategoryID>213</CategoryID></PrimaryCategory>
    <StartPrice>0.00</StartPrice>
    <ConditionID>${ebayConditionId}</ConditionID>
    <Country>US</Country><Currency>USD</Currency>
    <ListingDuration>GTC</ListingDuration>
    <ListingType>FixedPriceItem</ListingType>
    <Quantity>${form.quantity}</Quantity>
    <ShippingDetails>
      <ShippingType>Flat</ShippingType>
      <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingService>USPSPriority</ShippingService>
        <ShippingServiceCost>0.00</ShippingServiceCost>
      </ShippingServiceOptions>
    </ShippingDetails>
    <ShipToLocations>US</ShipToLocations><Site>US</Site>
    <ShippingPackageDetails>
      <WeightUnit>oz</WeightUnit>
      <WeightMinor>${Math.round(form.weightOz)}</WeightMinor>
    </ShippingPackageDetails>
  </Item>
  <ErrorLanguage>en_US</ErrorLanguage><WarningLevel>High</WarningLevel>
</AddFixedPriceItemRequest>`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
      "X-EBAY-API-CALL-NAME": "AddFixedPriceItem",
      "X-EBAY-API-SITEID": "0",
      "X-EBAY-API-APP-NAME": appId,
      "X-EBAY-API-CERT-NAME": certId,
      "X-EBAY-API-DEV-NAME": devId,
    },
    body: xmlBody,
  });

  const text = await res.text();
  if (text.includes("<Ack>Failure</Ack>")) {
    const msg = text.match(/<LongMessage>(.*?)<\/LongMessage>/)?.[1] ?? "Unknown eBay error";
    throw new Error(msg);
  }

  const itemId = text.match(/<ItemID>(\d+)<\/ItemID>/)?.[1];
  const url = sandbox
    ? `https://www.sandbox.ebay.com/itm/${itemId}`
    : `https://www.ebay.com/itm/${itemId}`;
  return { platform, success: true, url, id: itemId };
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ─── ShipStation ──────────────────────────────────────────────────────────────

async function pushToShipStation(
  form: ProductFormData,
  std: StandardizedProduct
): Promise<PublishResult> {
  const platform = "shipstation" as const;
  const key = process.env.SHIPSTATION_API_KEY;
  const secret = process.env.SHIPSTATION_API_SECRET;

  if (!key || !secret) {
    return { platform, success: false, configured: false, error: "Not configured yet" };
  }

  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const body = {
    sku: std.title.slice(0, 50),
    name: std.title,
    weightOz: form.weightOz,
    length: form.lengthIn || null,
    width: form.widthIn || null,
    height: form.heightIn || null,
    active: true,
    tags: std.tags.map((name) => ({ name })),
  };

  const res = await fetch("https://ssapi.shipstation.com/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`ShipStation ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    platform, success: true,
    id: String(data.productId),
    url: `https://ship13.shipstation.com/products/edit#/${data.productId}`,
  };
}

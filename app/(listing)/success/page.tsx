"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PublishResult } from "@/lib/types";

const PLATFORM_META: Record<string, { label: string; icon: string }> = {
  sheets: { label: "Google Sheets", icon: "📊" },
  shopify: { label: "Shopify", icon: "🛍️" },
  ebay: { label: "eBay", icon: "🏷️" },
  shipstation: { label: "ShipStation", icon: "📦" },
};

export default function SuccessPage() {
  const router = useRouter();
  const [results, setResults] = useState<PublishResult[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("listing-results");
    if (!raw) { router.push("/"); return; }
    setResults(JSON.parse(raw));
  }, [router]);

  function startNew() {
    localStorage.removeItem("listing-form");
    localStorage.removeItem("listing-session");
    localStorage.removeItem("listing-results");
    router.push("/");
  }

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl">🎉</div>
      <h1 className="text-2xl font-bold">Product Published!</h1>
      <p className="text-gray-500">Your listing is now live on all platforms.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 text-left">
        {results.map((r) => {
          const meta = PLATFORM_META[r.platform];
          return (
            <div key={r.platform} className="flex items-center gap-3">
              <span className="text-2xl">{meta?.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{meta?.label}</p>
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {r.url}
                  </a>
                )}
              </div>
              <span className="text-green-500 font-bold">✓</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={startNew}
        className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition"
      >
        + Add Another Product
      </button>
    </div>
  );
}

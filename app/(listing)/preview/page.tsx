"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionData, PublishResult } from "@/lib/types";

export default function PreviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [results, setResults] = useState<PublishResult[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("listing-session");
    if (!raw) { router.push("/"); return; }
    setSession(JSON.parse(raw));
  }, [router]);

  if (!session) return <p className="text-gray-500">Loading…</p>;

  const { formData, standardized } = session;

  async function publish() {
    setPublishing(true);
    setError("");
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, standardized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setResults(data.results);
      // Navigate to success only if all platforms succeeded
      if (data.results.every((r: PublishResult) => r.success)) {
        localStorage.setItem("listing-results", JSON.stringify(data.results));
        router.push("/success");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review Listing</h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Edit
        </button>
      </div>

      {/* Standardized output */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Standardized Title</h2>
        <p className="text-lg font-medium">{standardized.title}</p>

        <h2 className="font-semibold text-gray-800 mt-4">Description</h2>
        <div
          className="prose prose-sm max-w-none text-gray-700 border rounded-lg p-4 bg-gray-50 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: standardized.description }}
        />

        <h2 className="font-semibold text-gray-800 mt-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {standardized.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Platform breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Will be published to</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "sheets", label: "Google Sheets", icon: "📊" },
            { key: "shopify", label: "Shopify", icon: "🛍️" },
            { key: "ebay", label: "eBay", icon: "🏷️" },
            { key: "shipstation", label: "ShipStation", icon: "📦" },
          ].map(({ key, label, icon }) => {
            const r = results?.find((r) => r.platform === key);
            return (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  !r
                    ? "border-gray-200 bg-gray-50"
                    : r.success
                    ? "border-green-200 bg-green-50"
                    : r.configured === false
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  {r?.success && r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View →
                    </a>
                  )}
                  {r?.success === false && r.configured === false && (
                    <p className="text-xs text-yellow-700">Pending setup</p>
                  )}
                  {r?.success === false && r.configured !== false && (
                    <p className="text-xs text-red-600">{r.error}</p>
                  )}
                  {!r && (
                    <p className="text-xs text-gray-400">
Qty: {formData.quantity} · {formData.condition}                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {results && results.some((r) => !r.success && r.configured !== false) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Some platforms failed. You can retry publishing or check the errors above.
        </div>
      )}

      {!results && (
        <button
          onClick={publish}
          disabled={publishing}
          className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {publishing ? "Publishing to all platforms…" : "Publish to All Platforms ✓"}
        </button>
      )}

      {results && results.some((r) => !r.success && r.configured !== false) && (
        <button
          onClick={publish}
          disabled={publishing}
          className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {publishing ? "Retrying…" : "Retry Failed Platforms"}
        </button>
      )}
    </div>
  );
}

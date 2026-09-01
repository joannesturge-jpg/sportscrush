"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductFormData } from "@/lib/types";

const EMPTY: ProductFormData = {
  name: "",
  quantity: 1,
  condition: "Mint",
  sealed: "Yes",
  lengthIn: 0,
  widthIn: 0,
  heightIn: 0,
  weightOz: 0,
};

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("listing-form");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("listing-form", JSON.stringify(next));
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/standardize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Standardization failed");
      localStorage.setItem(
        "listing-session",
        JSON.stringify({ formData: form, standardized: data.standardized })
      );
      router.push("/preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Product Listing</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Fill in the details below — AI will look up the full product name and write the description.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Product Details</h2>

        <Field label="Product Name" required>
          <input
            className={input}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. 1990 Fleer Football Cards"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            A rough name is fine — AI will search for the full correct name.
          </p>
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Inventory Level" required>
            <input
              className={input}
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) => update("quantity", parseInt(e.target.value) || 0)}
              required
            />
          </Field>

          <Field label="Condition" required>
            <select
              className={input}
              value={form.condition}
              onChange={(e) => update("condition", e.target.value as ProductFormData["condition"])}
            >
              <option>Mint</option>
              <option>Good</option>
              <option>Damaged</option>
            </select>
          </Field>

          <Field label="Sealed?" required>
            <select
              className={input}
              value={form.sealed}
              onChange={(e) => update("sealed", e.target.value as "Yes" | "No")}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </Field>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Dimensions (inches)</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Length">
              <input
                className={input}
                type="number"
                min="0"
                step="0.01"
                value={form.lengthIn || ""}
                onChange={(e) => update("lengthIn", parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </Field>
            <Field label="Width">
              <input
                className={input}
                type="number"
                min="0"
                step="0.01"
                value={form.widthIn || ""}
                onChange={(e) => update("widthIn", parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </Field>
            <Field label="Height">
              <input
                className={input}
                type="number"
                min="0"
                step="0.01"
                value={form.heightIn || ""}
                onChange={(e) => update("heightIn", parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </Field>
          </div>
        </div>

        <Field label="Weight (oz)" required>
          <input
            className={input}
            type="number"
            min="0"
            step="0.01"
            value={form.weightOz || ""}
            onChange={(e) => update("weightOz", parseFloat(e.target.value) || 0)}
            placeholder="0.0"
            required
          />
        </Field>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Looking up product & writing description…" : "Search & Standardize →"}
      </button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

const input =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";

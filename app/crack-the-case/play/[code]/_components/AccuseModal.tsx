"use client";

import { useState } from "react";
import { CharacterProfile } from "@/lib/game/types";

export default function AccuseModal({
  suspects,
  playerName,
  initialSuspectId,
  onClose,
  onSubmit,
}: {
  suspects: CharacterProfile[];
  playerName: string;
  initialSuspectId?: string;
  onClose: () => void;
  onSubmit: (suspectId: string) => Promise<{ correct: boolean }>;
}) {
  const [suspectId, setSuspectId] = useState(initialSuspectId ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  async function handleSubmit() {
    if (!suspectId) return;
    setBusy(true);
    try {
      const { correct } = await onSubmit(suspectId);
      setResult(correct ? "correct" : "incorrect");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="ctc-panel max-w-md w-full p-6">
        {result === "correct" ? (
          <>
            <h3 className="ctc-arcade ctc-neon-pink text-base mb-4">CASE CRACKED</h3>
            <p className="text-lg mb-6">
              {playerName}, you got it. Check the laptop screen — the full story is waiting for the whole
              room.
            </p>
            <button className="ctc-btn ctc-btn-primary w-full" onClick={onClose}>
              View the Reveal
            </button>
          </>
        ) : result === "incorrect" ? (
          <>
            <h3 className="ctc-arcade ctc-neon-cyan text-base mb-4">NOT ENOUGH EVIDENCE</h3>
            <p className="text-lg mb-6">That's not who did it. Keep digging through the evidence board.</p>
            <button className="ctc-btn w-full" onClick={onClose}>
              Back to the Case
            </button>
          </>
        ) : (
          <>
            <h3 className="ctc-arcade ctc-neon-pink text-base mb-4">MAKE AN ACCUSATION</h3>
            <p className="text-sm text-[var(--ctc-text-dim)] mb-4">
              Who do you think is responsible? Choose carefully — the whole room will see the result.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto ctc-scrollbar mb-6 pr-1">
              {suspects.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-start gap-3 px-3 py-2 rounded-lg border cursor-pointer ${
                    suspectId === s.id
                      ? "border-[var(--ctc-pink)] bg-[rgba(255,47,176,0.1)]"
                      : "border-[var(--ctc-line)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="suspect"
                    className="mt-1"
                    checked={suspectId === s.id}
                    onChange={() => setSuspectId(s.id)}
                  />
                  <span>
                    <span className="block">{s.name}</span>
                    <span className="block text-sm text-[var(--ctc-text-dim)]">{s.role}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="ctc-btn flex-1" onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button
                className="ctc-btn ctc-btn-primary flex-1"
                onClick={handleSubmit}
                disabled={busy || !suspectId}
              >
                {busy ? "Submitting…" : "Submit Accusation"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

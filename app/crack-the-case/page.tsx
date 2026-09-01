"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadLastName, saveIdentity } from "@/lib/game/client";

export default function CrackTheCaseHome() {
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(loadLastName());
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Detective, we need your name first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/case/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't start a case.");
      saveIdentity(data.room.code, { playerId: data.player.id, name: data.player.name });
      router.push(`/crack-the-case/room/${data.room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Detective, we need your name first.");
      return;
    }
    if (!roomCode.trim()) {
      setError("Enter the room code your host shared with you.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const code = roomCode.trim().toUpperCase();
      const res = await fetch(`/api/case/rooms/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't join that room.");
      saveIdentity(data.room.code, { playerId: data.player.id, name: data.player.name });
      router.push(`/crack-the-case/room/${data.room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ctc-grid-floor min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="relative z-10 w-full max-w-md text-center">
        <p className="ctc-arcade ctc-neon-cyan text-[0.6rem] sm:text-xs tracking-[0.35em] mb-4">
          RIDGEVIEW POLICE DEPT. · MAY 1987
        </p>
        <h1 className="ctc-arcade ctc-neon-pink ctc-cursor text-2xl sm:text-4xl leading-tight mb-2">
          CRACK
          <br />
          THE CASE
        </h1>
        <p className="text-lg text-[var(--ctc-text-dim)] mb-10">
          A girl vanished on her way to prom. Read the evidence. Question everyone.
          Find out who — and why.
        </p>

        <div className="ctc-panel p-6 sm:p-8">
          <div className="flex gap-2 mb-6 justify-center">
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`ctc-btn flex-1 ${mode === "create" ? "ctc-btn-primary" : ""}`}
            >
              Start a Case
            </button>
            <button
              type="button"
              onClick={() => setMode("join")}
              className={`ctc-btn flex-1 ${mode === "join" ? "ctc-btn-cyan" : ""}`}
            >
              Join a Room
            </button>
          </div>

          <form onSubmit={mode === "create" ? handleCreate : handleJoin} className="space-y-4 text-left">
            <div>
              <label className="block text-sm text-[var(--ctc-text-dim)] mb-1">Your name</label>
              <input
                className="ctc-input w-full"
                placeholder="e.g. Detective Ramirez"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {mode === "join" && (
              <div>
                <label className="block text-sm text-[var(--ctc-text-dim)] mb-1">Room code</label>
                <input
                  className="ctc-input w-full uppercase tracking-[0.3em] text-center"
                  placeholder="XXXXX"
                  value={roomCode}
                  maxLength={5}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />
              </div>
            )}

            {error && <p className="text-sm text-[var(--ctc-pink-soft)]">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className={`ctc-btn w-full ${mode === "create" ? "ctc-btn-primary" : "ctc-btn-cyan"}`}
            >
              {busy ? "One moment…" : mode === "create" ? "Open a Case File" : "Join Investigation"}
            </button>
          </form>
        </div>

        <p className="text-xs text-[var(--ctc-text-dim)] mt-8">
          Play solo or gather the whole squad — everyone shares one evidence board and one notes pad.
        </p>
      </div>
    </div>
  );
}

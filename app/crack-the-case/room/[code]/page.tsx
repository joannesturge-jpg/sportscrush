"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadIdentity, loadLastName, saveIdentity, StoredIdentity } from "@/lib/game/client";
import { Room } from "@/lib/game/types";

export default function RoomLobby() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = (params.code || "").toUpperCase();

  const [identity, setIdentity] = useState<StoredIdentity | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [joinName, setJoinName] = useState("");
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = loadIdentity(code);
    setIdentity(stored);
    setJoinName(loadLastName());
  }, [code]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/case/rooms/${code}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Room not found.");
          setRoom(null);
          return;
        }
        setError("");
        setRoom(data.room);
        if (data.room.status === "active" || data.room.status === "solved") {
          router.replace(`/crack-the-case/play/${code}`);
        }
      } catch {
        // transient network hiccup, keep polling
      }
    }

    poll();
    pollRef.current = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [code, router]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinName.trim()) {
      setError("Enter your name to join.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/case/rooms/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: joinName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't join that room.");
      saveIdentity(code, { playerId: data.player.id, name: data.player.name });
      setIdentity({ playerId: data.player.id, name: data.player.name });
      setRoom(data.room);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleStart() {
    if (!identity) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/case/rooms/${code}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: identity.playerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't start the case.");
      setRoom(data.room);
      router.replace(`/crack-the-case/play/${code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/crack-the-case/room/${code}`);
    } catch {
      // clipboard unavailable, ignore
    }
  }

  if (error && !room) {
    return (
      <div className="ctc-grid-floor min-h-screen flex items-center justify-center px-4">
        <div className="ctc-panel p-8 max-w-sm text-center relative z-10">
          <p className="ctc-neon-pink text-lg mb-4">{error}</p>
          <button className="ctc-btn ctc-btn-cyan" onClick={() => router.push("/crack-the-case")}>
            Back to Start
          </button>
        </div>
      </div>
    );
  }

  const isHost = identity && room && identity.playerId === room.hostId;
  const needsToJoin = room && !identity;

  return (
    <div className="ctc-grid-floor min-h-screen flex items-center justify-center px-4 py-16">
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <p className="ctc-arcade ctc-neon-cyan text-[0.55rem] sm:text-xs tracking-[0.08em] mb-3">
            CASE FILE ROOM
          </p>
          <div className="ctc-panel inline-block px-6 py-3">
            <span className="ctc-arcade ctc-neon-pink text-xl sm:text-2xl tracking-[0.12em]">{code}</span>
          </div>
          <p className="text-sm text-[var(--ctc-text-dim)] mt-3">Share this code so others can join.</p>
          <button className="ctc-btn mt-3 text-sm" onClick={copyLink}>
            Copy Invite Link
          </button>
        </div>

        {needsToJoin && (
          <form onSubmit={handleJoin} className="ctc-panel p-6 mb-6 space-y-3">
            <label className="block text-sm text-[var(--ctc-text-dim)]">Enter your name to join this case</label>
            <input
              className="ctc-input w-full"
              placeholder="e.g. Detective Ramirez"
              value={joinName}
              maxLength={40}
              onChange={(e) => setJoinName(e.target.value)}
            />
            <button type="submit" disabled={busy} className="ctc-btn ctc-btn-cyan w-full">
              Join Investigation
            </button>
          </form>
        )}

        {room && (
          <div className="ctc-panel p-6">
            <p className="text-sm text-[var(--ctc-text-dim)] mb-3">
              Players in the room ({room.players.length})
            </p>
            <ul className="space-y-2 mb-6">
              {room.players.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between bg-black/20 border border-[var(--ctc-line)] rounded-lg px-3 py-2"
                >
                  <span>{p.name}</span>
                  {p.id === room.hostId && (
                    <span className="ctc-arcade text-[0.55rem] ctc-neon-pink">HOST</span>
                  )}
                </li>
              ))}
            </ul>

            {error && <p className="text-sm text-[var(--ctc-pink-soft)] mb-3">{error}</p>}

            {isHost ? (
              <button onClick={handleStart} disabled={busy} className="ctc-btn ctc-btn-primary w-full">
                {busy ? "Opening the case…" : "Ready — Start the Case"}
              </button>
            ) : (
              <p className="text-center text-sm text-[var(--ctc-text-dim)]">
                Waiting for the host to start the case…
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

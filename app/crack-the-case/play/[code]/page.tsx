"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadIdentity, StoredIdentity } from "@/lib/game/client";
import { EvidenceItem, EvidenceCategory } from "@/lib/game/types";
import type { PublicRoom, PublicStory } from "@/lib/game/public";
import Laptop from "./_components/Laptop";
import AccuseModal from "./_components/AccuseModal";
import { LaptopContent } from "./_components/types";

type Tab = "evidence" | "notes" | "suspects";

const CATEGORY_LABEL: Record<EvidenceCategory, string> = {
  correspondence: "Emails",
  photograph: "Photographs",
  transcript: "Interrogation Transcripts",
};

const CATEGORY_ORDER: EvidenceCategory[] = ["correspondence", "photograph", "transcript"];

export default function PlayScreen() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = (params.code || "").toUpperCase();

  const [identity, setIdentity] = useState<StoredIdentity | null | undefined>(undefined);
  const [story, setStory] = useState<PublicStory | null>(null);
  const [room, setRoom] = useState<PublicRoom | null>(null);
  const [tab, setTab] = useState<Tab>("evidence");
  const [navExpanded, setNavExpanded] = useState(true);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [laptopMode, setLaptopMode] = useState<"briefing" | "evidence" | "character" | "solved">("briefing");
  const [accuseOpen, setAccuseOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const notesFocused = useRef(false);
  const lastLocalEdit = useRef(0);
  const wasSolved = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = loadIdentity(code);
    setIdentity(stored);
    if (!stored) {
      router.replace(`/crack-the-case/room/${code}`);
    }
  }, [code, router]);

  useEffect(() => {
    fetch("/api/case/story")
      .then((r) => r.json())
      .then((d) => setStory(d.story))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!identity) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/case/rooms/${code}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled || !res.ok) return;
        const nextRoom: PublicRoom = data.room;
        setRoom(nextRoom);

        if (nextRoom.solved && !wasSolved.current) {
          wasSolved.current = true;
          setLaptopMode("solved");
        }

        if (!notesFocused.current && Date.now() - lastLocalEdit.current > 1500) {
          setNotes((current) => (current === nextRoom.notes ? current : nextRoom.notes));
        }
      } catch {
        // transient network hiccup, keep polling
      }
    }

    poll();
    const id = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [code, identity]);

  const saveNotes = useCallback(
    (value: string) => {
      if (!identity) return;
      setNotesSaving(true);
      fetch(`/api/case/rooms/${code}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: identity.playerId, notes: value }),
      })
        .catch(() => {})
        .finally(() => setNotesSaving(false));
    },
    [code, identity]
  );

  function handleNotesChange(value: string) {
    setNotes(value);
    lastLocalEdit.current = Date.now();
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveNotes(value), 700);
  }

  async function handleAccuse(suspectId: string): Promise<{ correct: boolean }> {
    if (!identity) return { correct: false };
    const res = await fetch(`/api/case/rooms/${code}/accuse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: identity.playerId, suspectId }),
    });
    const data = await res.json();
    if (res.ok) {
      setRoom(data.room);
      if (data.correct) {
        wasSolved.current = true;
      }
    }
    return { correct: Boolean(data.correct) };
  }

  if (identity === undefined || !room || !story) {
    return (
      <div className="ctc-grid-floor min-h-screen flex items-center justify-center">
        <p className="ctc-arcade ctc-neon-cyan text-xs relative z-10 animate-pulse">LOADING CASE FILE…</p>
      </div>
    );
  }

  const evidenceById = new Map(story.evidence.map((e) => [e.id, e]));
  const characterById = new Map(story.characters.map((c) => [c.id, c]));
  const suspects = story.characters.filter((c) => c.isSuspect);
  const others = story.characters.filter((c) => !c.isSuspect);

  let laptopContent: LaptopContent | null = { type: "briefing" };
  if (laptopMode === "solved" && room.solution) {
    laptopContent = {
      type: "solved",
      summary: room.solution.summary,
      suspectName: characterById.get(room.solution.characterId)?.name ?? "Unknown",
    };
  } else if (laptopMode === "evidence" && selectedEvidenceId) {
    const item = evidenceById.get(selectedEvidenceId);
    if (item) laptopContent = { type: "evidence", item };
  } else if (laptopMode === "character" && selectedCharacterId) {
    const item = characterById.get(selectedCharacterId);
    if (item) laptopContent = { type: "character", item };
  }

  function selectEvidence(item: EvidenceItem) {
    setSelectedEvidenceId(item.id);
    setLaptopMode("evidence");
    setNavExpanded(false);
  }

  function selectCharacter(id: string) {
    setSelectedCharacterId(id);
    setLaptopMode("character");
    setNavExpanded(false);
  }

  function selectTab(t: Tab) {
    if (tab === t) {
      setNavExpanded((v) => !v);
    } else {
      setTab(t);
      setNavExpanded(true);
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-[var(--ctc-line)] px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 justify-between sticky top-0 bg-[var(--ctc-bg-deep)]/95 backdrop-blur z-20">
        <div>
          <p className="ctc-arcade ctc-neon-pink text-[0.55rem] sm:text-xs tracking-[0.2em]">CRACK THE CASE</p>
          <p className="text-sm text-[var(--ctc-text-dim)]">
            Room <span className="text-[var(--ctc-cyan)]">{code}</span> · {room.players.length} investigator
            {room.players.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {room.solved ? (
            <span className="ctc-arcade text-[0.55rem] ctc-neon-cyan">CASE CLOSED</span>
          ) : (
            <button className="ctc-btn ctc-btn-primary text-sm" onClick={() => setAccuseOpen(true)}>
              Make an Accusation
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <aside className="ctc-panel p-4 h-fit lg:sticky lg:top-24">
          <div className="flex gap-1 mb-4">
            {(["evidence", "notes", "suspects"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => selectTab(t)}
                className={`ctc-tab flex-1 flex items-center justify-center gap-1 ${tab === t ? "ctc-tab-active" : ""}`}
              >
                {t === "evidence" ? "Evidence" : t === "notes" ? "Notepad" : "Suspects"}
                <span
                  className={`lg:hidden inline-block text-xs transition-transform ${
                    tab === t && navExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>
            ))}
          </div>

          {tab === "evidence" && (
            <div
              className={`${navExpanded ? "block" : "hidden"} lg:block space-y-5 max-h-[65vh] overflow-y-auto ctc-scrollbar pr-1`}
            >
              <button
                onClick={() => {
                  setLaptopMode("briefing");
                  setNavExpanded(false);
                }}
                className={`ctc-tab w-full ${laptopMode === "briefing" ? "ctc-tab-active" : ""}`}
              >
                📁 The Case
              </button>
              {CATEGORY_ORDER.map((cat) => {
                const items = story.evidence.filter((e) => e.category === cat);
                if (!items.length) return null;
                return (
                  <div key={cat}>
                    <p className="text-xs uppercase tracking-widest text-[var(--ctc-text-dim)] mb-2">
                      {CATEGORY_LABEL[cat]}
                    </p>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => selectEvidence(item)}
                          className={`ctc-tab ctc-evidence-item w-full ${
                            laptopMode === "evidence" && selectedEvidenceId === item.id ? "ctc-tab-active" : ""
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "notes" && (
            <div className={`${navExpanded ? "block" : "hidden"} lg:block`}>
              <p className="text-xs text-[var(--ctc-text-dim)] mb-2">
                Shared with the whole room — everyone can read and edit.
                {notesSaving && <span className="text-[var(--ctc-cyan)]"> Saving…</span>}
              </p>
              <textarea
                className="ctc-input w-full h-[50vh] resize-none ctc-scrollbar"
                placeholder="Jot down theories, timelines, motives…"
                value={notes}
                onFocus={() => (notesFocused.current = true)}
                onBlur={() => (notesFocused.current = false)}
                onChange={(e) => handleNotesChange(e.target.value)}
              />
              {room.notesUpdatedBy && (
                <p className="text-xs text-[var(--ctc-text-dim)] mt-2">Last edited by {room.notesUpdatedBy}</p>
              )}
            </div>
          )}

          {tab === "suspects" && (
            <div
              className={`${navExpanded ? "block" : "hidden"} lg:block max-h-[65vh] overflow-y-auto ctc-scrollbar pr-1 space-y-5`}
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--ctc-text-dim)] mb-2">Suspects</p>
                <div className="space-y-1">
                  {suspects.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => selectCharacter(c.id)}
                      className={`ctc-tab w-full ${
                        laptopMode === "character" && selectedCharacterId === c.id ? "ctc-tab-active" : ""
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--ctc-text-dim)] mb-2">Others</p>
                <div className="space-y-1">
                  {others.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => selectCharacter(c.id)}
                      className={`ctc-tab w-full ${
                        laptopMode === "character" && selectedCharacterId === c.id ? "ctc-tab-active" : ""
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              {room.accusations.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--ctc-text-dim)] mb-2">
                    Investigation Log
                  </p>
                  <ul className="space-y-1 text-sm text-[var(--ctc-text-dim)]">
                    {room.accusations
                      .slice()
                      .reverse()
                      .map((a, i) => (
                        <li key={i}>
                          <span className="text-[var(--ctc-text)]">{a.playerName}</span> accused{" "}
                          {characterById.get(a.suspectId)?.name ?? "someone"} —{" "}
                          {a.correct ? (
                            <span className="text-[var(--ctc-cyan)]">correct!</span>
                          ) : (
                            <span>not enough evidence</span>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </aside>

        <div className="flex items-start justify-center pt-2">
          <Laptop content={laptopContent} story={story} onAccuse={() => setAccuseOpen(true)} />
        </div>
      </div>

      {accuseOpen && identity && (
        <AccuseModal
          suspects={suspects}
          playerName={identity.name}
          initialSuspectId={selectedCharacterId ?? undefined}
          onClose={() => {
            setAccuseOpen(false);
            if (wasSolved.current) setLaptopMode("solved");
          }}
          onSubmit={handleAccuse}
        />
      )}
    </div>
  );
}

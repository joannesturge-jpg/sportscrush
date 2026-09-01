import { Story } from "@/lib/game/types";
import { LaptopContent } from "./types";
import PhotoArt from "./PhotoArt";

export default function Laptop({
  content,
  story,
  onAccuse,
}: {
  content: LaptopContent | null;
  story: Pick<Story, "title" | "setup">;
  onAccuse?: (suspectId: string) => void;
}) {
  return (
    <div className="ctc-laptop">
      <div className="ctc-laptop-notch" />
      <div className="ctc-laptop-bezel">
        <div className="ctc-screen ctc-scrollbar overflow-y-auto p-5 sm:p-7" style={{ minHeight: 460, maxHeight: "70vh" }}>
          {!content && <BriefingScreen story={story} />}
          {content?.type === "briefing" && <BriefingScreen story={story} />}
          {content?.type === "evidence" && <EvidenceScreen item={content.item} />}
          {content?.type === "character" && <CharacterScreen item={content.item} onAccuse={onAccuse} />}
          {content?.type === "solved" && <SolvedScreen summary={content.summary} suspectName={content.suspectName} />}
        </div>
      </div>
      <div className="ctc-laptop-base" />
    </div>
  );
}

function ScreenHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 text-xs text-[var(--ctc-text-dim)]">
      <span className="w-2 h-2 rounded-full bg-[var(--ctc-cyan)] inline-block" />
      {label}
    </div>
  );
}

function BriefingScreen({ story }: { story: Pick<Story, "title" | "setup"> }) {
  return (
    <div>
      <ScreenHeader label="CASE_FILE.TXT" />
      <h2 className="ctc-arcade ctc-neon-pink text-base sm:text-lg mb-4 leading-relaxed">{story.title}</h2>
      <p className="text-lg leading-relaxed whitespace-pre-line">{story.setup}</p>
      <p className="mt-6 text-[var(--ctc-text-dim)] text-base">
        ← Open a file from the evidence list, or check the Suspects tab.
      </p>
    </div>
  );
}

function EvidenceScreen({ item }: { item: import("@/lib/game/types").EvidenceItem }) {
  return (
    <div>
      <ScreenHeader label={item.category === "correspondence" ? "MAIL.SYS" : item.category === "photograph" ? "PHOTO_VIEWER" : "TRANSCRIPT.DOC"} />
      <h2 className="ctc-arcade ctc-neon-cyan text-sm sm:text-base mb-1 leading-relaxed">{item.title}</h2>
      <p className="text-sm text-[var(--ctc-text-dim)] mb-1">{item.subtitle}</p>
      <p className="text-xs text-[var(--ctc-text-dim)] mb-5">{item.date}</p>

      {item.thread && (
        <div className="space-y-3">
          {item.thread.map((m, i) => (
            <div key={i} className="ctc-thread-bubble px-4 py-3">
              <div className="flex justify-between text-sm mb-1 text-[var(--ctc-cyan)]">
                <span className="font-bold">{m.from}</span>
                <span className="text-[var(--ctc-text-dim)]">{m.time}</span>
              </div>
              <p className="text-lg leading-snug">{m.text}</p>
            </div>
          ))}
        </div>
      )}

      {item.photo && (
        <div className="flex flex-col items-center">
          <div className={`ctc-polaroid w-full max-w-sm ${item.photo.scene === "traffic-cam" ? "" : ""}`}>
            <div className={`ctc-photo-surface ${item.photo.scene === "traffic-cam" ? "ctc-static" : ""}`}>
              <PhotoArt scene={item.photo.scene} />
            </div>
            <p className="text-sm mt-2 px-1 leading-snug">{item.photo.caption}</p>
          </div>
          {item.photo.note && (
            <p className="text-base text-[var(--ctc-yellow)] mt-4 max-w-sm text-center leading-snug">
              ★ {item.photo.note}
            </p>
          )}
        </div>
      )}

      {item.transcript && (
        <div>
          <p className="text-sm text-[var(--ctc-text-dim)] mb-4">
            Subject: <span className="text-[var(--ctc-text)]">{item.transcript.subject}</span> · Interviewer:{" "}
            <span className="text-[var(--ctc-text)]">{item.transcript.interviewer}</span>
          </p>
          <div className="space-y-2">
            {item.transcript.lines.map((l, i) => (
              <p key={i} className="text-lg leading-snug">
                <span className="font-bold text-[var(--ctc-pink-soft)]">{l.speaker}: </span>
                {l.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CharacterScreen({
  item,
  onAccuse,
}: {
  item: import("@/lib/game/types").CharacterProfile;
  onAccuse?: (id: string) => void;
}) {
  return (
    <div>
      <ScreenHeader label="PERSON_OF_INTEREST.DOC" />
      <h2 className="ctc-arcade ctc-neon-cyan text-sm sm:text-base mb-1">{item.name}</h2>
      <p className="text-sm text-[var(--ctc-text-dim)] mb-4">{item.role}</p>
      <p className="text-lg leading-relaxed mb-6">{item.description}</p>
      {item.isSuspect && onAccuse && (
        <button className="ctc-btn ctc-btn-primary" onClick={() => onAccuse(item.id)}>
          Accuse {item.name}
        </button>
      )}
    </div>
  );
}

function SolvedScreen({ summary, suspectName }: { summary: string; suspectName: string }) {
  return (
    <div>
      <ScreenHeader label="CASE_CLOSED.TXT" />
      <h2 className="ctc-arcade ctc-neon-pink text-lg sm:text-xl mb-4">CASE CLOSED</h2>
      <p className="text-sm text-[var(--ctc-text-dim)] mb-4">
        Culprit identified: <span className="text-[var(--ctc-text)]">{suspectName}</span>
      </p>
      <p className="text-lg leading-relaxed whitespace-pre-line">{summary}</p>
    </div>
  );
}

export type EvidenceCategory = "correspondence" | "photograph" | "transcript";

export interface ThreadMessage {
  from: string;
  time: string;
  text: string;
}

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  title: string;
  subtitle: string;
  date: string;
  /** For correspondence: a text message thread. */
  thread?: ThreadMessage[];
  /** For correspondence: the sender whose messages render as "sent" (right-aligned) bubbles. */
  threadOwner?: string;
  /** For photographs: a scene used to render a placeholder image until a real photo is supplied. */
  photo?: {
    scene: "driveway" | "porch" | "traffic-cam" | "crime-scene" | "prom-photo" | "map" | "school";
    /** Once a real photo is available, its URL — shown instead of the placeholder art. */
    imageUrl?: string;
    note?: string;
    /** Short "who's in this photo" line shown under the image. */
    subjects?: string;
  };
  /** For transcripts: interrogation Q&A. */
  transcript?: {
    subject: string;
    interviewer: string;
    lines: { speaker: string; text: string }[];
  };
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  isSuspect: boolean;
}

export interface Story {
  id: string;
  title: string;
  year: string;
  setup: string;
  characters: CharacterProfile[];
  evidence: EvidenceItem[];
  solutionCharacterId: string;
  solutionSummary: string;
}

export type PlayerRole = "host" | "player";

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  joinedAt: number;
}

export type RoomStatus = "lobby" | "active" | "solved";

export interface AccusationRecord {
  playerId: string;
  playerName: string;
  suspectId: string;
  correct: boolean;
  time: number;
}

export interface Room {
  code: string;
  storyId: string;
  status: RoomStatus;
  hostId: string;
  players: Player[];
  notes: string;
  notesUpdatedBy?: string;
  notesUpdatedAt?: number;
  accusations: AccusationRecord[];
  solved: boolean;
  createdAt: number;
  updatedAt: number;
}

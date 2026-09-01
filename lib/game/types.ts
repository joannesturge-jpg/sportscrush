export type EvidenceCategory = "correspondence" | "photograph" | "transcript";

export interface EmailMessage {
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
  /** For correspondence: a message thread. */
  thread?: EmailMessage[];
  /** For photographs: caption + a simple scene description used to render a placeholder image. */
  photo?: {
    caption: string;
    scene: "driveway" | "porch" | "traffic-cam" | "crime-scene" | "prom-photo";
    note?: string;
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

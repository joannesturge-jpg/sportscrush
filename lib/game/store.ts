import { AccusationRecord, Player, Room } from "./types";
import { promStory } from "./story";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

class RoomStore {
  rooms = new Map<string, Room>();

  createRoom(hostName: string, storyId = promStory.id): { room: Room; player: Player } {
    let code = generateRoomCode();
    let attempts = 0;
    while (this.rooms.has(code) && attempts < 10) {
      code = generateRoomCode();
      attempts++;
    }

    const host: Player = {
      id: generateId(),
      name: hostName.trim().slice(0, 40),
      role: "host",
      joinedAt: Date.now(),
    };

    const room: Room = {
      code,
      storyId,
      status: "lobby",
      hostId: host.id,
      players: [host],
      notes: "",
      accusations: [],
      solved: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.rooms.set(code, room);
    return { room, player: host };
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  joinRoom(code: string, name: string): { room: Room; player: Player } | { error: string } {
    const room = this.getRoom(code);
    if (!room) return { error: "That room code doesn't exist. Double-check with your host." };

    const trimmed = name.trim().slice(0, 40);
    if (!trimmed) return { error: "Name is required." };

    const existing = room.players.find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      return { room, player: existing };
    }

    const player: Player = {
      id: generateId(),
      name: trimmed,
      role: "player",
      joinedAt: Date.now(),
    };
    room.players.push(player);
    room.updatedAt = Date.now();
    return { room, player };
  }

  startGame(code: string, playerId: string): Room | { error: string } {
    const room = this.getRoom(code);
    if (!room) return { error: "Room not found." };
    if (room.hostId !== playerId) return { error: "Only the host can start the case." };
    room.status = "active";
    room.updatedAt = Date.now();
    return room;
  }

  updateNotes(code: string, playerId: string, notes: string): Room | { error: string } {
    const room = this.getRoom(code);
    if (!room) return { error: "Room not found." };
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return { error: "You're not in this room." };
    room.notes = notes.slice(0, 20000);
    room.notesUpdatedBy = player.name;
    room.notesUpdatedAt = Date.now();
    room.updatedAt = Date.now();
    return room;
  }

  accuse(code: string, playerId: string, suspectId: string): Room | { error: string } {
    const room = this.getRoom(code);
    if (!room) return { error: "Room not found." };
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return { error: "You're not in this room." };

    const correct = suspectId === promStory.solutionCharacterId;
    const record: AccusationRecord = {
      playerId,
      playerName: player.name,
      suspectId,
      correct,
      time: Date.now(),
    };
    room.accusations.push(record);
    if (correct) {
      room.solved = true;
      room.status = "solved";
    }
    room.updatedAt = Date.now();
    return room;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __crackTheCaseStore: RoomStore | undefined;
}

export const roomStore: RoomStore = global.__crackTheCaseStore ?? new RoomStore();
if (!global.__crackTheCaseStore) {
  global.__crackTheCaseStore = roomStore;
}

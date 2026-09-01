"use client";

export interface StoredIdentity {
  playerId: string;
  name: string;
}

const keyFor = (code: string) => `ctc:room:${code.toUpperCase()}`;

export function saveIdentity(code: string, identity: StoredIdentity) {
  try {
    localStorage.setItem(keyFor(code), JSON.stringify(identity));
    localStorage.setItem("ctc:lastName", identity.name);
  } catch {
    // localStorage unavailable — game still works, just won't survive a refresh
  }
}

export function loadIdentity(code: string): StoredIdentity | null {
  try {
    const raw = localStorage.getItem(keyFor(code));
    if (!raw) return null;
    return JSON.parse(raw) as StoredIdentity;
  } catch {
    return null;
  }
}

export function loadLastName(): string {
  try {
    return localStorage.getItem("ctc:lastName") ?? "";
  } catch {
    return "";
  }
}

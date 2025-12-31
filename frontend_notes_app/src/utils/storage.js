const STORAGE_KEY = "ocean_notes_app_v1";
const SCHEMA_VERSION = 1;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function loadNotesState() {
  /** Load notes state from localStorage (graceful on errors). */
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;

  // Basic migration path in case schema changes later
  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    const migrated = migrate(parsed);
    return migrated;
  }

  return parsed;
}

// PUBLIC_INTERFACE
export function saveNotesState({ notes }) {
  /** Save notes state to localStorage with schema version. */
  if (typeof window === "undefined") return;
  const payload = { schemaVersion: SCHEMA_VERSION, notes };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function migrate(oldState) {
  // For now, only v1 exists. If unknown, return null so app seeds.
  if (!oldState) return null;
  if (oldState.schemaVersion === 1) return oldState;
  return null;
}

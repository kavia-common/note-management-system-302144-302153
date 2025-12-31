// PUBLIC_INTERFACE
export function createId() {
  /** Create a reasonably unique id without external deps. */
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

// PUBLIC_INTERFACE
export function nowIso() {
  /** Current timestamp as ISO string. */
  return new Date().toISOString();
}

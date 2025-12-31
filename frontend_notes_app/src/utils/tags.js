// PUBLIC_INTERFACE
export function normalizeTags(input) {
  /** Normalize tags into a unique, trimmed array. Accepts string ("a, b") or array. */
  if (!input) return [];
  const raw = Array.isArray(input) ? input : String(input).split(",");
  const cleaned = raw
    .map((t) => String(t).trim())
    .filter(Boolean)
    .map((t) => t.replace(/\s+/g, " "));
  return Array.from(new Set(cleaned));
}

// PUBLIC_INTERFACE
export function tagsToCsv(tags) {
  /** Convert tags array to a user-friendly CSV string. */
  return (tags || []).join(", ");
}

import React from "react";
import styles from "./TagChips.module.css";

// PUBLIC_INTERFACE
export default function TagChips({ tags, selectedTags, onChange }) {
  /** Tag chip selector for filtering. */
  const selected = new Set(selectedTags || []);

  const toggle = (tag) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    onChange(Array.from(next));
  };

  if (!tags || tags.length === 0) {
    return <div className={styles.empty}>No tags yet</div>;
  }

  return (
    <div className={styles.wrap} role="group" aria-label="Tag filters">
      {tags.map((t) => {
        const isSelected = selected.has(t);
        return (
          <button
            key={t}
            type="button"
            className={`${styles.chip} ${isSelected ? styles.selected : ""}`}
            onClick={() => toggle(t)}
            aria-pressed={isSelected}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

import React, { useMemo } from "react";
import styles from "./NoteCard.module.css";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
export default function NoteCard({ note, onEdit, onDelete }) {
  /** Note preview card with edit/delete actions. */
  const preview = useMemo(() => {
    const content = (note.content || "").trim();
    if (content.length <= 180) return content;
    return `${content.slice(0, 180)}…`;
  }, [note.content]);

  return (
    <article className={`card ${styles.card}`} aria-label={`Note: ${note.title}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{note.title}</h3>
        <div className={styles.actions}>
          <button type="button" className="btn btnGhost" onClick={onEdit} aria-label={`Edit ${note.title}`}>
            Edit
          </button>
          <button type="button" className="btn btnDanger" onClick={onDelete} aria-label={`Delete ${note.title}`}>
            Delete
          </button>
        </div>
      </div>

      <p className={styles.content}>{preview || <span className={styles.muted}>No content</span>}</p>

      <div className={styles.footer}>
        <div className={styles.tags} aria-label="Tags">
          {(note.tags || []).slice(0, 6).map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
          {(note.tags || []).length > 6 ? <span className={styles.more}>+{note.tags.length - 6}</span> : null}
        </div>
        <div className={styles.meta} title={note.updatedAt ? formatDate(note.updatedAt) : ""}>
          Updated {note.updatedAt ? formatDate(note.updatedAt) : "—"}
        </div>
      </div>
    </article>
  );
}

import React from "react";
import NoteCard from "../NoteCard/NoteCard";
import styles from "./NotesGrid.module.css";

// PUBLIC_INTERFACE
export default function NotesGrid({ notes, onEdit, onDelete, emptyState }) {
  /** Displays notes as responsive cards grid/list. */
  if (!notes || notes.length === 0) {
    return (
      <section className={styles.emptyWrap} aria-label="Empty state">
        <div className={`card ${styles.emptyCard}`}>
          <h2 className={styles.emptyTitle}>{emptyState?.title || "Nothing here"}</h2>
          <p className={styles.emptyDesc}>{emptyState?.description || "Try adding a note."}</p>
          {emptyState?.actionLabel ? (
            <button type="button" className="btn btnPrimary" onClick={emptyState.onAction}>
              {emptyState.actionLabel}
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.grid} aria-label="Notes">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={() => onEdit(note.id)} onDelete={() => onDelete(note)} />
      ))}
    </section>
  );
}

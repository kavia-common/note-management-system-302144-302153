import React, { useEffect, useId, useMemo, useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./NoteEditorModal.module.css";
import { normalizeTags, tagsToCsv } from "../../utils/tags";

function validate({ title, content }) {
  const errors = {};
  if (!title || !title.trim()) errors.title = "Title is required.";
  if (!content || content.trim().length < 1) errors.content = "Content cannot be empty.";
  return errors;
}

// PUBLIC_INTERFACE
export default function NoteEditorModal({ open, mode, initialNote, onClose, onSubmit }) {
  /** Create/edit note modal. */
  const titleId = useId();
  const titleInputId = useId();
  const contentId = useId();
  const tagsId = useId();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsCsv, setTagsCsv] = useState("");
  const [touched, setTouched] = useState({ title: false, content: false });

  useEffect(() => {
    if (!open) return;
    setTitle(initialNote?.title || "");
    setContent(initialNote?.content || "");
    setTagsCsv(tagsToCsv(initialNote?.tags || []));
    setTouched({ title: false, content: false });
  }, [open, initialNote]);

  const errors = useMemo(() => validate({ title, content }), [title, content]);
  const hasErrors = Object.keys(errors).length > 0;

  const submit = (e) => {
    e.preventDefault();
    setTouched({ title: true, content: true });
    const nextErrors = validate({ title, content });
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit?.({
      title,
      content,
      tags: normalizeTags(tagsCsv),
    });
  };

  return (
    <Modal open={open} titleId={titleId} onClose={onClose}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title} id={titleId}>
            {mode === "edit" ? "Edit note" : "Add note"}
          </h2>
          <p className={styles.subtitle}>Use a clear title and optional tags for quick filtering.</p>
        </div>
        <button type="button" className="btn btnGhost" onClick={onClose} aria-label="Close dialog">
          Close
        </button>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.field}>
          <label className="label" htmlFor={titleInputId}>
            Title
          </label>
          <input
            id={titleInputId}
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            placeholder="e.g., Meeting notes"
          />
          {touched.title && errors.title ? <div className="errorText">{errors.title}</div> : null}
        </div>

        <div className={styles.field}>
          <label className="label" htmlFor={contentId}>
            Content
          </label>
          <textarea
            id={contentId}
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, content: true }))}
            placeholder="Write something…"
          />
          {touched.content && errors.content ? <div className="errorText">{errors.content}</div> : null}
        </div>

        <div className={styles.field}>
          <label className="label" htmlFor={tagsId}>
            Tags (optional)
          </label>
          <input
            id={tagsId}
            className="input"
            value={tagsCsv}
            onChange={(e) => setTagsCsv(e.target.value)}
            placeholder="work, ideas, personal"
          />
          <div className="helper">Separate tags with commas. Tags are used for filtering.</div>
        </div>

        <div className={styles.footer}>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btnPrimary" disabled={hasErrors} aria-disabled={hasErrors}>
            {mode === "edit" ? "Save changes" : "Create note"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

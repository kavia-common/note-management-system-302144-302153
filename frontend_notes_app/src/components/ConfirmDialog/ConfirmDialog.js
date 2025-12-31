import React, { useId } from "react";
import Modal from "../Modal/Modal";
import styles from "./ConfirmDialog.module.css";

// PUBLIC_INTERFACE
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "neutral",
  onConfirm,
  onCancel,
}) {
  /** Generic confirmation dialog. */
  const titleId = useId();
  const descId = useId();

  const confirmClass = tone === "danger" ? "btn btnDanger" : "btn btnPrimary";

  return (
    <Modal open={open} titleId={titleId} onClose={onCancel}>
      <div className={styles.wrap} aria-describedby={descId}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        <p className={styles.desc} id={descId}>
          {description}
        </p>

        <div className={styles.actions}>
          <button type="button" className="btn" onClick={onCancel} autoFocus>
            {cancelLabel || "Cancel"}
          </button>
          <button type="button" className={confirmClass} onClick={onConfirm}>
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

import React from "react";
import styles from "./Toast.module.css";

// PUBLIC_INTERFACE
export default function ToastViewport({ toasts, onDismiss }) {
  /** Toast/snackbar viewport anchored at bottom right. */
  return (
    <div className={styles.viewport} role="region" aria-label="Notifications">
      {(toasts || []).map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.tone] || ""}`} role="status" aria-live="polite">
          <div className={styles.text}>
            <div className={styles.title}>{t.title}</div>
            {t.description ? <div className={styles.desc}>{t.description}</div> : null}
          </div>
          <button type="button" className={styles.dismiss} onClick={() => onDismiss(t.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

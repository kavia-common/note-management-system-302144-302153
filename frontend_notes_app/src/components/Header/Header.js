import React from "react";
import styles from "./Header.module.css";

// PUBLIC_INTERFACE
export default function Header({ onAddNote }) {
  /** Top header with app title and add action. */
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true">
            N
          </div>
          <div>
            <h1 className={styles.title}>Ocean Notes</h1>
            <p className={styles.subtitle}>Create, organize, and find notes fast.</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btnPrimary" onClick={onAddNote}>
            Add note
          </button>
        </div>
      </div>
    </header>
  );
}

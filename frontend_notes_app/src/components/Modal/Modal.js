import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.css";

function getFocusable(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

// PUBLIC_INTERFACE
export default function Modal({ open, titleId, onClose, children }) {
  /** Accessible modal with focus trap and Escape-to-close. */
  const panelRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    lastActiveRef.current = document.activeElement;

    const panel = panelRef.current;
    const focusables = getFocusable(panel);
    const first = focusables[0] || panel;

    // Focus first focusable element inside modal
    window.setTimeout(() => first?.focus?.(), 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key !== "Tab") return;

      const els = getFocusable(panelRef.current);
      if (els.length === 0) return;

      const currentIndex = els.indexOf(document.activeElement);
      const lastIndex = els.length - 1;

      if (e.shiftKey) {
        if (currentIndex <= 0) {
          e.preventDefault();
          els[lastIndex].focus();
        }
      } else {
        if (currentIndex === lastIndex) {
          e.preventDefault();
          els[0].focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Restore focus to triggering element
      lastActiveRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

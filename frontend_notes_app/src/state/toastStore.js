import React, { useCallback, useMemo, useState } from "react";
import { createId } from "../utils/ids";

const DEFAULT_DURATION_MS = 2400;

// PUBLIC_INTERFACE
export function useToasts() {
  /** Lightweight toast store implemented as a hook. */
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ title, description = "", tone = "neutral", durationMs = DEFAULT_DURATION_MS }) => {
      const id = createId();
      const toast = { id, title, description, tone };

      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        dismissToast(id);
      }, durationMs);

      return id;
    },
    [dismissToast]
  );

  return useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts, pushToast, dismissToast]);
}

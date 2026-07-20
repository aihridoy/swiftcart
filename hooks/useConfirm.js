"use client";

import { useCallback, useRef, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

// Promise-based replacement for window.confirm().
// const [confirm, ConfirmationDialog] = useConfirm();
// const ok = await confirm({ title, message });
// Render <ConfirmationDialog /> once anywhere in the component tree.
export function useConfirm() {
  const [options, setOptions] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions(options);
    });
  }, []);

  const respond = (result) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setOptions(null);
  };

  const ConfirmationDialog = () => (
    <ConfirmDialog
      open={!!options}
      {...options}
      onConfirm={() => respond(true)}
      onCancel={() => respond(false)}
    />
  );

  return [confirm, ConfirmationDialog];
}

"use client";

import { useState, useCallback } from "react";

export function useBoardAnnouncer() {
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((message: string) => {
    // Clear first to guarantee assistive tech re-reads identical sequential events
    setAnnouncement("");
    setTimeout(() => {
      setAnnouncement(message);
    }, 50);
  }, []);

  return { announcement, announce };
}
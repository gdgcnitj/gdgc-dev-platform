"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className="club-motion-toggle"
      aria-pressed={paused}
      aria-label={paused ? "Play animation" : "Pause animation"}
      onClick={(event) => {
        const next = !paused;
        setPaused(next);
        event.currentTarget.closest(".club-home")?.setAttribute("data-motion", next ? "paused" : "playing");
      }}
    >
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
    </button>
  );
}

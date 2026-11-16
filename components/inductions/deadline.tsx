"use client";

import { useEffect, useState } from "react";
import {
  inductionDeadlineLabel,
  inductionTimeLeft,
} from "@/lib/inductions/deadline";

export function useInductionDeadline(closesAt?: string) {
  const [now, setNow] = useState<number>();
  useEffect(() => {
    if (!closesAt) return;
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("pageshow", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pageshow", update);
    };
  }, [closesAt]);
  return closesAt && now !== undefined
    ? inductionTimeLeft(closesAt, now)
    : undefined;
}

export function InductionDeadline({ closesAt }: { closesAt: string }) {
  const remaining = useInductionDeadline(closesAt);
  const closed = remaining?.totalSeconds === 0;
  return (
    <div className="induction-deadline" data-closed={closed || undefined}>
      <p className="induction-deadline-label">
        {closed ? "Applications are closed" : "Applications close"}
      </p>
      <p className="induction-deadline-date">
        <time dateTime={closesAt}>{inductionDeadlineLabel(closesAt)}</time>
      </p>
      {closed ? (
        <p className="induction-deadline-note">
          The deadline has passed. We’re no longer accepting applications.
        </p>
      ) : remaining ? (
        <div
          className="induction-countdown"
          role="timer"
          aria-live="off"
          aria-label="Time remaining to submit your application"
        >
          {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
            <span key={unit}>
              <strong>{String(remaining[unit]).padStart(2, "0")}</strong>
              <span>{unit}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="induction-deadline-note">Loading countdown…</p>
      )}
    </div>
  );
}

const timezone = "Asia/Kolkata";

export function inductionTimeLeft(closesAt: string, now: number) {
  const difference = Date.parse(closesAt) - now;
  const totalSeconds = Number.isFinite(difference)
    ? Math.max(0, Math.ceil(difference / 1000))
    : 0;
  return {
    totalSeconds,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function inductionDeadlineLabel(closesAt: string) {
  const deadline = new Date(closesAt);
  const midnight =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(deadline) === "00:00:00";
  const day = new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(midnight ? new Date(deadline.getTime() - 1) : deadline);
  if (midnight) return `${day} · End of day (IST)`;
  const time = new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(deadline);
  return `${day} · ${time} IST`;
}

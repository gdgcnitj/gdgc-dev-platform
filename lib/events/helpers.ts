import type { ChallengesSection, ClubEvent, EventSummary } from "./schema";

export function eventPath(event: Pick<ClubEvent, "slug">) {
  return `/events/${event.slug}`;
}

export function eventCover(event: Pick<ClubEvent, "media" | "coverId">) {
  return (
    event.media.find((slide) => slide.id === event.coverId) ?? event.media[0]
  );
}

export function getChallenges(event: ClubEvent) {
  return event.sections.find(
    (section): section is ChallengesSection =>
      section.type === "challenges" && !section.hidden,
  );
}

export function eventProblems(event: ClubEvent) {
  const challenges = getChallenges(event);
  if (!challenges?.statements.length) return undefined;
  return {
    eventId: event.id,
    eventTitle: event.title,
    description:
      challenges.description ?? `Problem statements for ${event.title}.`,
    tracks: challenges.tracks.map((track) => ({
      ...track,
      count: challenges.statements.filter(
        (statement) => statement.trackId === track.id,
      ).length,
    })),
    statements: challenges.statements,
  };
}

export function visibleSections(event: ClubEvent) {
  return event.sections.filter((section) => !section.hidden);
}

export function registrationStatus(event: ClubEvent, now = Date.now()) {
  const registration = event.registration;
  if (registration.mode === "none") return "none";
  const lastDay = event.date?.endsOn ?? event.date?.startsOn;
  const localDay =
    lastDay &&
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: event.date?.timezone,
    }).format(new Date(now));
  if (
    (event.status !== "scheduled" && event.status !== "live") ||
    registration.state === "closed" ||
    (registration.closesAt && now >= Date.parse(registration.closesAt)) ||
    (event.date?.endsAt && now >= Date.parse(event.date.endsAt)) ||
    (lastDay && localDay && localDay > lastDay)
  )
    return "closed";
  if (
    registration.state === "upcoming" ||
    (registration.opensAt && now < Date.parse(registration.opensAt))
  )
    return "upcoming";
  return registration.state;
}

export function canRegister(event: ClubEvent, now = Date.now()) {
  return registrationStatus(event, now) === "open";
}

export function eventDate(event: Pick<ClubEvent, "date">) {
  if (event.date?.label) return event.date.label;
  if (event.date?.startsOn) {
    const format = new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    const start = format.format(new Date(event.date.startsOn));
    const end = event.date.endsOn
      ? format.format(new Date(event.date.endsOn))
      : start;
    return start === end ? start : `${start} – ${end}`;
  }
  if (!event.date?.startsAt) return undefined;
  const format = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: event.date.timezone,
  });
  const start = format.format(new Date(event.date.startsAt));
  const end = event.date.endsAt
    ? format.format(new Date(event.date.endsAt))
    : start;
  return start === end ? start : `${start} – ${end}`;
}

export function eventTime(event: Pick<ClubEvent, "date">) {
  if (event.date?.timeLabel) return event.date.timeLabel;
  if (!event.date?.startsAt) return undefined;
  const format = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.date.timezone,
  });
  const start = format.format(new Date(event.date.startsAt));
  return event.date.endsAt
    ? `${start} – ${format.format(new Date(event.date.endsAt))}`
    : start;
}

export function eventStart(event: ClubEvent) {
  return Date.parse(event.date?.startsAt ?? event.date?.startsOn ?? "") || 0;
}

// Send only card content to the interactive archive, never full challenge specs.
export function eventSummary(event: ClubEvent): EventSummary {
  const {
    id,
    slug,
    title,
    kind,
    categoryLabel,
    summary,
    color,
    date,
    location,
    coverId,
  } = event;
  const cover = eventCover(event);
  return {
    id,
    slug,
    title,
    kind,
    categoryLabel,
    summary,
    color,
    date,
    location,
    coverId,
    media: cover ? [cover] : [],
  };
}

// Date-less upcoming announcements belong above historical recaps too.
export function compareEventListing(a: ClubEvent, b: ClubEvent) {
  const rank = {
    live: 0,
    scheduled: 1,
    postponed: 2,
    completed: 3,
    cancelled: 4,
  };
  const group = rank[a.status] - rank[b.status];
  if (group) return group;
  if (a.status === "scheduled" || a.status === "live")
    return (
      (eventStart(a) || Infinity) - (eventStart(b) || Infinity) ||
      a.id.localeCompare(b.id)
    );
  return eventStart(b) - eventStart(a);
}

export function isCampusRegistration(event: ClubEvent) {
  return (
    event.registration.mode === "internal" &&
    event.registration.form === "campus"
  );
}

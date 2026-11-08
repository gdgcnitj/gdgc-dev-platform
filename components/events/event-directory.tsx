"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { EventCard } from "./event-card";
import { eventKindLabels } from "@/lib/events/labels";
import type { EventSummary } from "@/lib/events/schema";

export function EventDirectory({ events }: { events: EventSummary[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const kinds = [...new Set(events.map((event) => event.kind))];
  const search = query.trim().toLowerCase();
  const results = events.filter(
    (event) =>
      (kind === "all" || event.kind === kind) &&
      `${event.title} ${event.summary} ${event.categoryLabel ?? eventKindLabels[event.kind]}`
        .toLowerCase()
        .includes(search),
  );

  return (
    <>
      <h2 className="sr-only">Event directory</h2>
      <div className="event-directory-tools">
        <label className="event-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search events"
            placeholder="Search events"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="event-filter">
          Type
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
          >
            <option value="all">All types</option>
            {kinds.map((value) => (
              <option key={value} value={value}>
                {eventKindLabels[value]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="event-directory-count" role="status">
        {results.length} {results.length === 1 ? "event" : "events"}
        {search && ` matching “${query.trim()}”`}
      </p>
      {results.length ? (
        <div className="club-event-grid">
          {results.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <div className="event-empty">
          <h2>No events found.</h2>
          <p>Try another search or clear your filters.</p>
          <button
            className="club-text-link"
            type="button"
            onClick={() => {
              setQuery("");
              setKind("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

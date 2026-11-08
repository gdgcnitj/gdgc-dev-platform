import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { MediaFrame } from "@/components/home/media-frame";
import { Button } from "@/components/ui/button";
import { eventCover, eventDate, eventPath } from "@/lib/events/helpers";
import { eventKindLabels } from "@/lib/events/labels";
import type { EventSummary } from "@/lib/events/schema";

export function EventCard({
  event,
  featured = false,
  headingLevel = 3,
}: {
  event: EventSummary;
  featured?: boolean;
  headingLevel?: 3 | 4;
}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  const cover = eventCover(event);
  const date = eventDate(event);
  return (
    <article
      className={`club-event-card${featured ? " club-event-upcoming" : ""}`}
      data-tone={event.color}
      data-reveal="card"
    >
      <div
        className={`event-card-media event-card-media-${cover?.kind ?? "photo"}`}
      >
        <MediaFrame
          src={cover?.src}
          alt={cover?.alt ?? event.title}
          label="Event photo"
          className="club-event-photo"
          sizes={
            featured
              ? "(max-width: 700px) 100vw, 45vw"
              : "(max-width: 700px) 100vw, 33vw"
          }
        />
      </div>
      <div className="club-event-copy">
        <p className="club-event-category">
          <span className="club-tone-dot" />
          {event.categoryLabel ?? eventKindLabels[event.kind]}
        </p>
        <Heading>
          <Link href={eventPath(event)}>{event.title}</Link>
        </Heading>
        {(date || event.location?.name) && (
          <div className="club-event-meta">
            {date && (
              <span>
                <CalendarDays size={16} aria-hidden="true" />
                {date}
              </span>
            )}
            {event.location?.name && (
              <span>
                <MapPin size={16} aria-hidden="true" />
                {event.location.name}
              </span>
            )}
          </div>
        )}
        <p className="club-event-description">{event.summary}</p>
        <div className="club-event-actions">
          <Button
            asChild
            variant={featured ? "default" : "outline"}
            className="club-button club-event-details-btn"
          >
            <Link href={eventPath(event)}>
              View event
              <ArrowRight
                className="club-action-arrow"
                size={16}
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

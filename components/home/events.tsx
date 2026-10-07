import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { MediaFrame } from "@/components/home/media-frame";
import { Button } from "@/components/ui/button";
import {
  pastEvents,
  socialLinks,
  upcomingEvents,
  type ClubEvent,
} from "@/lib/content/home";

function EventCard({
  event,
  upcoming = false,
}: {
  event: ClubEvent;
  upcoming?: boolean;
}) {
  return (
    <article
      className={`club-event-card${upcoming ? " club-event-upcoming" : ""}`}
      data-tone={event.color}
      data-reveal="card"
    >
      {!event.image && event.illustration ? (
        <Image
          src={event.illustration}
          alt=""
          width={1437}
          height={968}
          sizes={upcoming ? "(max-width: 700px) 100vw, 45vw" : "(max-width: 700px) 100vw, 33vw"}
          className="club-event-art"
        />
      ) : (
        <MediaFrame
          src={event.image}
          alt={`${event.title} event`}
          label="Event photo"
          className="club-event-photo"
          sizes={upcoming ? "(max-width: 700px) 100vw, 45vw" : "(max-width: 700px) 100vw, 33vw"}
        />
      )}
      <div className="club-event-copy">
        {event.category && (
          <p className="club-event-category">
            <span className="club-tone-dot" />
            {event.category}
          </p>
        )}
        <h4>{event.title}</h4>
        {(event.date || event.venue) && (
          <div className="club-event-meta">
            {event.date && (
              <span><CalendarDays size={16} aria-hidden="true" />{event.date}</span>
            )}
            {event.time && (
              <span><Clock size={16} aria-hidden="true" />{event.time}</span>
            )}
            {event.venue && (
              <span><MapPin size={16} aria-hidden="true" />{event.venue}</span>
            )}
          </div>
        )}
        {event.description && <p className="club-event-description">{event.description}</p>}
        {upcoming && (
          <Button asChild className="club-button club-event-register">
            <Link href={`/events/${event.id}`}>
              {event.registration ? "Register" : "Event details"}
              <ArrowRight className="club-action-arrow" size={16} aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}

export function HomeEvents() {
  return (
    <section
      id="events"
      className="club-field club-field-blue"
      aria-labelledby="events-title"
    >
      <div className="club-section club-container">
        {upcomingEvents.length ? (
          <div className="club-title-card club-events-heading" data-reveal>
            <h2 id="events-title">Our events.</h2>
            <p>Workshops, hackathons, and meetups at NIT Jalandhar.</p>
          </div>
        ) : (
          <div className="club-title-card club-events-banner" data-tone="yellow" data-reveal>
            <div className="club-events-banner-copy">
              <h2 id="events-title">Our events.</h2>
              <p>Workshops, hackathons, and meetups at NIT Jalandhar.</p>
              <div className="club-events-status">
                <span className="club-events-status-pill">
                  <span className="club-tone-dot" aria-hidden="true" />
                  Nothing scheduled right now
                </span>
                <a className="club-text-link" href={socialLinks.instagram} target="_blank" rel="noreferrer">
                  Get event updates <ArrowUpRight className="club-action-arrow" size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="club-events-banner-art">
              <Image
                src="/images/illustrations/events-empty.webp"
                alt=""
                width={1400}
                height={467}
                sizes="(max-width: 700px) 90vw, 480px"
              />
            </div>
          </div>
        )}
        {upcomingEvents.length ? (
          <div className="club-upcoming-events">
            <h3 className="club-subsection-title">Coming up</h3>
            <div className="club-upcoming-grid">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} upcoming />
              ))}
            </div>
          </div>
        ) : null}
        <h3 className="club-subsection-title club-past-heading">Past events</h3>
        <div className="club-event-grid">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

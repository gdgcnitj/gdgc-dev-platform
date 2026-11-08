import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { allEvents, getFeaturedEvents } from "@/lib/content/events";
import { socialLinks } from "@/lib/content/home";
import { eventStart, eventSummary } from "@/lib/events/helpers";

export function HomeEvents() {
  const featured = getFeaturedEvents();
  const featuredIds = new Set(featured.map((event) => event.id));
  const upcoming = allEvents.filter(
    (event) =>
      (event.status === "scheduled" || event.status === "live") &&
      !featuredIds.has(event.id),
  );
  upcoming.sort(
    (a, b) => (eventStart(a) || Infinity) - (eventStart(b) || Infinity),
  );
  const recent = allEvents
    .filter(
      (event) => event.status === "completed" && !featuredIds.has(event.id),
    )
    .slice(0, 3);
  const hasUpcoming = allEvents.some(
    (event) => event.status === "scheduled" || event.status === "live",
  );

  return (
    <section
      id="events"
      className="club-field club-field-blue"
      aria-labelledby="events-title"
    >
      <div className="club-section club-container">
        <div className="club-title-card club-events-heading" data-reveal>
          <div>
            <h2 id="events-title">Our events.</h2>
            <p>Workshops, hackathons, and meetups at NIT Jalandhar.</p>
          </div>
          <Link className="club-text-link" href="/events">
            Explore all events
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        {featured.length > 0 && (
          <div className="club-upcoming-events">
            <h3 className="club-subsection-title">In the spotlight</h3>
            <div className="club-upcoming-grid">
              {featured.map((event) => (
                <EventCard
                  key={event.id}
                  event={eventSummary(event)}
                  headingLevel={4}
                  featured
                />
              ))}
            </div>
          </div>
        )}
        {upcoming.length > 0 && (
          <>
            <h3 className="club-subsection-title club-past-heading">
              Coming up
            </h3>
            <div className="club-event-grid">
              {upcoming.slice(0, 3).map((event) => (
                <EventCard
                  event={eventSummary(event)}
                  headingLevel={4}
                  key={event.id}
                />
              ))}
            </div>
          </>
        )}
        {!hasUpcoming && !featured.length && (
          <div
            className="club-title-card club-events-banner"
            data-tone="yellow"
          >
            <div className="club-events-banner-copy">
              <p>Nothing scheduled right now.</p>
              <a
                className="club-text-link"
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Get event updates
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
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
        {recent.length > 0 && (
          <>
            <h3 className="club-subsection-title club-past-heading">
              Recent events
            </h3>
            <div className="club-event-grid">
              {recent.map((event) => (
                <EventCard
                  event={eventSummary(event)}
                  headingLevel={4}
                  key={event.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

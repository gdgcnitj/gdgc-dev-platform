import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import { EventCarousel } from "@/components/events/event-carousel";
import { EventSections } from "@/components/events/event-sections";
import { EventRegistration } from "@/components/events/event-registration";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";
import { Button } from "@/components/ui/button";
import { allEvents, getEvent, getRelatedEvents } from "@/lib/content/events";
import {
  canRegister,
  eventDate,
  eventPath,
  eventTime,
  visibleSections,
} from "@/lib/events/helpers";
import { eventKindLabels, eventStatusLabels } from "@/lib/events/labels";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 60;

export function generateStaticParams() {
  return allEvents.map((event) => ({ id: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).id);
  return event
    ? { title: `${event.title} · GDGC NITJ`, description: event.summary }
    : {};
}

export default async function EventPage({ params }: Props) {
  const event = getEvent((await params).id);
  if (!event) notFound();
  const sections = visibleSections(event);
  const registrationOpen = canRegister(event);
  const registration = event.registration;
  const applicationSection = sections.find(
    (section) => section.type === "applications",
  );
  const related = getRelatedEvents(event);
  const primarySection =
    sections.find(
      (section) => section.type === "results" || section.type === "resources",
    ) ??
    sections.find(
      (section) => section.type === "story" || section.type === "challenges",
    );
  const primaryLabel =
    primarySection?.type === "results"
      ? "See the winners"
      : primarySection?.type === "resources"
        ? "Browse resources"
        : primarySection?.type === "challenges"
          ? "Explore challenges"
          : event.status === "completed"
            ? "Read the recap"
            : "About the event";
  const facts = [
    { icon: CalendarDays, label: "Date", value: eventDate(event) },
    { icon: Clock, label: "Time", value: eventTime(event) },
    {
      icon: MapPin,
      label: event.location?.mode === "online" ? "Format" : "Venue",
      value:
        event.location?.name ??
        (event.location?.mode === "online" ? "Online" : undefined),
    },
  ].filter((fact) => fact.value || event.status === "scheduled");
  const hasDetails = Boolean(
    facts.length || registrationOpen || primarySection || event.website,
  );

  return (
    <HomeMotion>
      <div
        className="event-page"
        data-tone={event.color}
        data-event-kind={event.kind}
      >
        <section className="club-hero-field" aria-labelledby="event-title">
          <div className="club-container event-header">
            <Link href="/events" className="club-back-link">
              <ArrowLeft size={16} aria-hidden="true" />
              All events
            </Link>
            <div
              className={`event-header-grid${hasDetails ? "" : " event-header-single"}`}
            >
              <div>
                <div className="event-heading-labels">
                  <p className="club-eyebrow">
                    <span className="club-tone-dot" />
                    {event.categoryLabel ?? eventKindLabels[event.kind]}
                  </p>
                  {event.status !== "completed" &&
                    event.status !== "scheduled" && (
                      <span
                        className="event-state-note"
                        data-status={event.status}
                      >
                        {eventStatusLabels[event.status]}
                      </span>
                    )}
                </div>
                <h1 id="event-title">{event.title}</h1>
                <p className="club-hero-description">{event.summary}</p>
              </div>
              {hasDetails && (
                <div className="event-essential-details">
                  {facts.length > 0 && (
                    <dl className="event-facts">
                      {facts.map(({ icon: Icon, label, value }) => (
                        <div key={label}>
                          <dt>
                            <Icon size={17} aria-hidden="true" />
                            {label}
                          </dt>
                          <dd>{value ?? "To be announced"}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div className="club-actions">
                    {registrationOpen && registration.mode === "external" ? (
                      <Button asChild className="club-button">
                        <a
                          href={registration.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Register on {registration.provider}
                          <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                      </Button>
                    ) : applicationSection ? (
                      <Button asChild className="club-button">
                        <a href={`#section-${applicationSection.id}`}>
                          Explore domains
                          <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      </Button>
                    ) : registrationOpen ? (
                      <Button asChild className="club-button">
                        <a href="#registration">
                          Register
                          <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      </Button>
                    ) : primarySection ? (
                      <Button asChild className="club-button">
                        <a href={`#section-${primarySection.id}`}>
                          {primaryLabel}
                          <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      </Button>
                    ) : null}
                    {event.website && (
                      <Button
                        asChild
                        variant={
                          registrationOpen || primarySection
                            ? "outline"
                            : "default"
                        }
                        className={`club-button${registrationOpen || primarySection ? " club-button-secondary" : ""}`}
                      >
                        <a
                          href={event.website.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {event.website.label}
                          <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <EventCarousel slides={event.media} title={event.title} />
          </div>
        </section>

        {sections.length > 1 && (
          <nav className="event-section-nav" aria-label="On this page">
            <div className="club-container">
              {sections.map((section) => (
                <a href={`#section-${section.id}`} key={section.id}>
                  {section.navLabel ?? section.title}
                </a>
              ))}
            </div>
          </nav>
        )}

        {(sections.length > 0 ||
          registration.mode !== "none" ||
          related.length > 0) && (
          <div className="club-container event-content">
            <EventRegistration event={event} />
            <EventSections event={event} sections={sections} />
            {related.length > 0 && (
              <section
                className="event-content-section"
                aria-labelledby="related-events-heading"
              >
                <h2 id="related-events-heading">More in this series</h2>
                <div className="event-detail-grid">
                  {related.map((other) => (
                    <Link
                      className="event-detail-card event-resource-link"
                      href={eventPath(other)}
                      key={other.id}
                    >
                      <div>
                        <h3>{other.title}</h3>
                        <p>{other.summary}</p>
                      </div>
                      <ArrowRight size={20} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
      <HomeFooter />
    </HomeMotion>
  );
}

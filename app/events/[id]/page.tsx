import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import { RegistrationForm } from "@/components/events/registration-form";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";
import { MediaFrame } from "@/components/home/media-frame";
import { allEvents } from "@/lib/content/home";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return allEvents.map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = allEvents.find((item) => item.id === id);
  return event
    ? { title: `${event.title} · GDGC NITJ`, description: event.description }
    : {};
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = allEvents.find((item) => item.id === id);
  if (!event) notFound();

  const facts = [
    { icon: CalendarDays, label: "Date", value: event.date },
    { icon: Clock, label: "Time", value: event.time },
    { icon: MapPin, label: "Venue", value: event.venue },
  ];

  return (
    <HomeMotion>
      <section className="club-hero-field" aria-labelledby="event-title">
        <div
          className={`club-container club-event-page${event.registration ? "" : " club-event-page-single"}`}
          data-tone={event.color}
        >
          <div className="club-event-page-copy">
            <Link href="/#events" className="club-back-link">
              <ArrowLeft size={16} aria-hidden="true" /> All events
            </Link>
            <p className="club-eyebrow">
              <span className="club-tone-dot" />
              {event.category}
            </p>
            <h1 id="event-title">{event.title}</h1>
            {event.description && <p className="club-hero-description">{event.description}</p>}
            <dl className="club-event-facts">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <dt><Icon size={16} aria-hidden="true" />{label}</dt>
                  <dd className={value ? undefined : "club-alumni-pending"}>{value ?? "To be announced"}</dd>
                </div>
              ))}
            </dl>
            <MediaFrame
              src={event.image}
              alt={`${event.title} cover`}
              label="Event cover"
              className="club-event-page-photo"
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
            />
          </div>
          {event.registration && <RegistrationForm eventId={event.id} date={event.date} />}
        </div>
      </section>
      <HomeFooter />
    </HomeMotion>
  );
}

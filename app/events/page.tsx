import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventDirectory } from "@/components/events/event-directory";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";
import { allEvents } from "@/lib/content/events";
import { eventSummary } from "@/lib/events/helpers";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events · GDGC NITJ",
  description:
    "Workshops, hackathons, bootcamps, and community events at NIT Jalandhar. Explore what's coming up and revisit past events.",
};

export default function EventsPage() {
  return (
    <HomeMotion>
      <section className="club-hero-field" aria-labelledby="events-page-title">
        <div className="club-container event-directory-heading">
          <Link href="/" className="club-back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
          <p className="club-eyebrow">
            <span className="club-brand-dot" />
            Learn. Build. Take part.
          </p>
          <h1 id="events-page-title">
            A place to
            <br />
            <span>get involved.</span>
          </h1>
          <p className="club-hero-description">
            Workshops, hackathons, bootcamps, and everything we build together.
          </p>
        </div>
      </section>
      <section
        className="club-field club-field-blue"
        aria-label="Browse events"
      >
        <div className="club-container club-section">
          <EventDirectory events={allEvents.map(eventSummary)} />
        </div>
      </section>
      <HomeFooter />
    </HomeMotion>
  );
}

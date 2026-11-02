import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Medal,
  PartyPopper,
  Trophy,
} from "lucide-react";
import { RegistrationForm } from "@/components/events/registration-form";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";
import { MediaFrame } from "@/components/home/media-frame";
import { Button } from "@/components/ui/button";
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

  const hasSidebar = Boolean(event.registration || event.registrationUrl || event.tracks);

  const facts = [
    { icon: CalendarDays, label: "Date", value: event.date },
    { icon: Clock, label: "Time", value: event.time },
    { icon: MapPin, label: "Venue", value: event.venue },
  ];

  return (
    <HomeMotion>
      <section className="club-hero-field" aria-labelledby="event-title">
        <div
          className={`club-container club-event-page${hasSidebar ? "" : " club-event-page-single"}`}
          data-tone={event.color}
        >
          <div className="club-event-intro">
            <Link href="/#events" className="club-back-link">
              <ArrowLeft size={16} aria-hidden="true" /> All events
            </Link>
            {event.category && (
              <p className="club-eyebrow">
                <span className="club-tone-dot" />
                {event.category}
              </p>
            )}
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
          </div>

          {event.registration && <RegistrationForm eventId={event.id} date={event.date} />}

          {!event.registration && event.registrationUrl && (
            <aside className="club-form-card club-event-unstop-card">
              <div className="club-unstop-badge">
                <span className="club-tone-dot" />
                Official Registration
              </div>
              <h2 className="club-form-title">Register on Unstop</h2>
              <p className="club-form-lead">
                Registrations for {event.title} are hosted on Unstop. Assemble your team and secure your spot today.
              </p>

              <div className="club-unstop-stats">
                {event.teamSize && (
                  <div className="club-unstop-stat">
                    <span className="club-stat-label">Team size</span>
                    <span className="club-stat-value">{event.teamSize}</span>
                  </div>
                )}
                <div className="club-unstop-stat">
                  <span className="club-stat-label">Format</span>
                  <span className="club-stat-value">On-Campus / Offline</span>
                </div>
                {event.prizes && event.prizes.length > 0 && (
                  <div className="club-unstop-stat">
                    <span className="club-stat-label">Prizes</span>
                    <span className="club-stat-value">{event.prizes[0].title}</span>
                  </div>
                )}
              </div>

              <Button asChild size="lg" className="club-button club-unstop-button">
                <a href={event.registrationUrl} target="_blank" rel="noreferrer">
                  Register on Unstop
                  <ArrowUpRight className="club-action-arrow" size={18} aria-hidden="true" />
                </a>
              </Button>

              <p className="club-unstop-caption">
                Free participation · Click above to go directly to the Unstop registration portal.
              </p>
            </aside>
          )}

          {!event.registration && !event.registrationUrl && event.tracks && (
            <aside className="club-form-card club-event-completed-card">
              <div className="club-completed-badge">
                <PartyPopper size={16} aria-hidden="true" />
                Event Concluded
              </div>
              <h2 className="club-form-title">Winners Declared</h2>
              <p className="club-form-lead">
                MiniMol 2026 has successfully concluded. Congratulations to all teams and winners across both tracks!
              </p>

              <div className="club-unstop-stats">
                <div className="club-unstop-stat">
                  <span className="club-stat-label">Main Track Winner</span>
                  <span className="club-stat-value">Team Dev Ansh Pandey (₹4,000)</span>
                </div>
                <div className="club-unstop-stat">
                  <span className="club-stat-label">1st Runner Up</span>
                  <span className="club-stat-value">Team Md Zayan (₹2,500)</span>
                </div>
                <div className="club-unstop-stat">
                  <span className="club-stat-label">2nd Runner Up</span>
                  <span className="club-stat-value">Team Day_zero (₹1,500)</span>
                </div>
                <div className="club-unstop-stat">
                  <span className="club-stat-label">Freshers Track Winner</span>
                  <span className="club-stat-value">Team Data Crushers (₹2,000)</span>
                </div>
                <div className="club-unstop-stat">
                  <span className="club-stat-label">Total Cash Prizes</span>
                  <span className="club-stat-value">₹10,000</span>
                </div>
                <div className="club-unstop-stat">
                  <span className="club-stat-label">HackMOL 8.0</span>
                  <span className="club-stat-value">Direct qualification</span>
                </div>
              </div>

              <div className="club-completed-callout">
                <Trophy size={18} className="club-callout-icon" aria-hidden="true" />
                <p>Winners secure direct qualification to NIT Jalandhar&apos;s flagship hackathon HackMOL 8.0.</p>
              </div>
            </aside>
          )}

          <div className="club-event-details">
            {!event.image && event.illustration ? (
              <Image
                src={event.illustration}
                alt=""
                width={1437}
                height={968}
                sizes="(max-width: 900px) 100vw, 50vw"
                className="club-event-page-art"
              />
            ) : (
              <MediaFrame
                src={event.image}
                alt={`${event.title} cover`}
                label="Event cover"
                className="club-event-page-photo"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            )}

            {event.wrapUp && (
              <p className="club-event-wrap-up">
                <PartyPopper size={20} aria-hidden="true" />
                {event.wrapUp}
              </p>
            )}

            {event.tracks && event.tracks.length > 0 && (
              <section className="club-event-section" aria-labelledby="event-winners-heading">
                <h2 id="event-winners-heading" className="club-event-section-title">
                  <Trophy size={20} aria-hidden="true" />
                  Winners &amp; Results
                </h2>
                <div className="club-tracks-grid">
                  {event.tracks.map((track) => (
                    <div key={track.title} className="club-track-card">
                      <div className="club-track-header">
                        <span className="club-tone-dot" />
                        <h3 className="club-track-title">{track.title}</h3>
                        {track.description && (
                          <p className="club-track-desc">{track.description}</p>
                        )}
                      </div>
                      <div className="club-winners-list">
                        {track.winners.map((winner, idx) => {
                          const rankTone = track.title.toLowerCase().includes("fresher")
                            ? "freshers"
                            : idx === 0
                            ? "gold"
                            : idx === 1
                            ? "silver"
                            : "bronze";

                          return (
                            <div
                              key={winner.team}
                              className={`club-winner-row club-winner-${rankTone}`}
                            >
                              <div className="club-winner-rank-badge">
                                {rankTone === "gold" ? (
                                  <Trophy size={16} aria-hidden="true" />
                                ) : rankTone === "silver" ? (
                                  <Medal size={16} aria-hidden="true" />
                                ) : rankTone === "bronze" ? (
                                  <Award size={16} aria-hidden="true" />
                                ) : (
                                  <Trophy size={16} aria-hidden="true" />
                                )}
                                <span>{winner.rank ?? `#${idx + 1}`}</span>
                              </div>
                              <div className="club-winner-info">
                                <h4 className="club-winner-name">{winner.team}</h4>
                                {winner.prize && (
                                  <span className="club-winner-prize">{winner.prize}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.gallery && event.gallery.length > 0 && (
              <section className="club-event-section" aria-labelledby="event-gallery-heading">
                <h2 id="event-gallery-heading" className="club-event-section-title">
                  <Camera size={20} aria-hidden="true" />
                  Event Moments
                </h2>
                <div className="club-event-gallery-grid">
                  {event.gallery.map((photo, idx) => (
                    <figure key={idx} className="club-gallery-moment club-event-moment">
                      <MediaFrame
                        src={photo.src}
                        alt={photo.alt}
                        label="Event moment"
                        className="club-gallery-photo club-event-gallery-photo"
                        sizes="(max-width: 900px) 100vw, 50vw"
                      />
                      {photo.caption && (
                        <figcaption>{photo.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {event.prizes && event.prizes.length > 0 && (
              <section className="club-event-section" aria-labelledby="event-prizes-heading">
                <h2 id="event-prizes-heading" className="club-event-section-title">
                  <Trophy size={20} aria-hidden="true" />
                  Prizes &amp; Incentives
                </h2>
                <div className="club-prizes-grid">
                  {event.prizes.map((prize) => (
                    <div
                      key={prize.title}
                      className={`club-prize-card${prize.highlight ? " club-prize-highlight" : ""}`}
                    >
                      <h3 className="club-prize-title">{prize.title}</h3>
                      <p className="club-prize-desc">{prize.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.timeline && event.timeline.length > 0 && (
              <section className="club-event-section" aria-labelledby="event-timeline-heading">
                <h2 id="event-timeline-heading" className="club-event-section-title">
                  <Clock size={20} aria-hidden="true" />
                  Stages &amp; Timelines
                </h2>
                <div className="club-timeline">
                  {event.timeline.map((item, index) => (
                    <div key={item.title} className="club-timeline-item">
                      <div className="club-timeline-track" aria-hidden="true">
                        <span className="club-timeline-dot" />
                        {index < event.timeline!.length - 1 && <span className="club-timeline-line" />}
                      </div>
                      <div className="club-timeline-body">
                        <span className="club-timeline-time">{item.time}</span>
                        <h3 className="club-timeline-title">{item.title}</h3>
                        {item.description && <p className="club-timeline-desc">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.rules && event.rules.length > 0 && (
              <section className="club-event-section" aria-labelledby="event-rules-heading">
                <h2 id="event-rules-heading" className="club-event-section-title">
                  <CheckCircle2 size={20} aria-hidden="true" />
                  Rules &amp; Guidelines
                </h2>
                <ol className="club-rules-list">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="club-rule-item">
                      <span className="club-rule-number" aria-hidden="true">{idx + 1}</span>
                      <span className="club-rule-text">{rule}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </div>
      </section>
      <HomeFooter />
    </HomeMotion>
  );
}

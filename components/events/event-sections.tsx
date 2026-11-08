import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eventPath } from "@/lib/events/helpers";
import type { ClubEvent, EventSection } from "@/lib/events/schema";

function SectionContent({
  section,
  event,
}: {
  section: EventSection;
  event: ClubEvent;
}) {
  switch (section.type) {
    case "story":
      return (
        <>
          <div className="event-prose">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {section.cards && (
            <div className="event-detail-grid">
              {section.cards.map((card) => (
                <div className="event-detail-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      );
    case "notice":
      return (
        <div className="event-notice">
          {section.label && <p className="club-eyebrow">{section.label}</p>}
          <p>{section.body}</p>
        </div>
      );
    case "list": {
      const List = section.style === "numbered" ? "ol" : "ul";
      return (
        <List className={`event-guidelines event-guidelines-${section.style}`}>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      );
    }
    case "schedule":
      return (
        <ol className="club-timeline event-schedule">
          {section.items.map((item, index) => (
            <li key={`${item.title}-${index}`} className="club-timeline-item">
              <div className="club-timeline-track" aria-hidden="true">
                <span className="club-timeline-dot" />
                {index < section.items.length - 1 && (
                  <span className="club-timeline-line" />
                )}
              </div>
              <div className="club-timeline-body">
                <span className="club-timeline-time">{item.time}</span>
                <h3 className="club-timeline-title">{item.title}</h3>
                {item.description && (
                  <p className="club-timeline-desc">{item.description}</p>
                )}
                {item.resources?.map((resource) => (
                  <a
                    className="event-resource-link"
                    href={resource.url}
                    key={resource.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {resource.title}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>
      );
    case "resources":
      return (
        <div className="event-detail-grid">
          {section.links.map((resource) => (
            <a
              className="event-detail-card event-resource-link"
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <h3>{resource.title}</h3>
                {resource.description && <p>{resource.description}</p>}
              </div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          ))}
        </div>
      );
    case "speakers":
      return (
        <div className="event-detail-grid">
          {section.people.map((person) => (
            <article className="event-detail-card" key={person.name}>
              {person.image && (
                <Image
                  src={person.image}
                  alt={person.name}
                  width={80}
                  height={80}
                  className="event-speaker-photo"
                />
              )}
              <h3>
                {person.url ? (
                  <a href={person.url} target="_blank" rel="noreferrer">
                    {person.name}
                  </a>
                ) : (
                  person.name
                )}
              </h3>
              {person.role && <p className="club-eyebrow">{person.role}</p>}
              {person.bio && <p>{person.bio}</p>}
            </article>
          ))}
        </div>
      );
    case "faq":
      return (
        <div className="event-faq">
          {section.items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      );
    case "prizes":
      return (
        <div className="club-prizes-grid">
          {section.items.map((prize) => (
            <div
              key={prize.title}
              className={`club-prize-card${prize.highlight ? " club-prize-highlight" : ""}`}
            >
              <h3 className="club-prize-title">{prize.title}</h3>
              <p className="club-prize-desc">{prize.description}</p>
            </div>
          ))}
        </div>
      );
    case "challenges":
      return (
        <>
          {section.description && (
            <p className="event-section-intro">{section.description}</p>
          )}
          <div className="event-detail-grid">
            {section.tracks.map((track) => {
              const count = section.statements.filter(
                (statement) => statement.trackId === track.id,
              ).length;
              return (
                <div className="event-detail-card" key={track.id}>
                  <h3>{track.title}</h3>
                  {track.description && <p>{track.description}</p>}
                  {count > 0 && (
                    <Link
                      className="club-text-link"
                      href={`${eventPath(event)}/problem-statements?track=${track.id}`}
                    >
                      {count}{" "}
                      {count === 1 ? "problem statement" : "problem statements"}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          {section.statements.length > 0 && (
            <Button
              asChild
              variant="outline"
              className="club-button event-section-action"
            >
              <Link href={`${eventPath(event)}/problem-statements`}>
                Explore all problem statements
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
          )}
        </>
      );
    case "results": {
      const tracks =
        event.sections.find((item) => item.type === "challenges")?.tracks ?? [];
      const trackIds = [
        ...new Set(section.items.map((result) => result.trackId)),
      ];
      return (
        <div className="event-results">
          {trackIds.map((trackId) => (
            <div className="event-results-group" key={trackId ?? "overall"}>
              {trackId && (
                <h3>{tracks.find((track) => track.id === trackId)?.title}</h3>
              )}
              <div className="event-results-list">
                {section.items
                  .filter((result) => result.trackId === trackId)
                  .map((result, index) => (
                    <div
                      className="event-result"
                      key={`${result.team}-${index}`}
                    >
                      <div className="event-result-rank">
                        <Trophy size={18} aria-hidden="true" />
                        <span>{result.rank ?? `#${index + 1}`}</span>
                      </div>
                      <div>
                        <h4>{result.team}</h4>
                        {result.prize && <p>{result.prize}</p>}
                        {result.description && <p>{result.description}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
}

export function EventSections({
  event,
  sections,
}: {
  event: ClubEvent;
  sections: EventSection[];
}) {
  return (
    <>
      {sections.map((section, index) => (
        <section
          className="event-content-section event-section-layout"
          key={section.id}
          id={`section-${section.id}`}
          aria-labelledby={`heading-${section.id}`}
        >
          <div className="event-section-heading">
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h2 id={`heading-${section.id}`}>{section.title}</h2>
          </div>
          <div className="event-section-body">
            <SectionContent section={section} event={event} />
          </div>
        </section>
      ))}
    </>
  );
}

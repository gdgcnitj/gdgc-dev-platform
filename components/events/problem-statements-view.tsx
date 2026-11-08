"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChallengeDocument } from "./challenge-document";
import { eventPath } from "@/lib/events/helpers";
import type { EventProblemData } from "@/lib/content/problem-statements";
import type { ClubEvent } from "@/lib/events/schema";

type EventIdentity = Pick<ClubEvent, "slug" | "title" | "color">;

function ProblemStatementsContent({
  event,
  problemData,
}: {
  event: EventIdentity;
  problemData: EventProblemData;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const article = useRef<HTMLElement>(null);
  const documentTitle = useRef<HTMLHeadingElement>(null);
  const shouldScroll = useRef(false);
  const [hashTarget, setHashTarget] = useState<string>();
  const trackParam = searchParams.get("track");
  const psParam = searchParams.get("ps");
  const availableTracks = problemData.tracks.filter((track) => track.count > 0);
  const targetStatement = problemData.statements.find(
    (statement) => statement.id === (hashTarget || psParam),
  );
  const requestedTrack = availableTracks.some(
    (track) => track.id === trackParam,
  )
    ? trackParam
    : "all";
  const activeTrack =
    requestedTrack !== "all" && targetStatement
      ? targetStatement.trackId
      : requestedTrack;
  const statements = problemData.statements.filter(
    (statement) =>
      activeTrack === "all" ||
      statement.trackId === activeTrack ||
      statement.id === hashTarget ||
      statement.id === psParam,
  );
  const selected =
    statements.find((statement) => statement.id === (hashTarget || psParam)) ??
    statements[0];

  useEffect(() => {
    if (!shouldScroll.current || !selected) return;
    shouldScroll.current = false;
    documentTitle.current?.focus({ preventScroll: true });
    article.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }, [selected]);

  useEffect(() => {
    const readHash = () => {
      const target = window.location.hash.slice(1);
      setHashTarget(
        problemData.statements.some((statement) => statement.id === target)
          ? target
          : undefined,
      );
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [problemData.statements]);

  const navigate = (params: URLSearchParams) => {
    setHashTarget(undefined);
    router.replace(params.size ? `${pathname}?${params}` : pathname, {
      scroll: false,
    });
  };
  const selectStatement = (id: string) => {
    shouldScroll.current = true;
    const params = new URLSearchParams(searchParams.toString());
    params.set("ps", id);
    navigate(params);
  };
  const selectTrack = (trackId: string) => {
    shouldScroll.current = true;
    const params = new URLSearchParams(searchParams.toString());
    if (trackId === "all") params.delete("track");
    else params.set("track", trackId);
    params.delete("ps");
    navigate(params);
  };

  if (!selected) return null;
  const track = problemData.tracks.find((item) => item.id === selected.trackId);
  const position = statements.findIndex(
    (statement) => statement.id === selected.id,
  );
  const number =
    problemData.statements.findIndex(
      (statement) => statement.id === selected.id,
    ) + 1;

  return (
    <div className="challenge-page">
      <header className="club-container challenge-header">
        <Link href={eventPath(event)} className="club-back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to {event.title}
        </Link>
        <p className="challenge-eyebrow">{event.title} / Build challenges</p>
        <h1>Problem statements</h1>
        <p className="challenge-intro">{problemData.description}</p>
      </header>
      <div className="club-container challenge-layout">
        <aside className="challenge-sidebar" aria-label="Challenge navigation">
          {availableTracks.length > 1 && (
            <label className="challenge-select">
              Track
              <select
                value={activeTrack ?? "all"}
                onChange={(event) => selectTrack(event.target.value)}
              >
                <option value="all">All tracks</option>
                {availableTracks.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.title} ({item.count})
                  </option>
                ))}
              </select>
            </label>
          )}
          <nav className="challenge-index" aria-label="Problem statements">
            {statements.map((statement) => (
              <button
                type="button"
                key={statement.id}
                aria-current={selected.id === statement.id ? "page" : undefined}
                onClick={() => selectStatement(statement.id)}
              >
                <span className="challenge-index-number">
                  {String(
                    problemData.statements.findIndex(
                      (item) => item.id === statement.id,
                    ) + 1,
                  ).padStart(2, "0")}
                </span>
                <span>{statement.title}</span>
              </button>
            ))}
          </nav>
          {statements.length > 1 && (
            <label className="challenge-select challenge-mobile-select">
              Problem statement
              <select
                value={selected.id}
                onChange={(event) => selectStatement(event.target.value)}
              >
                {statements.map((statement) => (
                  <option value={statement.id} key={statement.id}>
                    {statement.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </aside>
        <article
          ref={article}
          className="challenge-document"
          id={selected.id}
          aria-labelledby="challenge-title"
        >
          <header className="challenge-document-header">
            <p className="challenge-eyebrow">
              {track?.title} <span aria-hidden="true">/</span> Challenge{" "}
              {String(number).padStart(2, "0")}
            </p>
            <h2 id="challenge-title" ref={documentTitle} tabIndex={-1}>
              {selected.title}
            </h2>
            <p className="challenge-tagline">{selected.tagline}</p>
            {selected.highlights.length > 0 && (
              <ul className="challenge-highlights" aria-label="At a glance">
                {selected.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
          </header>
          <ChallengeDocument statement={selected} />
          {statements.length > 1 && (
            <nav
              className="challenge-pagination"
              aria-label="Next or previous challenge"
            >
              {position > 0 ? (
                <button
                  type="button"
                  onClick={() => selectStatement(statements[position - 1].id)}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                  <span>
                    <small>Previous challenge</small>
                    {statements[position - 1].title}
                  </span>
                </button>
              ) : (
                <span />
              )}
              {position < statements.length - 1 && (
                <button
                  type="button"
                  onClick={() => selectStatement(statements[position + 1].id)}
                >
                  <span>
                    <small>Next challenge</small>
                    {statements[position + 1].title}
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              )}
            </nav>
          )}
        </article>
      </div>
    </div>
  );
}

export function ProblemStatementsView({
  event,
  problemData,
}: {
  event: EventIdentity;
  problemData: EventProblemData;
}) {
  return (
    <Suspense
      fallback={
        <div className="club-container challenge-header">
          <p>Loading problem statements…</p>
        </div>
      }
    >
      <ProblemStatementsContent event={event} problemData={problemData} />
    </Suspense>
  );
}

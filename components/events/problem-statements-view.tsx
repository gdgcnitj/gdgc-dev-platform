"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  Layers,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClubEvent } from "@/lib/content/home";
import type { EventProblemData } from "@/lib/content/problem-statements";

type FilterTab = "all" | "main" | "freshers";

function getStatementIcon(id: string) {
  switch (id) {
    case "p2p-inference":
      return Cpu;
    case "hivenet-storage":
      return HardDrive;
    case "autonomous-intersection":
      return Car;
    case "reach-together":
      return Users;
    default:
      return Layers;
  }
}

function ProblemStatementsContent({
  event,
  problemData,
}: {
  event: ClubEvent;
  problemData: EventProblemData;
}) {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");
  const psParam = searchParams.get("ps");

  const initialTab: FilterTab =
    trackParam === "main" || trackParam === "freshers" ? trackParam : "all";

  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);
  const [, startTransition] = useTransition();

  // Track expanded cards. By default, open targeted or first statement.
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    let target = psParam || (trackParam === "freshers" ? "reach-together" : "p2p-inference");
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (hash) target = hash;
    }
    return { [target]: true };
  });

  // Subscribe to external hashchange events
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setExpandedIds((prev) => (prev[hash] ? prev : { ...prev, [hash]: true }));
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("hashchange", handleHash);
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTabChange = (tab: FilterTab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  const filteredStatements = problemData.statements.filter((ps) => {
    if (activeTab === "all") return true;
    return ps.trackId === activeTab;
  });

  const allExpanded = filteredStatements.every((ps) => expandedIds[ps.id]);

  const toggleAll = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = { ...expandedIds };
    for (const ps of filteredStatements) {
      updated[ps.id] = nextState;
    }
    setExpandedIds(updated);
  };

  return (
    <section className="club-hero-field" aria-labelledby="ps-page-title">
      <div className="club-container club-ps-page" data-tone={event.color}>
        {/* Navigation & Header */}
        <div className="club-ps-header">
          <Link href={`/events/${event.id}`} className="club-back-link">
            <ArrowLeft size={16} aria-hidden="true" /> Back to {event.title}
          </Link>

          <p className="club-eyebrow">
            <span className="club-tone-dot" />
            {event.title} 2026 · Challenge Archive
          </p>

          <h1 id="ps-page-title" className="club-ps-title">
            Problem Statements
          </h1>
          <p className="club-ps-subtitle">{problemData.description}</p>

          {/* Controls Bar: Track Filters & Expand/Collapse All */}
          <div className="club-ps-controls">
            <div className="club-ps-tabs" role="tablist" aria-label="Problem statement track filter">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "all"}
                className={`club-ps-tab${activeTab === "all" ? " is-active" : ""}`}
                onClick={() => handleTabChange("all")}
              >
                All Challenges ({problemData.statements.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "main"}
                className={`club-ps-tab${activeTab === "main" ? " is-active" : ""}`}
                onClick={() => handleTabChange("main")}
              >
                Main Track (3)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "freshers"}
                className={`club-ps-tab${activeTab === "freshers" ? " is-active" : ""}`}
                onClick={() => handleTabChange("freshers")}
              >
                Freshers Track (1)
              </button>
            </div>

            <button
              type="button"
              className="club-ps-expand-all-btn"
              onClick={toggleAll}
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </button>
          </div>
        </div>

        {/* Problem Statements List */}
        <div className="club-ps-list">
          {filteredStatements.map((ps, idx) => {
            const Icon = getStatementIcon(ps.id);
            const isFreshers = ps.trackId === "freshers";
            const isExpanded = Boolean(expandedIds[ps.id]);

            return (
              <article
                key={ps.id}
                id={ps.id}
                className={`club-ps-card${isFreshers ? " club-ps-card-freshers" : ""}${
                  isExpanded ? " is-expanded" : " is-collapsed"
                }`}
              >
                {/* Clickable Summary Header Card */}
                <div
                  className="club-ps-summary"
                  onClick={() => toggleExpand(ps.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(ps.id);
                    }
                  }}
                >
                  <div className="club-ps-summary-left">
                    <div className="club-ps-badges">
                      <span
                        className={`club-ps-track-pill ${
                          isFreshers ? "club-ps-track-freshers" : "club-ps-track-main"
                        }`}
                      >
                        {ps.trackTitle}
                      </span>
                      <span className="club-ps-tech-badge">{ps.badge}</span>
                      <span className="club-ps-num-badge">PS #{idx + 1}</span>
                    </div>

                    <h2 className="club-ps-name">
                      <Icon size={24} className="club-ps-icon" aria-hidden="true" />
                      <span>{ps.title}</span>
                    </h2>

                    <p className="club-ps-tagline">{ps.tagline}</p>

                    {/* Quick Highlight Chips */}
                    <div className="club-ps-highlights">
                      {ps.highlights.map((chip) => (
                        <span key={chip} className="club-ps-highlight-chip">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="club-ps-summary-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="club-ps-toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(ps.id);
                      }}
                      aria-label={isExpanded ? "Collapse specification" : "View full specification"}
                    >
                      {isExpanded ? (
                        <>
                          Hide Details
                          <ChevronUp size={16} aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          View Specification
                          <ChevronDown size={16} aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Detailed Content */}
                {isExpanded && (
                  <div className="club-ps-details-content">
                    {/* Objective */}
                    <div className="club-ps-block">
                      <h3 className="club-ps-block-title">Objective</h3>
                      <p className="club-ps-text">{ps.objective}</p>
                    </div>

                    {/* Target Runtime & Stack */}
                    <div className="club-ps-block club-ps-runtime-box">
                      <div className="club-ps-runtime-item">
                        <span className="club-ps-label">Target Runtime</span>
                        <span className="club-ps-value">{ps.runtime.target}</span>
                      </div>
                      <div className="club-ps-runtime-item">
                        <span className="club-ps-label">Stack Freedom</span>
                        <span className="club-ps-value">{ps.runtime.description}</span>
                      </div>
                      {ps.runtime.mandate && (
                        <div className="club-ps-runtime-item club-ps-mandate">
                          <span className="club-ps-label">Testing Mandate</span>
                          <span className="club-ps-value">{ps.runtime.mandate}</span>
                        </div>
                      )}
                    </div>

                    {/* Specifications Grid */}
                    {ps.specs && ps.specs.length > 0 && (
                      <div className="club-ps-block">
                        <h3 className="club-ps-block-title">Key Specifications</h3>
                        <dl className="club-ps-specs-grid">
                          {ps.specs.map((item) => (
                            <div key={item.label} className="club-ps-spec-item">
                              <dt className="club-ps-spec-label">{item.label}</dt>
                              <dd className="club-ps-spec-value">{item.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}

                    {/* System Architecture / Flow */}
                    {ps.architecture && (
                      <div className="club-ps-block">
                        <h3 className="club-ps-block-title">Architecture &amp; Flow</h3>
                        <p className="club-ps-text">{ps.architecture.summary}</p>

                        {ps.architecture.steps && (
                          <ol className="club-ps-flow-steps">
                            {ps.architecture.steps.map((step) => (
                              <li key={step.step} className="club-ps-flow-step">
                                <span className="club-ps-step-tag">{step.step}</span>
                                <span className="club-ps-step-desc">{step.description}</span>
                              </li>
                            ))}
                          </ol>
                        )}

                        {ps.architecture.notes && (
                          <div className="club-ps-notes">
                            {ps.architecture.notes.map((note, i) => (
                              <p key={i} className="club-ps-note-text">
                                <strong>Evaluation Note:</strong> {note}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Core Features for Freshers Track */}
                    {ps.coreFeatures && (
                      <div className="club-ps-block">
                        <h3 className="club-ps-block-title">Core Features to Build</h3>
                        <div className="club-ps-features-grid">
                          {ps.coreFeatures.map((feat) => (
                            <div key={feat.title} className="club-ps-feature-card">
                              <h4 className="club-ps-feature-title">{feat.title}</h4>
                              <p className="club-ps-feature-desc">{feat.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bonus Points */}
                    {ps.bonusPoints && (
                      <div className="club-ps-block club-ps-bonus-box">
                        <div className="club-ps-bonus-header">
                          <Star size={18} className="club-ps-bonus-icon" aria-hidden="true" />
                          <h3 className="club-ps-bonus-title">Brownie Points Feature</h3>
                        </div>
                        <ul className="club-ps-bonus-list">
                          {ps.bonusPoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Hard Requirements & Prohibitions Grid */}
                    <div className="club-ps-rules-container">
                      <div className="club-ps-requirements-col">
                        <div className="club-ps-rules-header club-ps-header-req">
                          <CheckCircle2 size={16} aria-hidden="true" />
                          <h4>Hard Requirements</h4>
                        </div>
                        <ul className="club-ps-rules-checklist">
                          {ps.hardRequirements.map((req, rIdx) => (
                            <li key={rIdx}>
                              <CheckCircle2 size={16} className="club-ps-check-icon" aria-hidden="true" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="club-ps-prohibited-col">
                        <div className="club-ps-rules-header club-ps-header-prohib">
                          <AlertTriangle size={16} aria-hidden="true" />
                          <h4>Strictly Prohibited</h4>
                        </div>
                        <ul className="club-ps-prohibited-list">
                          {ps.strictlyProhibited.map((prohib, pIdx) => (
                            <li key={pIdx}>
                              <span className="club-ps-ban-dot" aria-hidden="true" />
                              <span>{prohib}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Footer Navigation Action */}
        <div className="club-ps-bottom-action">
          <Link href={`/events/${event.id}`} className="club-back-link">
            <ArrowLeft size={16} aria-hidden="true" /> Back to {event.title} Winners &amp; Moments
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProblemStatementsView({
  event,
  problemData,
}: {
  event: ClubEvent;
  problemData: EventProblemData;
}) {
  return (
    <Suspense
      fallback={
        <section className="club-hero-field">
          <div className="club-container club-ps-page">
            <p className="club-eyebrow">Loading problem statements...</p>
          </div>
        </section>
      }
    >
      <ProblemStatementsContent event={event} problemData={problemData} />
    </Suspense>
  );
}

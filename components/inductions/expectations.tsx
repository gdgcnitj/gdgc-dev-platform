"use client";

import { useRef } from "react";
import { BookOpen, X } from "lucide-react";
import { getDepartment } from "@/lib/content/departments";
import type { InductionDepartment } from "@/lib/inductions/schema";
import { DepartmentIcon } from "./department-icon";
import { ExpectationsPdfLink } from "./pdf-link";

// Staggers list items as the sheet opens; the index is capped so long lists stay quick.
const stagger = (index: number) =>
  ({ "--i": Math.min(index, 12) }) as React.CSSProperties;

function ExpectationContent({
  content,
}: {
  content: NonNullable<InductionDepartment["expectations"]>;
}) {
  return (
    <div className="induction-expectation-content">
      {content.intro && (
        <p className="induction-track-intro">{content.intro}</p>
      )}
      {content.groups.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item, index) => (
              <li key={item} style={stagger(index)}>
                {item}
              </li>
            ))}
          </ul>
          {group.sections?.map((section) => (
            <div
              className="induction-expectation-subsection"
              key={section.title}
            >
              <h4>{section.title}</h4>
              <ul>
                {section.items.map((item, index) => (
                  <li key={item} style={stagger(index)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
      {content.tracks && (
        <div className="induction-tracks">
          {content.tracksIntro && (
            <p className="induction-track-intro">{content.tracksIntro}</p>
          )}
          {content.tracks.map((track) => (
            <section key={track.title}>
              <h3>{track.title}</h3>
              <ul>
                {track.items.map((item, index) => (
                  <li key={item} style={stagger(index)}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// A native modal dialog keeps focus, Escape, and the backdrop accessible without a dependency.
export function Expectations({
  department,
  cycleId,
  label = "See what’s expected",
}: {
  department: InductionDepartment;
  cycleId: string;
  label?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const identity = getDepartment(department.id)!;
  const titleId = `expectations-${department.id}-title`;
  if (!department.expectations)
    return (
      <span className="induction-expectations-pending">
        Expectations will be shared soon.
      </span>
    );
  return (
    <>
      <button
        type="button"
        className="induction-expectations-trigger"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <BookOpen size={16} aria-hidden="true" /> {label}
      </button>
      <dialog
        ref={dialog}
        className="induction-sheet"
        data-tone={identity.color}
        aria-labelledby={titleId}
        onClick={(event) => {
          // Clicks on the backdrop land on the dialog element itself.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="induction-sheet-panel">
          <header className="induction-sheet-header">
            <span className="induction-department-icon">
              <DepartmentIcon id={department.id} />
            </span>
            <div>
              <p className="club-eyebrow">Expectations</p>
              <h2 id={titleId}>{identity.inductionTitle}</h2>
            </div>
            <button
              type="button"
              className="induction-sheet-close"
              aria-label="Close expectations"
              onClick={() => dialog.current?.close()}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <div className="induction-sheet-body">
            <p className="induction-sheet-preview">{department.preview}</p>
            <p className="induction-reassurance">
              These are expectations, not requirements. You don’t need to know
              all of them to get in.
            </p>
            <ExpectationContent content={department.expectations} />
          </div>
          <footer className="induction-sheet-footer">
            <span>Keep a copy to read again later.</span>
            <ExpectationsPdfLink
              cycleId={cycleId}
              department={department}
              label="Download PDF"
              className="induction-pdf-button"
            />
          </footer>
        </div>
      </dialog>
    </>
  );
}

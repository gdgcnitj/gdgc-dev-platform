"use client";

import { useRef } from "react";
import { BookOpen, X } from "lucide-react";
import { getDepartment } from "@/lib/content/departments";
import type { InductionDepartment } from "@/lib/inductions/schema";
import { DepartmentIcon } from "./department-icon";

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
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {group.sections?.map((section) => (
            <div
              className="induction-expectation-subsection"
              key={section.title}
            >
              <h4>{section.title}</h4>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
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
                {track.items.map((item) => (
                  <li key={item}>{item}</li>
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
}: {
  department: InductionDepartment;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const identity = getDepartment(department.id)!;
  const titleId = `expectations-${department.id}-title`;
  if (!department.expectations)
    return (
      <p className="induction-expectations-pending">
        Expectations will be shared soon.
      </p>
    );
  return (
    <>
      <button
        type="button"
        className="induction-expectations-trigger"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <BookOpen size={16} aria-hidden="true" /> See what’s expected
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
            <ExpectationContent content={department.expectations} />
          </div>
        </div>
      </dialog>
    </>
  );
}

"use client";

import type { InductionCycle } from "@/lib/inductions/schema";
import { DepartmentChoices } from "./department-choices";
import { useInductionFlow } from "./flow-provider";

export function ApplicationOverview({
  cycle,
  eventSlug,
  eventTitle,
  open,
  status,
}: {
  cycle: InductionCycle;
  eventSlug: string;
  eventTitle: string;
  open: boolean;
  status: string;
}) {
  const { common, commonReady, received } = useInductionFlow();
  return (
    <>
      <div className="induction-application-heading">
        <p className="club-eyebrow">{eventTitle}</p>
        <h1>
          Where do you want
          <br />
          to contribute?
        </h1>
        {commonReady && (
          <p className="induction-session-note">
            Your common details are ready{common.name ? `, ${common.name}` : ""}
            . Choose another department to continue.
          </p>
        )}
      </div>
      <DepartmentChoices
        cycle={cycle}
        eventSlug={eventSlug}
        open={open}
        status={status}
        received={received}
        headingLevel={2}
      />
    </>
  );
}

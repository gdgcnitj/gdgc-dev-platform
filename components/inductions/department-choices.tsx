import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  Braces,
  CheckCircle2,
  CloudCog,
  Code2,
  HeartHandshake,
  PanelsTopLeft,
  PenTool,
  Smartphone,
} from "lucide-react";
import { getDepartment, type DepartmentId } from "@/lib/content/departments";
import type { InductionCycle } from "@/lib/inductions/schema";
import { Expectations } from "./expectations";

const icons = {
  web: Code2,
  ai: BrainCircuit,
  ui: PanelsTopLeft,
  cp: Braces,
  mobile: Smartphone,
  wit: HeartHandshake,
  devsecops: CloudCog,
  creatives: PenTool,
};

export function DepartmentIcon({
  id,
  size = 26,
}: {
  id: DepartmentId;
  size?: number;
}) {
  const Icon = icons[id];
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}

export function DepartmentChoices({
  cycle,
  eventSlug,
  open,
  status,
  received = [],
  headingLevel = 3,
}: {
  cycle: InductionCycle;
  eventSlug: string;
  open: boolean;
  status?: string;
  received?: string[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <>
      <p className="event-section-intro">
        Different interests. One community. Explore a department, see what it
        expects, and tell us a little about yourself. You can apply to more than
        one.
      </p>
      {!open && (
        <p className="induction-availability" role="status">
          {status === "upcoming"
            ? "Interest forms open soon."
            : status === "waitlist"
              ? "Interest forms are on a waitlist."
              : "Interest forms are closed."}
        </p>
      )}
      <div className="induction-department-grid">
        {cycle.departments.map((department) => {
          const identity = getDepartment(department.id)!;
          const submitted = received.includes(department.id);
          return (
            <article
              className="induction-department"
              data-tone={identity.color}
              key={department.id}
            >
              <div className="induction-department-heading">
                <span className="induction-department-icon">
                  <DepartmentIcon id={department.id} />
                </span>
                <Heading>{identity.inductionTitle}</Heading>
              </div>
              <p>{department.preview}</p>
              <div className="induction-department-action">
                {submitted ? (
                  <span className="induction-received">
                    <CheckCircle2 size={17} aria-hidden="true" /> Interest
                    submitted
                  </span>
                ) : (
                  open && (
                    <Button asChild className="club-button">
                      <Link
                        href={`/events/${eventSlug}/apply/${department.id}`}
                      >
                        Open interest form{" "}
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </Button>
                  )
                )}
              </div>
              <Expectations
                department={department}
                headingLevel={headingLevel === 2 ? 3 : 4}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}

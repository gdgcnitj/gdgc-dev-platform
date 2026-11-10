import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getDepartment } from "@/lib/content/departments";
import type { InductionCycle } from "@/lib/inductions/schema";
import { DepartmentIcon } from "./department-icon";
import { Expectations } from "./expectations";

export function DepartmentChoices({
  cycle,
  eventSlug,
  open,
  status,
}: {
  cycle: InductionCycle;
  eventSlug: string;
  open: boolean;
  status?: string;
}) {
  return (
    <>
      <p className="event-section-intro">
        Different interests. One community. Explore a department, see what it
        expects, and tell us a little about yourself. You can apply to up to{" "}
        {cycle.maxDepartments === 2 ? "two" : cycle.maxDepartments} in one
        application.
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
        {cycle.departments.map((department, index) => {
          const identity = getDepartment(department.id)!;
          return (
            <article
              className="induction-department"
              data-tone={identity.color}
              data-reveal="card"
              data-reveal-order={index % 2}
              key={department.id}
            >
              <div className="induction-department-heading">
                <span className="induction-department-icon">
                  <DepartmentIcon id={department.id} />
                </span>
                <h3>{identity.inductionTitle}</h3>
              </div>
              <p>{department.preview}</p>
              <div className="induction-department-action">
                {open && (
                  <Button asChild className="club-button">
                    <Link
                      href={`/events/${eventSlug}/apply?department=${department.id}`}
                    >
                      Apply <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </Button>
                )}
                <Expectations department={department} />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getDepartment } from "@/lib/content/departments";
import { departments } from "@/lib/content/home";
import type { InductionCycle } from "@/lib/inductions/schema";
import { BracketMark } from "./bracket-mark";
import { DepartmentIcon } from "./department-icon";
import { Expectations } from "./expectations";
import { ExpectationsPdfLink } from "./pdf-link";

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
  const count = cycle.maxDepartments === 2 ? "two" : cycle.maxDepartments;
  return (
    <>
      <p className="event-section-intro">
        Different interests. One community. Read what each domain expects,
        keep a PDF if you like, then apply once and choose up to {count}. These
        are expectations, not requirements: you don’t need to know all of them
        to get in.
      </p>
      <div className="induction-apply-banner" data-reveal="card">
        <BracketMark className="induction-apply-mark" />
        <div>
          <h3>One application, up to {count} domains</h3>
          <p>
            {open
              ? "Your details first, then your choices in order of preference, then a few questions for each."
              : status === "upcoming"
                ? "Applications open soon."
                : status === "waitlist"
                  ? "Applications are on a waitlist."
                  : "Applications are closed."}
          </p>
        </div>
        {open && (
          <Button asChild className="club-button">
            <Link href={`/events/${eventSlug}/apply`}>
              Start your application <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
      <div className="induction-department-grid">
        {cycle.departments.map((department, index) => {
          const identity = getDepartment(department.id)!;
          const profile = departments.find((item) => item.id === department.id);
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
              {profile && (
                <p className="induction-lead">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt=""
                      width={28}
                      height={28}
                      className="induction-lead-photo"
                    />
                  ) : (
                    <span className="induction-lead-photo" aria-hidden="true">
                      {profile.initials}
                    </span>
                  )}
                  <span>
                    Led by <strong>{profile.lead}</strong>
                  </span>
                </p>
              )}
              {!department.applications ? (
                <p className="induction-membership">{department.membership}</p>
              ) : (
                <div className="induction-department-action">
                  <Expectations department={department} cycleId={cycle.id} />
                  <ExpectationsPdfLink
                    cycleId={cycle.id}
                    department={department}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}

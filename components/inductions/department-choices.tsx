import Image from "next/image";
import { getDepartment } from "@/lib/content/departments";
import { departments } from "@/lib/content/home";
import type { InductionCycle } from "@/lib/inductions/schema";
import { ApplicationInvitation } from "./application-invitation";
import { DepartmentIcon } from "./department-icon";
import { Expectations } from "./expectations";
import { ExpectationsPdfLink } from "./pdf-link";

export function DepartmentChoices({
  cycle,
  eventSlug,
  archived,
  open,
  status,
  closesAt,
}: {
  cycle: InductionCycle;
  eventSlug: string;
  archived?: boolean;
  open: boolean;
  status?: string;
  closesAt?: string;
}) {
  const count = cycle.maxDepartments === 2 ? "two" : cycle.maxDepartments;
  return (
    <>
      <p className="event-section-intro">
        {archived
          ? "Explore the topics each domain shared with candidates and download the preparation guides."
          : `Different interests. One community. Read what each domain expects, keep a PDF if you like, then apply once and choose up to ${count}. These are expectations, not requirements: you don’t need to know all of them to get in.`}
      </p>
      {!archived && (
        <ApplicationInvitation
          eventSlug={eventSlug}
          maxDepartments={cycle.maxDepartments}
          open={open}
          status={status}
          closesAt={closesAt}
        />
      )}
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

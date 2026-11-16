"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BracketMark } from "./bracket-mark";
import { useInductionDeadline } from "./deadline";

export function ApplicationInvitation({
  eventSlug,
  maxDepartments,
  open,
  status,
  closesAt,
}: {
  eventSlug: string;
  maxDepartments: number;
  open: boolean;
  status?: string;
  closesAt?: string;
}) {
  const remaining = useInductionDeadline(closesAt);
  const expired = remaining?.totalSeconds === 0;
  const canApply = open && !expired;
  const count = maxDepartments === 2 ? "two" : maxDepartments;
  return (
    <div className="induction-apply-banner" data-reveal="card">
      <BracketMark className="induction-apply-mark" />
      <div>
        <h3>One application, up to {count} domains</h3>
        <p>
          {canApply
            ? "Your details first, then your choices in order of preference, then a few questions for each."
            : expired
              ? "The deadline has passed. Applications are closed."
              : status === "upcoming"
                ? "Applications open soon."
                : status === "waitlist"
                  ? "Applications are on a waitlist."
                  : "Applications are closed."}
        </p>
      </div>
      {canApply && (
        <Button asChild className="club-button">
          <Link href={`/events/${eventSlug}/apply`}>
            Start your application <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Button>
      )}
    </div>
  );
}

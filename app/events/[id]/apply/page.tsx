import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/content/events";
import { getEventInduction } from "@/lib/content/inductions";
import { canRegister, registrationStatus } from "@/lib/events/helpers";
import { ApplicationOverview } from "@/components/inductions/application-overview";

export const metadata: Metadata = {
  title: "Choose a department · GDGC NITJ",
  robots: { index: false, follow: true },
};

export default async function Applications({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const event = getEvent((await params).id);
  const cycle = event && getEventInduction(event);
  if (!event || !cycle) notFound();
  return (
    <ApplicationOverview
      cycle={cycle}
      eventSlug={event.slug}
      eventTitle={event.title}
      open={canRegister(event)}
      status={registrationStatus(event)}
    />
  );
}

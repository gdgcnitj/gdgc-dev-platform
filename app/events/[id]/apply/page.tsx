import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/content/events";
import { getEventInduction } from "@/lib/content/inductions";
import { departments } from "@/lib/content/home";
import { canRegister, registrationStatus } from "@/lib/events/helpers";
import { ApplicationFlow } from "@/components/inductions/application-flow";

export const metadata: Metadata = {
  title: "Apply · GDGC NITJ",
  robots: { index: false, follow: true },
};

export default async function Applications({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ department?: string | string[] }>;
}) {
  const event = getEvent((await params).id);
  const cycle = event && getEventInduction(event);
  if (!event || !cycle) notFound();
  const { department } = await searchParams;
  return (
    <ApplicationFlow
      eventId={event.id}
      eventSlug={event.slug}
      eventTitle={event.title}
      cycle={cycle}
      open={canRegister(event)}
      status={registrationStatus(event)}
      leads={Object.fromEntries(
        departments.map(({ id, lead, image, initials }) => [
          id,
          { name: lead, image, initials },
        ]),
      )}
      initialDepartment={
        typeof department === "string" ? department : undefined
      }
    />
  );
}

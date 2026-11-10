import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/content/events";
import { getDepartment } from "@/lib/content/departments";
import { getEventInduction } from "@/lib/content/inductions";
import { canRegister, registrationStatus } from "@/lib/events/helpers";
import { InterestForm } from "@/components/inductions/interest-form";

type Props = { params: Promise<{ id: string; department: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { department } = await params;
  return {
    title: `${getDepartment(department)?.inductionTitle ?? "Department"} interest form · GDGC NITJ`,
    robots: { index: false, follow: true },
  };
}
export default async function DepartmentApplication({ params }: Props) {
  const { id, department: departmentId } = await params;
  const event = getEvent(id);
  const cycle = event && getEventInduction(event);
  const department = cycle?.departments.find(
    (item) => item.id === departmentId,
  );
  if (!event || !cycle || !department) notFound();
  return (
    <InterestForm
      key={department.id}
      eventId={event.id}
      eventSlug={event.slug}
      eventTitle={event.title}
      cycle={cycle}
      department={department}
      open={canRegister(event)}
      status={registrationStatus(event)}
    />
  );
}

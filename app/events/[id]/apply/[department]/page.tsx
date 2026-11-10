import { notFound, redirect } from "next/navigation";
import { getEvent } from "@/lib/content/events";
import { getEventInduction } from "@/lib/content/inductions";

type Props = { params: Promise<{ id: string; department: string }> };

// Earlier department links open the single application with that choice preselected.
export default async function DepartmentApplication({ params }: Props) {
  const { id, department } = await params;
  const event = getEvent(id);
  const cycle = event && getEventInduction(event);
  if (!event || !cycle?.departments.some((item) => item.id === department))
    notFound();
  redirect(`/events/${event.slug}/apply?department=${department}`);
}

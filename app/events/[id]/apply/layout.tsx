import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEvent } from "@/lib/content/events";
import { getEventInduction } from "@/lib/content/inductions";
import { InductionFlowProvider } from "@/components/inductions/flow-provider";
import { HomeMotion } from "@/components/home/home-motion";
import { HomeFooter } from "@/components/home/footer";

export const dynamic = "force-dynamic";

export default async function ApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const event = getEvent((await params).id);
  const cycle = event && getEventInduction(event);
  if (!event || !cycle) notFound();
  return (
    <HomeMotion>
      <div className="induction-application club-hero-field">
        <div className="club-container">
          <Link href={`/events/${event.slug}`} className="club-back-link">
            <ArrowLeft size={16} aria-hidden="true" /> Back to {event.title}
          </Link>
          <InductionFlowProvider
            key={event.id}
            storageKey={`gdgc-induction:${cycle.id}:v${cycle.version}`}
          >
            {children}
          </InductionFlowProvider>
        </div>
      </div>
      <HomeFooter />
    </HomeMotion>
  );
}

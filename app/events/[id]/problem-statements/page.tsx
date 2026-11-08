import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemStatementsView } from "@/components/events/problem-statements-view";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";
import { allEvents, getEvent } from "@/lib/content/events";
import { getProblemStatements } from "@/lib/content/problem-statements";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return allEvents
    .filter((event) => getProblemStatements(event.id))
    .map((event) => ({ id: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = getEvent(id);
  const problemData = event && getProblemStatements(event.id);

  if (!event || !problemData) {
    return {};
  }

  return {
    title: `Problem Statements · ${event.title} · GDGC NITJ`,
    description: problemData.description,
  };
}

export default async function ProblemStatementsPage({ params }: Props) {
  const { id } = await params;
  const event = getEvent(id);
  const problemData = event && getProblemStatements(event.id);

  if (!event || !problemData) {
    notFound();
  }

  return (
    <HomeMotion>
      <ProblemStatementsView
        event={{ slug: event.slug, title: event.title, color: event.color }}
        problemData={problemData}
      />
      <HomeFooter />
    </HomeMotion>
  );
}
